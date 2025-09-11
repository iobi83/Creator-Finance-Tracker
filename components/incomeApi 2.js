import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Insert a new income row for the logged-in user and return the inserted row.
export async function insertIncome(newIncome) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Not logged in');

  const payload = {
    user_id: user.id,
    date: newIncome.date || null, // let DB default fill today if empty
    source: newIncome.source || 'Income',
    platform: newIncome.platform || null,
    description: newIncome.description || null,
    amount: parseFloat(newIncome.amount),
    category: newIncome.category || 'Other',
  };

  const { data, error } = await supabase
    .from('income')
    .insert(payload)
    .select('id,date,source,platform,description,amount,category')
    .single();

  if (error) throw error;
  return data;
}
