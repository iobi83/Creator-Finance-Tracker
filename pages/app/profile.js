import dynamic from 'next/dynamic';
import { browserSupabase } from "../../lib/supabaseClient";const ProfileEditor = dynamic(() => import('../../components/ProfileEditor'), { ssr: false });

export default function ProfilePage() {
  // Open Stripe Customer Portal in a new tab (Profile page)
  const openPortal = async () => {
    try {
      const sb = browserSupabase();
      const { data: { session } = {} } = await sb.auth.getSession();
      const t = session?.access_token || "";
      const r = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + t }
      });
      const j = await r.json().catch(() => ({}));
      if (j?.url) {
        const w = window.open(j.url, "_blank", "noopener,noreferrer");
        // removed fallback redirect — keep current tab on profile
      }
    } catch (e) {
      alert("Could not open billing portal");
    }
  }
  return (
    <main style={{maxWidth:720,margin:'2rem auto',padding:'0 1rem'}}>
      <a href="/app/flow" className="inline-block mb-3 text-sm underline">← Back to app</a>
      <h2 style={{margin:'0 0 1rem'}}>Account</h2>
      {/* Manage billing (Stripe Customer Portal) */}
      <div className="flex justify-end mb-3">
        <button onClick={openPortal} className="px-3 py-1.5 rounded-md border text-sm">Manage billing</button>
      </div>
      <ProfileEditor />
    </main>
  );
}
