import Link from 'next/link';

export default function Cancel() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-white text-slate-900">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold">Checkout canceled</h1>
        <p className="text-slate-600">No worries — you can try again any time.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
