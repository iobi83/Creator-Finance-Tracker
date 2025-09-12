export default async function handler(_req, res) {
  const envOk = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  res.status(200).json({ ok: true, envOk });
}
