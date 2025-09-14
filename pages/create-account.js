import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// client supabase (singleton)
const supabaseClient = dynamic(() => import('../lib/supabaseClient').then(m => m.browserSupabase), { ssr: false });

// ---------- Page (Client) ----------
export default function CreateAccount({ ok, email, reason, sessionId, siteUrl }) {
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    (async () => {
      const make = (await import('../lib/supabaseClient')).browserSupabase;
      setSupabase(make());
    })();
  }, []);

  const valid = useMemo(() => {
    const lenOK = pwd.length >= 8;
    const match = pwd && pwd2 && pwd === pwd2;
    return lenOK && match;
  }, [pwd, pwd2]);

  if (!ok) {
    return (
      <main style={{maxWidth: 640, margin: '3rem auto', padding: '0 1rem', fontFamily:'sans-serif'}}>
        <h2>Create account</h2>
        <p style={{color:'#6b7280'}}>We couldn’t confirm a recent checkout session for this link.</p>
        <p style={{fontSize:12, color:'#9ca3af'}}>Reason: {reason || 'invalid_session'}</p>
        <a href="/" style={{display:'inline-block',marginTop:12,padding:'10px 14px',border:'1px solid #e5e7eb',borderRadius:12,textDecoration:'none'}}>Back to home</a>
      </main>
    );
  }

  const doSignup = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setMsg('');
    if (!valid) { setMsg('Passwords must be at least 8 characters and match.'); return; }
    try {
      setBusy(true);
      // store for callback verification
      if (email) localStorage.setItem('signup_email', email);
      const redirect = (siteUrl || window.location.origin) + '/auth/callback';
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pwd,
        options: { emailRedirectTo: redirect }
      });
      if (error) {
        // common: user already exists -> suggest login
        if ((error.message || '').toLowerCase().includes('already') ) {
          setMsg('An account already exists for this email. Please sign in.');
        } else {
          setMsg(error.message || 'Sign up failed.');
        }
        return;
      }
      setMsg('Check your email to verify and finish creating your account.');
    } catch (e2) {
      setMsg(e2.message || 'Sign up failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{maxWidth: 640, margin: '3rem auto', padding: '0 1rem', fontFamily:'sans-serif'}}>
      <h2 style={{margin:'0 0 1rem'}}>Create your account</h2>
      <form onSubmit={doSignup} style={{border:'1px solid #e5e7eb',borderRadius:16,padding:16}}>
        <div style={{marginBottom:12}}>
          <label>Email (used at checkout)
            <input value={email||''} readOnly
              style={{display:'block',width:'100%',marginTop:6,padding:'10px',border:'1px solid #e5e7eb',borderRadius:12,background:'#f9fafb'}}
              placeholder="you@example.com"
            />
          </label>
        </div>

        <div style={{marginBottom:12}}>
          <label>Create password
            <div style={{position:'relative', marginTop:6}}>
              <input
                type={show1 ? 'text':'password'}
                value={pwd}
                onChange={e=>setPwd(e.target.value)}
                placeholder="At least 8 characters"
                style={{display:'block',width:'100%',padding:'10px',border:'1px solid #e5e7eb',borderRadius:12}}
                required
              />
              <button type="button" onClick={()=>setShow1(s=>!s)}
                style={{position:'absolute',right:8,top:8,background:'transparent',border:'none',cursor:'pointer',color:'#2563eb'}}>
                {show1?'Hide':'Show'}
              </button>
            </div>
          </label>
        </div>

        <div style={{marginBottom:12}}>
          <label>Confirm password
            <div style={{position:'relative', marginTop:6}}>
              <input
                type={show2 ? 'text':'password'}
                value={pwd2}
                onChange={e=>setPwd2(e.target.value)}
                placeholder="Re-enter your password"
                style={{display:'block',width:'100%',padding:'10px',border:'1px solid #e5e7eb',borderRadius:12}}
                required
              />
              <button type="button" onClick={()=>setShow2(s=>!s)}
                style={{position:'absolute',right:8,top:8,background:'transparent',border:'none',cursor:'pointer',color:'#2563eb'}}>
                {show2?'Hide':'Show'}
              </button>
            </div>
          </label>
        </div>

        {!valid && (pwd || pwd2) ? (
          <div style={{color:'#b91c1c', fontSize:13, marginTop:4}}>
            Passwords must be at least 8 characters and match.
          </div>
        ) : null}

        <button disabled={!valid || busy}
          style={{marginTop:12,padding:'10px 14px',borderRadius:12,background:'#111827',color:'#fff',border:'none',cursor: valid && !busy ? 'pointer':'not-allowed'}}>
          {busy?'Creating…':'Create account'}
        </button>

        {msg ? <div style={{marginTop:10, fontSize:13, color: msg.startsWith('Check') ? '#065f46' : '#b91c1c'}}>{msg}</div> : null}
      </form>
      <p style={{marginTop:10, fontSize:13, color:'#6b7280'}}>Have an account already? <a href="/login">Sign in</a></p>
    </main>
  );
}

// ---------- Server (SSR) ----------
export async function getServerSideProps(context) {
  try {
    const sessionId = context.query?.session_id || null;
    if (!sessionId) return { props: { ok:false, reason:'missing_session_id' } };

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: process.env.STRIPE_API_VERSION || '2024-06-20' });
    const sess = await stripe.checkout.sessions.retrieve(sessionId);

    // must be a recently completed session
    const status = sess?.status || null; // expect 'complete'
    const mode = sess?.mode || null;     // 'subscription' or 'payment'
    const email = sess?.customer_details?.email || sess?.customer_email || null;

    if (status !== 'complete' || !email) {
      return { props: { ok:false, reason:`invalid_status_or_email`, sessionId: sessionId || null } };
    }

    return {
      props: {
        ok: true,
        email,
        sessionId,
        mode: mode || null,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null
      }
    };
  } catch (e) {
    return { props: { ok:false, reason:'server_error' } };
  }
}
