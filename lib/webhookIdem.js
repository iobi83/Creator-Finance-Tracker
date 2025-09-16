import { supabaseAdmin } from './supabaseAdmin';
export async function seenBefore(id){try{const {data,error}=await supabaseAdmin.from('webhook_events').select('event_id').eq('event_id',id).maybeSingle();return !!data&&!error;}catch{return false;}}
export async function markSeen(id,type,created){try{await supabaseAdmin.from('webhook_events').upsert([{event_id:id,type,created:new Date(created*1000)}]);}catch{}}
