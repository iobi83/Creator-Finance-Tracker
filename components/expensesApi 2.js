import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function insertExpense(newExpense) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Not logged in');

  const payload = {
    user_id: user.id,
    date: newExpense.date || null,            // let DB default to today
    description: newExpense.description || '',
    category: newExpense.category || 'Other',
    amount: parseFloat(newExpense.amount),
    tax_deductible: !!newExpense.taxDeductible,
  };

  const { data, error } = await supabase
    .from('expenses')
    .insert(payload)
    .select('id,date,description,category,amount,tax_deductible')
    .single();

  if (error) throw error;
  return data;
}
