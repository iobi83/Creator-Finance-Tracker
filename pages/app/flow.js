import { useEffect, useState } from 'react';
import Head from 'next/head';
import CreatorFlow from '../../components/CreatorFlow';
import { BRAND } from '../../lib/appMeta';

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
        <footer className="py-10 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-indigo-700" />
              <div>
                <div className="font-semibold text-lg">{BRAND}</div>
                <div className="text-xs text-slate-500">© {new Date().getFullYear()} — All rights reserved.</div>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Not tax, legal, or accounting advice. Consult a qualified professional.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
