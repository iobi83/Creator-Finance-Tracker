import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const email = (body.email || '').trim();
    const user_id = (body.user_id || '').trim();
    if (!email || !user_id) return res.status(400).json({ ok:false, error:'missing_params' });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
    if (!url || !key) return res.status(500).json({ ok:false, error:'server_misconfig' });

    const admin = createClient(url, key);

    // Read entitlement by email
    const { data: ent, error: er1 } = await admin
      .from('entitlements')
      .select('plan, trial_used, stripe_customer_id')
      .eq('email', email)
      .maybeSingle();
    if (er1) return res.status(500).json({ ok:false, error:'read_error' });
    if (!ent) return res.json({ ok:true, promoted:false });

    const upd = {};
    if (ent.plan) upd.plan = ent.plan;
    if (typeof ent.trial_used === 'boolean') upd.trial_used = ent.trial_used;
    if (ent.stripe_customer_id) upd.stripe_customer_id = ent.stripe_customer_id;

    if (Object.keys(upd).length) {
      const { error: er2 } = await admin.from('profiles').update(upd).eq('id', user_id);
      if (er2) return res.status(500).json({ ok:false, error:'update_error' });
    }

    // Clean up entitlement row
    await admin.from('entitlements').delete().eq('email', email);

    return res.json({ ok:true, promoted:true, plan: ent.plan || null });
  } catch {
    return res.status(500).json({ ok:false, error:'server_error' });
  }
}
