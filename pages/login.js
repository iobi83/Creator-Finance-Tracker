import { useState } from 'react';
import { browserSupabase } from '../lib/supabaseClient';
import { BRAND } from '../lib/appMeta';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const sendLink = async (e) => {
    e.preventDefault();
    setError('');
    const supabase = browserSupabase();
    try {
      // store so callback can verify
      localStorage.setItem('login_email', email);
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
          window.location.href='/app/flow';
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-7 w-7 rounded-lg bg-[#4338CA]" />
          <div className="font-semibold text-lg">{BRAND}</div>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        {sent ? (
          <p>Magic link sent. Check <b>{email}</b> and click the link.</p>
        ) : (
          <form onSubmit={sendLink} className="space-y-3">
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div style={{marginTop:8}}>
              <label>Password<br/>
                <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </label>
            </div>
            <button className="w-full rounded-xl p-3 bg-[#4338CA] hover:opacity-90 text-white shadow-md">Log in</button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
