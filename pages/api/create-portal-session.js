import Stripe from 'stripe'
import { serverSupabaseFromToken } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return res.status(401).json({ error: 'Missing token' })

  const sb = serverSupabaseFromToken(token)
  const { data: { user } = {} } = await sb.auth.getUser()
  if (!user?.id) return res.status(401).json({ error: 'No user' })

  const { data: prof } = await sb.from('profiles').select('stripe_customer_id').eq('id', user.id).single()
  const customer = prof?.stripe_customer_id
  if (!customer) return res.status(400).json({ error: 'No Stripe customer on file' })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: process.env.STRIPE_API_VERSION })
  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: process.env.NEXT_PUBLIC_SITE_URL + '/app/flow'
  })
  return res.status(200).json({ url: session.url })
}
