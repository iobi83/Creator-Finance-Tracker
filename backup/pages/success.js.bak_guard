import { useEffect } from 'react';
import Link from 'next/link';

export default function Success() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = '/app/flow';
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-white text-slate-900">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Payment successful 🎉</h1>
        <p className="text-slate-600">Redirecting you to your app…</p>
        <Link href="/app/flow" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">
          Go now →
        </Link>
      </div>
    </main>
  );
}
