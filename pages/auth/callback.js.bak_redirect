import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { browserSupabase } from '../../lib/supabaseClient';

export default function Callback() {
  const router = useRouter();
  const [msg, setMsg] = useState('Verifying...');

  useEffect(() => {
    const run = async () => {
      const supabase = browserSupabase();
      const url = new URL(window.location.href);
      const token_hash = url.searchParams.get('token_hash');
      const type = url.searchParams.get('type');
      const email = localStorage.getItem('login_email');

      try {
        if (type === 'magiclink' && token_hash && email) {
          const { error } = await supabase.auth.verifyOtp({ type: 'magiclink', token_hash, email });
          if (error) throw error;
          setMsg('Logged in. Redirecting...');
          router.replace('/app');
          return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        if (session) return router.replace('/app');
        setMsg('Invalid or expired link. Please log in again.');
      } catch (e) {
        setMsg(e.message || 'Auth error.');
      }
    };
    run();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{fontFamily:'sans-serif'}}>
      <p>{msg}</p>
    </main>
  );
}
