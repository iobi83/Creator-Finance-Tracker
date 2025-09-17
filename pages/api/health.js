export default async function handler(req, res) {
  // Dev-only: hide in production
  if (process.env.NODE_ENV === 'production' && !((process.env.NEXT_PUBLIC_SUPABASE_URL||'').includes('localhost') || (process.env.NEXT_PUBLIC_SITE_URL||'').includes('localhost'))) return res.status(404).end();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '').trim();
  const base = url ? `${url}/rest/v1` : '';
  const hdr = key ? { apikey: key, Authorization: `Bearer ${key}` } : {};

  const out = {
    ok: true,
    env: { hasUrl: !!url, hasAnon: !!anon, hasRoleKey: !!key },
    supabase: { connectivity: 'unknown' },
    webhook: { lastEvent: null },
    profiles: { null: null, trial: null, premium_monthly: null, premium_lifetime: null }
  };

  // Connectivity probe
  try {
    if (base && key) {
      const r = await fetch(`${base}/profiles?select=id&limit=1`, { headers: hdr });
      out.supabase.connectivity = r.ok ? 'ok' : 'fail';
    }
  } catch { out.supabase.connectivity = 'fail'; }

  // Count helper via Content-Range
  async function countProfiles(where) {
    try {
      const r = await fetch(`${base}/profiles?select=id${where}`, { method: 'HEAD', headers: { ...hdr, Prefer: 'count=exact' } });
      const cr = r.headers.get('content-range') || '';
      const total = parseInt(cr.split('/')[1] || '0', 10);
      return Number.isNaN(total) ? null : total;
    } catch { return null; }
  }

  if (base && key) {
    out.profiles.trial = await countProfiles('&plan=eq.trial');
    out.profiles.premium_monthly = await countProfiles('&plan=eq.premium_monthly');
    out.profiles.premium_lifetime = await countProfiles('&plan=eq.premium_lifetime');
    out.profiles.null = await countProfiles('&plan=is.null');

    // Last webhook event (idempotency table)
    try {
      const r = await fetch(`${base}/webhook_events?select=event_id,type,created,seen_at&order=seen_at.desc&limit=1`, { headers: hdr });
      if (r.ok) {
        const rows = await r.json();
        out.webhook.lastEvent = rows?.[0] || null;
      }
    } catch {}
  }

  res.status(200).json(out);
}
