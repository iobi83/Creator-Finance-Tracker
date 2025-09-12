import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Read-only loader: fetch income for the logged-in user and pass it to parent.
export default function SupabaseIncomeLoader({ onLoad }) {
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[IncomeLoader] No user — not loading income.');
        return;
      }

      console.log('[IncomeLoader] Loading income for user:', user.id);

      const { data, error } = await supabase
        .from('income')
        .select('id,date,source,platform,description,amount,category')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('[IncomeLoader] Error:', error.message);
        return;
      }

      // Normalize to the shape the UI expects
      const rows = (data || []).map(r => ({
        id: r.id,
        date: r.date || new Date().toISOString().slice(0,10),
        source: r.source || 'Income',
        platform: r.platform || '',
        description: r.description || '',
        amount: typeof r.amount === 'number' ? r.amount : parseFloat(r.amount || '0'),
        category: r.category || 'Other',
      }));

      if (mounted && typeof onLoad === 'function') onLoad(rows);
      console.log(`[IncomeLoader] Loaded ${rows.length} rows.`);
    })();

    return () => { mounted = false; };
  }, [onLoad]);

  return null;
}
