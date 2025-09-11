import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Test insert
    const { data, error } = await supabase
      .from('sandbox_test')
      .insert([{ note: 'Test from Next.js at ' + new Date().toISOString() }])
      .select()
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    return res.status(200).json({ success: true, data })
  }
  
  if (req.method === 'GET') {
    // Test read
    const { data, error } = await supabase
      .from('sandbox_test')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    
    return res.status(200).json({ data })
  }
  
  return res.status(405).json({ message: 'Method not allowed' })
}