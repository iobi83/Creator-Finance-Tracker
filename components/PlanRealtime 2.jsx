import { useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PlanRealtime() {
  const userIdRef = useRef(null);
  const lastPlanRef = useRef(null);
  const channelRef = useRef(null);
  const stopPollRef = useRef(null);

  const startPolling = async () => {
    // fetch once immediately
    const fetchOnce = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userIdRef.current = user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

      if (error) {
        console.log('[PlanRealtime] Poll fetch error:', error.message);
        return;
      }

      if (lastPlanRef.current === null) {
        lastPlanRef.current = data?.plan ?? null;
        console.log('[PlanRealtime] Poll baseline plan =', lastPlanRef.current);
      } else if (data?.plan !== lastPlanRef.current) {
        console.log('[PlanRealtime] Plan changed via polling:', data?.plan, '→ reloading page');
        window.location.reload();
      }
    };

    await fetchOnce();
    const id = setInterval(fetchOnce, 5000);
    stopPollRef.current = () => clearInterval(id);
  };

  useEffect(() => {
    // 1) Realtime subscription
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[PlanRealtime] No user yet; starting poller after login.');
      } else {
        userIdRef.current = user.id;
      }

      // subscribe to ALL profile changes and filter client-side
      channelRef.current = supabase
        .channel('realtime:profiles-all')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
          const row = payload?.new || payload?.old;
          if (!row) return;
          if (row.id === userIdRef.current && payload.eventType === 'UPDATE') {
            const nextPlan = payload?.new?.plan;
            console.log('[PlanRealtime] Realtime plan update:', nextPlan, '→ reloading page');
            window.location.reload();
          }
        })
        .subscribe((status) => console.log('[PlanRealtime] Channel status:', status));

      // 2) Start polling as a safety net
      startPolling();

      // 3) Also handle late login
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
        if (session?.user) {
          userIdRef.current = session.user.id;
          // reset baseline so next poll detects change properly
          lastPlanRef.current = null;
        }
      });

      return () => subscription.unsubscribe();
    })();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (stopPollRef.current) stopPollRef.current();
    };
  }, []);

  return null;
}
