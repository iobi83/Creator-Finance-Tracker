import { createClient } from '@supabase/supabase-js'
const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
export async function seenBefore(id){ const { data } = await supa.from('webhook_events').select('event_id').eq('event_id', id).maybeSingle(); return !!data }
export async function markSeen({ id, type, created }){ await supa.from('webhook_events').upsert({ event_id:id, type, created: new Date(created*1000) }).select().single() }
