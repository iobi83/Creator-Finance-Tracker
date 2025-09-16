import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: process.env.STRIPE_API_VERSION || '2024-06-20' });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  let event;
  const sig = req.headers['stripe-signature'];
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) return res.status(500).json({ ok:false, error:'Missing STRIPE_WEBHOOK_SECRET' });

  try {
    const raw = await buffer(req);
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    return res.status(400).json({ ok:false, error:`Webhook signature verification failed: ${err.message}` });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const user_id = session?.metadata?.supabase_user_id || null;
      const email = session?.customer_details?.email || session?.metadata?.email || null;

      // Only mark as premium on successful payment
      if (session.payment_status === 'paid') {
        if (user_id) {
          await supabaseAdmin.from('profiles').update({ plan: 'premium' }).eq('id', user_id);
        } else if (email) {
          await supabaseAdmin.from('profiles').update({ plan: 'premium' }).eq('email', email);
        }
      }
    }
    // You can also handle subscription.updated/created here if you add subscriptions later.

    return res.json({ received: true });
  } catch (e) {
    return res.status(500).json({ ok:false, error: e.message });
  }
}
