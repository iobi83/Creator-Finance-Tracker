import Link from 'next/link';

export default function NotionLite() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-white text-slate-900">
      <div className="max-w-md w-full space-y-4 text-center border rounded-2xl p-8">
        <h1 className="text-2xl font-bold">Notion Template (Lite)</h1>
        <p className="text-slate-600">
          This template is available with a Creator Reserve plan. Activate your plan to unlock downloads.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">← Back to Home</Link>
          <a href="/#pricing" className="px-4 py-2 rounded-md text-white" style={{ background:'#4338CA' }}>
            See plans
          </a>
        </div>
      </div>
    </main>
  );
}
