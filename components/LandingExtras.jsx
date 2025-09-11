import React from 'react';
import { useRouter } from 'next/router';

export default function LandingExtras() {
  const router = useRouter();
  return (
    <>
      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
          Everything you need in one place
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="text-2xl">📈</div>
            <h3 className="font-semibold mt-2 text-slate-800">Income tracking</h3>
            <p className="text-sm text-slate-600 mt-1">
              Log brand deals, affiliate payouts, platform revenue — see totals and trends at a glance.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="text-2xl">🧾</div>
            <h3 className="font-semibold mt-2 text-slate-800">Expenses & deductibles</h3>
            <p className="text-sm text-slate-600 mt-1">
              Tag deductible costs and see estimated tax savings update instantly.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="text-2xl">🤝</div>
            <h3 className="font-semibold mt-2 text-slate-800">Brand pipeline</h3>
            <p className="text-sm text-slate-600 mt-1">
              Track outreach → signed → paid. When a deal is marked Paid, it rolls into Income automatically.
            </p>
          </div>
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="text-2xl">🗓️</div>
            <h3 className="font-semibold mt-2 text-slate-800">Calendar & tax view</h3>
            <p className="text-sm text-slate-600 mt-1">
              See income/expenses by day and get quarterly tax guidance tailored to your numbers.
            </p>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="bg-white/60 border-t border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Kick the tires with a live demo</h2>
            <p className="text-slate-600 mt-3">
              Open the app demo (read-only to start). You can log in anytime to save your data.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => router.push('/app/flow')}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-5 py-3 rounded-lg hover:from-indigo-700 hover:to-cyan-700"
              >
                Try live demo
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-white border border-slate-300 px-5 py-3 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Start for free
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg border p-6">
            <div className="text-sm text-slate-600">What you’ll see</div>
            <ul className="mt-3 space-y-2 text-slate-700 text-sm list-disc pl-5">
              <li>Dashboard with monthly goal & surplus indicator</li>
              <li>Income, Expenses, Brand Pipeline tabs (all linked)</li>
              <li>Calendar heat-map + daily breakdown</li>
              <li>Tax Planning summary with export to PDF</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Frequently asked</h2>
        <div className="space-y-3">
          <details className="bg-white border rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-slate-800">
              Do I need a credit card to start?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              No. You can log in with email and use the free plan. Upgrade only if you love it.
            </p>
          </details>
          <details className="bg-white border rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-slate-800">
              Can I cancel anytime?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Yes. Subscriptions are month-to-month. Lifetime is a one-time purchase.
            </p>
          </details>
          <details className="bg-white border rounded-lg p-4">
            <summary className="cursor-pointer font-medium text-slate-800">
              Does this work with my Stripe/Supabase account?
            </summary>
            <p className="mt-2 text-slate-600 text-sm">
              Yes. Auth is handled by Supabase. Checkout is through Stripe. Your data stays in your Supabase project.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}
