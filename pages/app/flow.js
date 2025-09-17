import { useEffect, useState } from 'react';
import Head from 'next/head';
import CreatorFlow from '../../components/CreatorFlow';

export default function FlowPage() {
  const msg = typeof window!=="undefined" ? new URLSearchParams(window.location.search).get("msg") : null;
  const [plan, setPlan] = useState(null)
  const openPortal=async()=>{try{const {browserSupabase}=await import("../../lib/supabaseClient");const sb=browserSupabase();const {data:{session}={}}=await sb.auth.getSession();const t=session?.access_token||"";const r=await fetch("/api/create-portal-session",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+t}});const j=await r.json().catch(()=>({}));if(j?.url){ window.open(j.url, "_blank", "noopener,noreferrer"); return; }
  }catch(e){ alert("Could not open billing portal"); }
};useEffect(()=>{(async()=>{try{const {browserSupabase}=await import('../../lib/supabaseClient');const sb=browserSupabase();const {data:{session}={}}=await sb.auth.getSession();if(!session){window.location.href='/login?next=%2Fapp%2Fflow&verify=1';return;}const {data:prof}=await sb.from('profiles').select('plan').eq('id',session.user.id).single();if(!prof||!['trial','premium_monthly','premium_lifetime'].includes(prof.plan)){window.location.href='/';}}catch{}})();},[]);
  useEffect(()=>{(async()=>{try{const {browserSupabase}=await import("../../lib/supabaseClient");const sb=browserSupabase();const {data:{session}={}}=await sb.auth.getSession();if(!session)return;const {data:prof}=await sb.from("profiles").select("plan").eq("id",session.user.id).single();setPlan(prof?.plan||null);}catch{}})();},[]);
  return (
    <>
      <Head><title>Creator Reserve</title></Head>
      <div className="min-h-screen bg-slate-50">
        <CreatorFlow />
      </div>
    </>
  );
}
