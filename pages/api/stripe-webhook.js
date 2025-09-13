import Stripe from 'stripe';
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: process.env.STRIPE_API_VERSION || '2024-06-20' });
  const sig = req.headers['stripe-signature'];
  const buf = await new Promise((r)=>{const c=[]; req.on('data',d=>c.push(d)); req.on('end',()=>r(Buffer.concat(c)));});
  try {
    const evt = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    console.log('[stripe-webhook]', evt.type);
    return res.json({ ok: true });
  } catch (e) {
    console.error('[stripe-webhook] verify failed:', e.message);
    return res.status(400).json({ ok: false });
  }
}
