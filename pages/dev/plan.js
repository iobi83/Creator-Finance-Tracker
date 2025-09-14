import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = typeof window !== 'undefined'
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null;

export default function DevPlan() {
  const [status, setStatus] = useState('Checking session…');
  const [plan, setPlan] = useState(null);
  const [email, setEmail] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!supabase) { setStatus('Supabase client not ready'); return; }
      const { data: { session } = {} } = await supabase.auth.getSession();
      if (!session?.user) {
        setStatus('Not logged in → click to log in');
        return;
      }
      setEmail(session.user.email || session.user.id);
      setStatus('Fetching plan…');
      try {
        const { data: prof } = await supabase.from('profiles').select('plan').eq('id', session.user.id).single();
        setPlan(prof?.plan || 'free');
        setStatus('Ready');
      } catch {
        setPlan('free');
        setStatus('Ready');
      }
    })();
  }, []);

  async function ensureSession() {
    const { data: { session } = {} } = await supabase.auth.getSession();
    if (!session?.access_token) {
      window.location.href = '/login';
      return null;
    }
    return session;
  }

  async function setPlanTo(next) {
    try {
      setBusy(true);
      const session = await ensureSession();
      if (!session) return;
      const res = await fetch('/api/dev/set-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ plan: next }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'failed');
      setPlan(json.plan);
      setStatus(`Plan set to "${json.plan}"`);
    } catch (e) {
      setStatus(`Error: ${e.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 24}}>
      <h1 style={{fontSize: 24, fontWeight: 700, marginBottom: 8}}>/dev/plan (local only)</h1>
      <p style={{marginBottom: 16, color:'#475569'}}>Status: {status}</p>
      <div style={{marginBottom: 16}}>
        <div><b>User:</b> {email || '—'}</div>
        <div><b>Current plan:</b> {plan || '—'}</div>
      </div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <button disabled={busy} onClick={() => setPlanTo('free')} style={btn('#64748B','#fff')}>Set FREE</button>
        <button disabled={busy} onClick={() => setPlanTo('trial')} style={btn('#06B6D4','#fff')}>Set TRIAL</button>
        <button disabled={busy} onClick={() => setPlanTo('premium')} style={btn('#4338CA','#fff')}>Set PREMIUM</button>
        <a href="/" style={linkBtn()}>← Back to Home</a>
        <a href="/app/flow" style={linkBtn()}>Open /app/flow</a>
      </div>
      <p style={{marginTop:16, fontSize:12, color:'#64748B'}}>
        Note: This page uses a local API and should be disabled in production. It exists to test “Launch the web app” logic (premium/trial vs free).
      </p>
    </div>
  );
}

function btn(bg, color) {
  return {
    background:bg, color, border:'1px solid transparent', borderRadius:8,
    padding:'8px 12px', cursor:'pointer'
  };
}
function linkBtn() {
  return {
    display:'inline-block', border:'1px solid #CBD5E1', borderRadius:8,
    padding:'8px 12px', textDecoration:'none', color:'#0F172A', background:'#fff'
  };
}
