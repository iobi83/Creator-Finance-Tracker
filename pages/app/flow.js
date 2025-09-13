import { useEffect } from 'react';
import Head from 'next/head';
import CreatorFlow from '../../components/CreatorFlow';

export default function FlowPage() {
  useEffect(()=>{(async()=>{try{const {supabase}=await import('../../lib/supabaseClient');const {data:{session}={}}=await supabase.auth.getSession();if(!session) window.location.href='/login?next=%2Fapp%2Fflow&verify=1';}catch{}})();},[]);
  return (
    <>
      <Head><title>Creator Flow</title></Head>
      <div className="min-h-screen bg-slate-50">
        <CreatorFlow />
      </div>
    </>
  );
}
