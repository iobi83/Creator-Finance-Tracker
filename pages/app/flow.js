import { useEffect } from 'react';
import Head from 'next/head';
import CreatorFlow from '../../components/CreatorFlow';

export default function FlowPage() {
useEffect(()=>{(async()=>{try{const {browserSupabase}=await import('../../lib/supabaseClient');const sb=browserSupabase();const {data:{session}={}}=await sb.auth.getSession();if(!session){window.location.href='/login?next=%2Fapp%2Fflow&verify=1';return;}const {data:prof}=await sb.from('profiles').select('plan').eq('id',session.user.id).single();if(!prof||!['trial','premium_monthly','premium_lifetime'].includes(prof.plan)){window.location.href='/';}}catch{}})();},[]);
  return (
    <>
      <Head><title>Creator Flow</title></Head>
      <div className="min-h-screen bg-slate-50">
        <CreatorFlow />
      </div>
    </>
  );
}
