import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// CREATE
export async function insertBrandDeal(newDeal) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Not logged in');

  const payload = {
    user_id: user.id,
    brand: newDeal.brand || '',
    partner: newDeal.brand || '',               // satisfy NOT NULL partner
    campaign: newDeal.campaign || '',
    stage: newDeal.stage || 'Outreach',
    payment_status: newDeal.paymentStatus || 'Pending',
    due_date: newDeal.dueDate || null,
    amount: parseFloat(newDeal.amount || '0'),
    notes: newDeal.notes || null,
    paid_at: null,
    income_id: null,
  };

  const { data, error } = await supabase
    .from('brand_deals')
    .insert(payload)
    .select('id,brand,partner,campaign,stage,payment_status,due_date,amount,notes,paid_at,income_id')
    .single();

  if (error) throw error;
  return data;
}

// UPDATE + sync to income when paymentStatus toggles
export async function updateBrandDealWithIncomeSync(id, field, value) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Not logged in');

  // Fetch current
  const { data: current, error: curErr } = await supabase
    .from('brand_deals')
    .select('id,brand,partner,campaign,stage,payment_status,due_date,amount,notes,paid_at,income_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();
  if (curErr) throw curErr;

  // Build update map (map UI fields → DB columns)
  const map = { paymentStatus: 'payment_status', dueDate: 'due_date' };
  const col = map[field] || field;
  const updates = { [col]: value ?? null };

  // Keep partner in sync with brand (to satisfy NOT NULL)
  if (field === 'brand') updates['partner'] = value ?? null;

  // If marking as Paid → create income if missing, set paid_at + income_id
  if (field === 'paymentStatus' && value === 'Paid') {
    let incomeId = current.income_id;
    if (!incomeId) {
      const incomePayload = {
        user_id: user.id,
        date: current.due_date || new Date().toISOString().slice(0,10),
        source: current.brand ? `${current.brand} — ${current.campaign || 'Brand Deal'}` : 'Brand Deal',
        platform: 'Brand',
        description: current.notes || null,
        amount: current.amount || 0,
        category: 'Sponsorship',
      };
      const { data: inc, error: incErr } = await supabase
        .from('income')
        .insert(incomePayload)
        .select('id')
        .single();
      if (incErr) throw incErr;
      incomeId = inc.id;
    }
    updates['paid_at'] = new Date().toISOString();
    updates['income_id'] = incomeId;
  }

  // If reverting from Paid → delete linked income & clear markers
  if (field === 'paymentStatus' && value !== 'Paid' && current.income_id) {
    const { error: delErr } = await supabase
      .from('income')
      .delete()
      .eq('id', current.income_id)
      .eq('user_id', user.id);
    if (delErr) throw delErr;
    updates['paid_at'] = null;
    updates['income_id'] = null;
  }

  const { data, error } = await supabase
    .from('brand_deals')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id,brand,partner,campaign,stage,payment_status,due_date,amount,notes,paid_at,income_id')
    .single();

  if (error) throw error;
  return data;
}

// DELETE (also removes linked income if present)
export async function deleteBrandDeal(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not logged in');

  const { data: current } = await supabase
    .from('brand_deals')
    .select('income_id')
    .eq('id', id).eq('user_id', user.id).single();

  if (current?.income_id) {
    await supabase.from('income').delete().eq('id', current.income_id).eq('user_id', user.id);
  }

  const { error } = await supabase
    .from('brand_deals')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}
