import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SupabaseExpensesLoader({ onLoad }) {
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { console.log('[ExpensesLoader] No user'); return; }

      console.log('[ExpensesLoader] Loading expenses for:', user.id);
      const { data, error } = await supabase
        .from('expenses')
        .select('id,date,description,category,amount,tax_deductible')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) { console.error('[ExpensesLoader] Error:', error.message); return; }

      const rows = (data || []).map(r => ({
        id: r.id,
        date: r.date || new Date().toISOString().slice(0,10),
        description: r.description || '',
        category: r.category || 'Other',
        amount: typeof r.amount === 'number' ? r.amount : parseFloat(r.amount || '0'),
        taxDeductible: !!r.tax_deductible,
      }));

      if (mounted && typeof onLoad === 'function') onLoad(rows);
      console.log(`[ExpensesLoader] Loaded ${rows.length} rows.`);
    })();
    return () => { mounted = false; };
  }, [onLoad]);

  return null;
}
