import dynamic from 'next/dynamic';
const ProfileEditor = dynamic(() => import('../../components/ProfileEditor'), { ssr: false });

export default function ProfilePage() {
  return (
    <main style={{maxWidth:720,margin:'2rem auto',padding:'0 1rem'}}>
      <h2 style={{margin:'0 0 1rem'}}>Account</h2>
      <ProfileEditor />
    </main>
  );
}
