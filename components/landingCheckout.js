import { createClient } from '@supabase/supabase-js';

const supabase =
  typeof window !== 'undefined'
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null;

export async function startCheckout(priceId) {
  try {
    if (!priceId) {
      alert('Price ID is missing. Set NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID / NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID.');
      return;
    }
    if (!supabase) {
      alert('Supabase client not ready');
      return;
    }

const _res = await supabase.auth.getSession();
const token = _res?.data?.session?.access_token;
if (!token) { window.location.href = '/login'; return; }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priceId }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.url) {
      throw new Error(json?.error || 'Checkout failed');
    }
    window.location.href = json.url;
  } catch (e) {
    console.error('[landingCheckout] error:', e);
    alert(e?.message || 'Checkout failed');
  }
}

export const startMonthlyCheckout = () =>
  startCheckout(process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID);

export const startLifetimeCheckout = () =>
  startCheckout(process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID);

// --- Added helpers: trial & monthly (landing CTAs) ---
export async function startTrialCheckout() {
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID })
    });
    if (!res.ok) throw new Error('startTrialCheckout failed');
    const { url } = await res.json();
    if (url) window.location.assign(url);
  } catch (e) {
    console.error(e);
    alert('Could not start trial checkout. Please try again.');
  }
}

export async function startMonthlyCheckoutGuarded() {
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID })
    });
    if (!res.ok) throw new Error('startMonthlyCheckout failed');
    const { url } = await res.json();
    if (url) window.location.assign(url);
  } catch (e) {
    console.error(e);
    alert('Could not start monthly checkout. Please try again.');
  }
}

// Guarded: new users get trial, returning go monthly
export async function startTrialOrMonthly() {
  try {
    if (typeof window === 'undefined') return;
    if (!supabase) { alert('Supabase client not ready'); return; }

    const { data: { session } = {} } = await supabase.auth.getSession();
    if (!session?.access_token) {
      // Not logged in → send to login (app will route back after callback)
      return startTrialOrMonthlyPreopen();
      return;
    }

    const res = await fetch('/api/create-checkout-session-guarded', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}) // priceId read server-side from env
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.url) throw new Error(json?.error || 'Checkout failed');
    window.location.href = json.url;
  } catch (e) {
    console.error('[landingCheckout] guarded error:', e);
    alert(e?.message || 'Could not start checkout.');
  }
}

// Open guarded checkout in a pre-opened tab (keeps landing page in place)
export async function startTrialOrMonthlyPreopen() {
  try {
    if (typeof window === 'undefined') return;
    if (!supabase) { alert('Supabase client not ready'); return; }

    // Pre-open a tab synchronously (popup-safe)
    const w = window.open('about:blank', '_blank');
    if (w) { try { w.document.write('Redirecting to Stripe…'); } catch {} }

const _res = await supabase.auth.getSession();
const token = _res?.data?.session?.access_token;
if (!token) {
  const alt = await fetch('/api/create-checkout-session-guarded', { method: 'POST' });
  const { url: altUrl } = await alt.json();
  if (w && altUrl) { w.location = altUrl; return; }
  return;
}
const headers = token
  ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  : { 'Content-Type': 'application/json' };
const res = await fetch('/api/create-checkout-session-guarded', {
  method: 'POST',
  headers,
  body: JSON.stringify({})
});

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.url) throw new Error(json?.error || 'Checkout failed');

    // Redirect the pre-opened tab; fallback to same-tab if the popup was blocked
    try {
      if (w && !w.closed) { w.location = json.url; }
      else { window.location.href = json.url; }
    } catch {
      window.location.href = json.url;
    }
  } catch (e) {
    console.error('[landingCheckout] guarded preopen error:', e);
    alert(e?.message || 'Could not start checkout.');
  }
}

// Open lifetime (one-time) checkout in a pre-opened tab
export async function startLifetimeCheckoutPreopen() {
  try {
    if (typeof window === 'undefined') return;
    if (!supabase) { alert('Supabase client not ready'); return; }

    // Pre-open a tab synchronously (popup-safe)
    const w = window.open('about:blank', '_blank');

    const { data: { session } = {} } = await supabase.auth.getSession();
    if (session?.access_token) { window.location.href="/app/flow?msg=buy-once-signed-in"; return; }
    if (!session?.access_token) {
      // Lifetime allows guest checkout — do not force login here
      return;
      return;
    }

    const LIFETIME_PRICE = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;
    if (!LIFETIME_PRICE) { alert('Missing NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID'); return; }

    const res = await fetch('/api/create-checkout-session-guarded', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priceId: LIFETIME_PRICE })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.url) throw new Error(json?.error || 'Checkout failed');

    try {
      if (w && !w.closed) { w.location = json.url; }
      else { window.location.href = json.url; }
    } catch {
      window.location.href = json.url;
    }
  } catch (e) {
    console.error('[landingCheckout] lifetime preopen error:', e);
    alert(e?.message || 'Could not start checkout.');
  }
}

// Open lifetime (one-time) checkout using a pre-opened tab handle
export async function startLifetimeCheckoutPreopenWithHandle(w) {
  try {
    if (typeof window === 'undefined') return;
    if (!supabase) { alert('Supabase client not ready'); return; }

    const { data: { session } = {} } = await supabase.auth.getSession();
    if (!session?.access_token) {
      // Lifetime allows guest checkout — do not force login here
      const L=process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;
      const r=await fetch('/api/create-checkout-session-guarded',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceId:L})});
      const j=await r.json().catch(()=>({}));
      if (w && j?.url){ try{ w.location=j.url; }catch{ window.location.href=j.url; } return; }
      const r2=await fetch('/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceId:L})});
      const j2=await r2.json().catch(()=>({})); if (w && j2?.url){ try{ w.location=j2.url; }catch{ window.location.href=j2.url; } return; }
      return;
      return;
    if (session?.access_token) { window.location.href="/app/flow?msg=buy-once-signed-in"; return; }
    }

    const LIFETIME_PRICE = process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;
    if (!LIFETIME_PRICE) { alert('Missing NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID'); return; }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + (session?.access_token || ""),
      },
      body: JSON.stringify({ priceId: LIFETIME_PRICE })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.url) throw new Error(json?.error || 'Checkout failed');

    // Redirect ONLY the pre-opened tab; if blocked, try opening a new one
    if (w && !w.closed) { w.location = json.url; return; }
    window.open(json.url, '_blank');
  } catch (e) {
    console.error('[landingCheckout] lifetime with-handle error:', e);
    alert(e?.message || 'Could not start checkout.');
  }
}

// Smart launcher: if logged-in go to app/flow; else start guarded trial (new tab)
export async function launchSmart() {
  try {
    if (typeof window === 'undefined') return;
    if (!supabase) { alert('Supabase client not ready'); return; }
    const { data: { session } = {} } = await supabase.auth.getSession();
    if (session?.user) {
      window.location.href = '/app/flow';
      return;
    }
    // Not logged in → reuse the pre-opened new-tab flow
    return startTrialOrMonthlyPreopen();
  } catch (e) {
    console.error('[landingCheckout] launchSmart error:', e);
    alert('Please try again.');
  }
}
