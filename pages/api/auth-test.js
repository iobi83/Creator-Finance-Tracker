import { serverSupabaseFromToken } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  const supabase = serverSupabaseFromToken(token);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return res.status(401).json({ ok: false, error: error?.message || 'No user' });
  res.json({ ok: true, user: { id: user.id, email: user.email } });
}
