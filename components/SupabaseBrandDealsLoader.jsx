import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SupabaseBrandDealsLoader({ onLoad }) {
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { console.log('[BrandDealsLoader] No user'); return; }

      console.log('[BrandDealsLoader] Loading deals for:', user.id);
      const { data, error } = await supabase
        .from('brand_deals')
        .select('id,brand,campaign,stage,payment_status,due_date,amount,notes,paid_at,income_id')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (error) { console.error('[BrandDealsLoader] Error:', error.message); return; }

      const rows = (data || []).map(d => ({
        id: d.id,
        brand: d.brand || '',
        campaign: d.campaign || '',
        stage: d.stage || 'Outreach',
        paymentStatus: d.payment_status || 'Pending',
        dueDate: d.due_date || '',
        amount: typeof d.amount === 'number' ? d.amount : parseFloat(d.amount || '0'),
        notes: d.notes || '',
        paidAt: d.paid_at || null,
        incomeId: d.income_id || null,
      }));

      if (mounted && typeof onLoad === 'function') onLoad(rows);
      console.log(`[BrandDealsLoader] Loaded ${rows.length} deals.`);
    })();
    return () => { mounted = false; };
  }, [onLoad]);

  return null;
}
