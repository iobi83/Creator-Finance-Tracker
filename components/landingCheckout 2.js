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

    const { data: { session } = {} } = await supabase.auth.getSession();
    if (!session?.access_token) {
      // not logged in → send to login (your app routes to /app after callback)
      window.location.href = '/login';
      return;
    }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
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
