import { useState } from 'react';
import { browserSupabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const sendLink = async (e) => {
    e.preventDefault();
    setError('');
    const supabase = browserSupabase();
    try {
      // store so callback can verify
      localStorage.setItem('login_email', email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback` }
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send magic link.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{fontFamily:'sans-serif'}}>
      <div className="max-w-md w-full bg-white shadow p-6 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
        {sent ? (
          <p>Magic link sent. Check <b>{email}</b> and click the link.</p>
        ) : (
          <form onSubmit={sendLink} className="space-y-3">
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-xl p-3"
            />
            <button className="w-full rounded-xl p-3 bg-black text-white">Send magic link</button>
            {error && <p style={{color:'#b91c1c'}}>{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
