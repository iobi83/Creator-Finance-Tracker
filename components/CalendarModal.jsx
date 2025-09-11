import React from 'react';

export default function CalendarModal({ date, incomeItems = [], expenseItems = [], onClose }) {
  if (!date) return null;
  const totalIncome  = incomeItems.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalExpense = expenseItems.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-800">Activity — {date}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-b from-cyan-50 to-white border border-cyan-200 rounded-xl p-4">
            <h4 className="font-medium text-cyan-800 mb-2">Income</h4>
            <ul className="space-y-2 max-h-56 overflow-auto pr-2">
              {incomeItems.length === 0 && <li className="text-sm text-slate-500">No income entries</li>}
              {incomeItems.map((e) => (
                <li key={e.id} className="text-sm flex justify-between">
                  <span className="text-slate-700">{e.source || 'Income'}{e.platform ? ` • ${e.platform}` : ''}</span>
                  <span className="font-semibold text-cyan-700">${Number(e.amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-slate-700 flex justify-between border-t pt-2">
              <span>Total</span>
              <span className="font-semibold text-cyan-700">${totalIncome.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-gradient-to-b from-amber-50 to-white border border-amber-200 rounded-xl p-4">
            <h4 className="font-medium text-amber-800 mb-2">Expenses</h4>
            <ul className="space-y-2 max-h-56 overflow-auto pr-2">
              {expenseItems.length === 0 && <li className="text-sm text-slate-500">No expenses</li>}
              {expenseItems.map((e) => (
                <li key={e.id} className="text-sm flex justify-between">
                  <span className="text-slate-700">{e.description || 'Expense'}{e.category ? ` • ${e.category}` : ''}</span>
                  <span className="font-semibold text-amber-700">-${Number(e.amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 text-sm text-slate-700 flex justify-between border-t pt-2">
              <span>Total</span>
              <span className="font-semibold text-amber-700">-${totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
