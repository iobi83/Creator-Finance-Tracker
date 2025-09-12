import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { browserSupabase } from '../lib/supabaseClient';

export default function Success() {
  const router = useRouter();
  const [msg, setMsg] = useState('Payment successful. Finalizing your upgrade…');

  useEffect(() => {
    const run = async () => {
      const supabase = browserSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { router.replace('/login'); return; }

      let tries = 0;
      const check = async () => {
        const { data: prof } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', session.user.id)
          .single();

        if (prof?.plan === 'premium') {
          setMsg('Premium unlocked! Redirecting…');
          router.replace('/app?upgraded=1');
        } else if (tries++ < 30) {
          setTimeout(check, 2000); // try up to ~60s
        } else {
          setMsg('Still provisioning… refresh /app in a few seconds if it hasn’t updated.');
        }
      };
      check();
    };
    run();
  }, [router]);

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:24}}>
      <div>
        <h1 style={{fontSize:24,marginBottom:8}}>Thank you!</h1>
        <p>{msg}</p>
      </div>
    </main>
  );
}
