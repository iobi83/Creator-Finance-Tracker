'use client';
import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Calculator,
  PlusCircle,
  Trash2,
  CalendarDays,
  Edit3,
  Save,
  X,
  Info,
  FileDown,
  LayoutDashboard,
} from 'lucide-react';

// Brand palette: Rich Indigo (primary), Bright Cyan (secondary), Gold accents
const INDIGO = '#4338CA'; // indigo-700
const CYAN = '#06B6D4'; // cyan-500
const GOLD = '#D97706'; // amber-700

const CreatorFlowTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'income' | 'expenses' | 'brands' | 'calendar' | 'tax'>('dashboard');

  // --- Data ---
  const [incomeEntries, setIncomeEntries] = useState(
    [
      { id: 1, date: '2025-09-15', source: 'TikTok Shop', platform: 'TikTok', description: 'Commission from skincare promo', amount: 450, category: 'Affiliate' },
      { id: 2, date: '2025-09-20', source: 'Brand Deal', platform: 'Instagram', description: 'Fitness brand partnership', amount: 800, category: 'Sponsorship' },
      { id: 3, date: '2025-09-05', source: 'Trading', platform: 'Other', description: 'Stock market gains', amount: 230, category: 'Trading' },
    ] as Array<{
      id: number; date: string; source: string; platform?: string; description?: string; amount: number; category: string;
    }>
  );

  const [expenses, setExpenses] = useState(
    [
      { id: 1, date: '2025-09-10', category: 'Equipment', description: 'Ring light for content', amount: 120, taxDeductible: true },
      { id: 2, date: '2025-09-12', category: 'Software', description: 'Canva Pro subscription', amount: 15, taxDeductible: true },
      { id: 3, date: '2025-09-08', category: 'Marketing', description: 'Instagram ads', amount: 85, taxDeductible: true },
    ] as Array<{
      id: number; date: string; category: string; description?: string; amount: number; taxDeductible: boolean;
    }>
  );

  const [brandDeals, setBrandDeals] = useState(
    [
      { id: 1, brand: 'FitTech Co', campaign: 'Summer Wellness', stage: 'Negotiation', dueDate: '2025-10-15', paymentStatus: 'Pending', amount: 1200, notes: 'Need to submit content draft' },
      { id: 2, brand: 'StyleBox', campaign: 'Fall Fashion', stage: 'Signed', dueDate: '2025-10-30', paymentStatus: 'Not Due', amount: 800, notes: 'Contract signed, content due Oct 30' },
    ] as Array<{
      id: number; brand: string; campaign: string; stage: string; dueDate?: string; paymentStatus: string; amount: number; notes?: string;
    }>
  );

  // --- Settings / derived ---
  const [taxRate, setTaxRate] = useState<number>(25);
  const [monthlyBufferGoal, setMonthlyBufferGoal] = useState<number>(2000);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 8, 1));

  // --- New entry forms ---
  const [newIncome, setNewIncome] = useState({ date: '', source: 'TikTok Shop', platform: '', description: '', amount: '', category: 'Affiliate' });
  const [newExpense, setNewExpense] = useState({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
  const [newBrandDeal, setNewBrandDeal] = useState({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });

  // --- Editing states ---
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);
  const [incomeDraft, setIncomeDraft] = useState<any>(null);

  const [editingDealId, setEditingDealId] = useState<number | null>(null);
  const [dealDraft, setDealDraft] = useState<any>(null);

  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [expenseDraft, setExpenseDraft] = useState<any>(null);

  // --- UI state ---
  const [showTaxInfo, setShowTaxInfo] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // PDF export options modal
  const [showPdfOptions, setShowPdfOptions] = useState<boolean>(false);
  const [pdfSections, setPdfSections] = useState<{ [k: string]: boolean }>({
    dashboard: true,
    income: true,
    expenses: true,
    brands: true,
    tax: true,
    calendar: false,
  });

  // --- Derived totals ---
  const totalIncome = incomeEntries.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const deductibleExpenses = expenses.filter(e => e.taxDeductible).reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  const estimatedTax = (netProfit * taxRate) / 100;

  // --- Monthly metrics ---
  const getCurrentMonthData = () => {
    const m = currentDate.getMonth();
    const y = currentDate.getFullYear();
    const monthlyIncome = incomeEntries
      .filter(e => new Date(e.date).getMonth() === m && new Date(e.date).getFullYear() === y)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const monthlyExpenses = expenses
      .filter(e => new Date(e.date).getMonth() === m && new Date(e.date).getFullYear() === y)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);
    return { monthlyIncome, monthlyExpenses };
  };
  const { monthlyIncome, monthlyExpenses } = getCurrentMonthData();
  const monthlyNetProfit = monthlyIncome - monthlyExpenses;
  const bufferProgress = monthlyBufferGoal > 0 ? (monthlyNetProfit / monthlyBufferGoal) * 100 : 0;
  const bufferSurplus = monthlyNetProfit > monthlyBufferGoal ? monthlyNetProfit - monthlyBufferGoal : 0;

  // --- Actions: add ---
  const addIncome = () => {
    if (newIncome.date && newIncome.source && newIncome.amount !== '') {
      setIncomeEntries(prev => [
        ...prev,
        { ...newIncome, id: Date.now(), amount: parseFloat(String(newIncome.amount)) || 0 },
      ]);
      setNewIncome({ date: '', source: 'TikTok Shop', platform: '', description: '', amount: '', category: 'Affiliate' });
    }
  };
  const addExpense = () => {
    if (newExpense.date && newExpense.description && newExpense.amount !== '') {
      setExpenses(prev => [
        ...prev,
        { ...newExpense, id: Date.now(), amount: parseFloat(String(newExpense.amount)) || 0 },
      ]);
      setNewExpense({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
    }
  };
  const addBrandDeal = () => {
    if (newBrandDeal.brand && newBrandDeal.campaign && newBrandDeal.amount !== '') {
      setBrandDeals(prev => [
        ...prev,
        { ...newBrandDeal, id: Date.now(), amount: parseFloat(String(newBrandDeal.amount)) || 0 },
      ]);
      setNewBrandDeal({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });
    }
  };

  // --- Actions: delete ---
  const deleteIncome = (id: number) => setIncomeEntries(prev => prev.filter(e => e.id !== id));
  const deleteExpense = (id: number) => setExpenses(prev => prev.filter(e => e.id !== id));
  const deleteBrandDeal = (id: number) => setBrandDeals(prev => prev.filter(e => e.id !== id));

  // --- Actions: edit income ---
  const startEditIncome = (entry: any) => {
    setEditingIncomeId(entry.id);
    setIncomeDraft({ ...entry, amount: String(entry.amount) });
  };
  const saveIncomeEdit = () => {
    if (!incomeDraft) return;
    setIncomeEntries(prev => prev.map(e => (e.id === editingIncomeId ? { ...incomeDraft, amount: parseFloat(String(incomeDraft.amount)) || 0 } : e)));
    setEditingIncomeId(null);
    setIncomeDraft(null);
  };
  const cancelIncomeEdit = () => {
    setEditingIncomeId(null);
    setIncomeDraft(null);
  };

  // --- Actions: edit deal ---
  const startEditDeal = (deal: any) => {
    setEditingDealId(deal.id);
    setDealDraft({ ...deal, amount: String(deal.amount) });
  };
  const saveDealEdit = () => {
    if (!dealDraft) return;
    setBrandDeals(prev => prev.map(d => (d.id === editingDealId ? { ...dealDraft, amount: parseFloat(String(dealDraft.amount)) || 0 } : d)));
    setEditingDealId(null);
    setDealDraft(null);
  };
  const cancelDealEdit = () => {
    setEditingDealId(null);
    setDealDraft(null);
  };
  const updateBrandDealStage = (id: number, newStage: string) =>
    setBrandDeals(prev => prev.map(d => (d.id === id ? { ...d, stage: newStage } : d)));

  // --- Actions: edit expense ---
  const startEditExpense = (exp: any) => {
    setEditingExpenseId(exp.id);
    setExpenseDraft({ ...exp, amount: String(exp.amount) });
  };
  const saveExpenseEdit = () => {
    if (!expenseDraft) return;
    setExpenses(prev => prev.map(e => (e.id === editingExpenseId ? { ...expenseDraft, amount: parseFloat(String(expenseDraft.amount)) || 0 } : e)));
    setEditingExpenseId(null);
    setExpenseDraft(null);
  };
  const cancelExpenseEdit = () => {
    setEditingExpenseId(null);
    setExpenseDraft(null);
  };

  // --- Calendar helpers ---
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const getDateStr = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const getDateEntries = (day: number) => {
    const dateStr = getDateStr(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayIncome = incomeEntries.filter(e => e.date === dateStr);
    const dayExpenses = expenses.filter(e => e.date === dateStr);
    return { dateStr, dayIncome, dayExpenses };
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: React.ReactNode[] = [];
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-20 border border-gray-200 bg-gray-50" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const { dayIncome, dayExpenses } = getDateEntries(day);
      const totalDayIncome = dayIncome.reduce((s, e) => s + (Number(e.amount) || 0), 0);
      const totalDayExpenses = dayExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
      const hasActivity = dayIncome.length > 0 || dayExpenses.length > 0;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDay(getDateStr(currentDate.getFullYear(), currentDate.getMonth(), day))}
          className={`h-20 border border-gray-200 p-1 bg-white hover:bg-gray-50 transition-colors text-left ${hasActivity ? 'ring-1 ring-emerald-200' : ''}`}
        >
          <div className="text-sm font-medium text-gray-700 mb-1">{day}</div>
          {hasActivity && (
            <div className="space-y-1">
              {totalDayIncome > 0 && (
                <div className="text-xs" style={{ background: '#ECFEFF', color: '#0E7490', borderRadius: 4, padding: '1px 4px' }}>
                  +${totalDayIncome}
                </div>
              )}
              {totalDayExpenses > 0 && (
                <div className="text-xs bg-red-100 text-red-800 rounded px-1 py-0.5">-${totalDayExpenses}</div>
              )}
            </div>
          )}
        </button>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
              {d}
            </div>
          ))}
          {days}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ background: '#ECFEFF' }} /> <span>Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded" /> <span>Expenses</span>
          </div>
        </div>
      </div>
    );
  };

  // --- PDF helpers ---
  const generatePdfHtml = (opts: { [k: string]: boolean }) => {
    const style = `body{font-family: system-ui, sans-serif; padding:24px; color:#111} h1{margin:0 0 8px;} h2{margin:24px 0 8px;} .meta{margin:8px 0 16px;color:#444} table{width:100%; border-collapse:collapse; margin:12px 0;} th,td{border:1px solid #ddd; padding:8px; font-size:12px;} th{background:#f5f5f5;} .pill{display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px}`;
    const header = `<h1 style="display:flex;align-items:center;gap:8px"><span style=\"width:18px;height:18px;border-radius:4px;background:${INDIGO};display:inline-block\"></span> CreatorFlow – Financial Summary</h1>`;
    const meta = `<div class='meta'><strong>Total Income:</strong> $${totalIncome.toFixed(2)} &nbsp; | &nbsp; <strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)} &nbsp; | &nbsp; <strong>Net Profit:</strong> $${netProfit.toFixed(2)} &nbsp; | &nbsp; <strong>Est. Tax:</strong> $${estimatedTax.toFixed(2)}</div>`;

    const incomeRows = incomeEntries
      .map(
        e => `<tr><td>${e.date}</td><td>${e.source}</td><td>${e.platform || ''}</td><td>${e.description || ''}</td><td>$${Number(e.amount).toFixed(2)}</td></tr>`
      )
      .join('');
    const expenseRows = expenses
      .map(
        e => `<tr><td>${e.date}</td><td>${e.category}</td><td>${e.description || ''}</td><td>${e.taxDeductible ? 'Yes' : 'No'}</td><td>$${Number(e.amount).toFixed(2)}</td></tr>`
      )
      .join('');
    const dealRows = brandDeals
      .map(
        d => `<tr><td>${d.brand}</td><td>${d.campaign}</td><td>${d.stage}</td><td>${d.paymentStatus}</td><td>${d.dueDate || ''}</td><td>$${Number(d.amount).toFixed(2)}</td></tr>`
      )
      .join('');

    let body = header + meta;
    if (opts.dashboard) {
      body += `<h2>Dashboard Snapshot</h2><p>Monthly Net Profit: $${monthlyNetProfit.toFixed(2)} | Buffer Goal: $${monthlyBufferGoal.toFixed(2)}</p>`;
    }
    if (opts.income) {
      body += `<h2>Income</h2><table><thead><tr><th>Date</th><th>Source</th><th>Platform</th><th>Description</th><th>Amount</th></tr></thead><tbody>${incomeRows}</tbody></table>`;
    }
    if (opts.expenses) {
      body += `<h2>Expenses</h2><table><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Tax Deductible</th><th>Amount</th></tr></thead><tbody>${expenseRows}</tbody></table>`;
    }
    if (opts.brands) {
      body += `<h2>Brand Deals</h2><table><thead><tr><th>Brand</th><th>Campaign</th><th>Stage</th><th>Payment</th><th>Due</th><th>Amount</th></tr></thead><tbody>${dealRows}</tbody></table>`;
    }
    if (opts.tax) {
      body += `<h2>Tax Summary</h2><p>Estimated Tax Rate: ${taxRate}%<br/>Estimated Tax: $${estimatedTax.toFixed(2)}<br/>Deductible Expenses: $${deductibleExpenses.toFixed(2)}</p>`;
    }
    if (opts.calendar) {
      body += `<h2>Calendar Activity (Current Month)</h2><p>Days with activity are highlighted in the app. Consider exporting CSV for full per-day logs.</p>`;
    }
    body += `<p style='margin-top:16px;font-size:11px;color:#666'>Note: This export is for record-keeping only and is not tax advice. Consult a qualified tax professional.</p>`;
    return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>CreatorFlow Export</title><style>${style}</style></head><body>${body}</body></html>`;
  };

  const openPdfDialog = () => setShowPdfOptions(true);
  const exportSelectedPdf = () => {
    try {
      const html = generatePdfHtml(pdfSections);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Prefer opening a blob URL (avoids about:blank + some CSP/popup issues)
      const w = window.open(url, '_blank', 'noopener,noreferrer');

      if (w && 'print' in w) {
        // Give the new doc a moment to load before printing
        const timer = setInterval(() => {
          try {
            if (w.document && w.document.readyState === 'complete') {
              clearInterval(timer);
              w.focus();
              w.print();
              // Best-effort cleanup of the blob URL later
              setTimeout(() => URL.revokeObjectURL(url), 5000);
            }
          } catch {
            // Cross-origin race; ignore
          }
        }, 150);
      } else {
        // Popup blocked: fallback to hidden iframe print
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } finally {
            setTimeout(() => {
              URL.revokeObjectURL(url);
              document.body.removeChild(iframe);
            }, 2000);
          }
        };
      }
    } catch (err) {
      console.error('PDF export error', err);
      alert('Sorry—there was a problem generating your PDF. Try allowing popups for this site and retry.');
    } finally {
      setShowPdfOptions(false);
    }
  };

  // --- DEV sanity checks (simple runtime tests) ---
  useEffect(() => {
    try {
      console.assert(
        Math.abs(netProfit - (totalIncome - totalExpenses)) < 1e-6,
        'netProfit should equal totalIncome - totalExpenses'
      );
      console.assert(
        Math.abs(estimatedTax - (netProfit * taxRate) / 100) < 1e-6,
        'estimatedTax formula mismatch'
      );
    } catch {}
  }, [totalIncome, totalExpenses, netProfit, estimatedTax, taxRate]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between">
        <div className="flex items-start gap-3">
          {/* Simple logo before name */}
          <div className="h-10 w-10 rounded-lg" style={{ background: INDIGO }} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span>CreatorFlow</span>
            </h1>
            <p className="text-gray-700">Finally, budgeting that works for micro-influencers</p>
          </div>
        </div>
        <button
          onClick={openPdfDialog}
          className="inline-flex items-center gap-2 text-white px-4 py-2 rounded hover:opacity-95"
          style={{ background: INDIGO }}
        >
          <FileDown className="h-4 w-4" /> Download PDF
        </button>
      </div>

      {/* Key Metrics (white cards; use palette on icons/data) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Income</p>
              <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8" style={{ color: CYAN }} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold">${netProfit.toLocaleString()}</p>
            </div>
            <Calculator className="h-8 w-8" style={{ color: INDIGO }} />
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Est. Tax Owed</p>
              <p className="text-2xl font-bold">${estimatedTax.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8" style={{ color: GOLD }} />
          </div>
        </div>
      </div>

      {/* Buffer */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Monthly Buffer Progress</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Goal: $</span>
            <input
              type="number"
              value={monthlyBufferGoal}
              onChange={e => setMonthlyBufferGoal(parseFloat(e.target.value) || 0)}
              className="w-24 text-sm border rounded px-2 py-1"
              min="0"
            />
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full transition-all"
            style={{ width: `${Math.min(bufferProgress, 100)}%`, background: CYAN }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-600">
            ${monthlyNetProfit.toLocaleString()} of ${monthlyBufferGoal.toLocaleString()} this month ({Math.round(bufferProgress)}%)
          </p>
          {bufferSurplus > 0 && (
            <p className="text-sm font-medium" style={{ color: INDIGO }}>
              Surplus: +${bufferSurplus.toLocaleString()} ✓
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex flex-wrap border-b">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'income', label: 'Income', icon: TrendingUp },
            { id: 'expenses', label: 'Expenses & Deductibles', icon: DollarSign },
            { id: 'brands', label: 'Brand Pipeline', icon: Calendar },
            { id: 'calendar', label: 'Calendar View', icon: CalendarDays },
            { id: 'tax', label: 'Tax Planning', icon: Calculator },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 md:px-6 py-3 font-medium transition-colors ${
                activeTab === (tab.id as any) ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Recent Income</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-1">Date</th>
                      <th>Source</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeEntries
                      .slice(-5)
                      .reverse()
                      .map(e => (
                        <tr key={e.id} className="border-t">
                          <td className="py-1">{e.date}</td>
                          <td>{e.source}</td>
                          <td className="font-medium" style={{ color: CYAN }}>
                            ${e.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Recent Expenses</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-1">Date</th>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses
                      .slice(-5)
                      .reverse()
                      .map(e => (
                        <tr key={e.id} className="border-t">
                          <td className="py-1">{e.date}</td>
                          <td>{e.category}</td>
                          <td className="font-medium text-red-700">${e.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
                <h4 className="font-semibold mb-3">Brand Deals Snapshot</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-yellow-100 p-3 rounded">
                    <p className="text-yellow-800">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-700">
                      {brandDeals.filter(d => ['Outreach', 'Negotiation', 'Signed'].includes(d.stage)).length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p className="text-green-800">Pending Payment</p>
                    <p className="text-2xl font-bold text-green-700">
                      ${brandDeals
                        .filter(d => d.paymentStatus === 'Pending')
                        .reduce((s, d) => s + (Number(d.amount) || 0), 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded">
                    <p className="text-red-800">Overdue</p>
                    <p className="text-2xl font-bold text-red-700">
                      {brandDeals.filter(d => d.paymentStatus === 'Overdue').length}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded">
                    <p className="text-blue-800">Completed</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {brandDeals.filter(d => d.stage === 'Completed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALENDAR */}
          {activeTab === 'calendar' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
              {renderCalendar()}
            </div>
          )}

          {/* INCOME */}
          {activeTab === 'income' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Income</h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Add New Income</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={newIncome.date}
                    onChange={e => setNewIncome({ ...newIncome, date: e.target.value })}
                    className="border rounded px-3 py-2"
                  />

                  {/* Income Source dropdown */}
                  <select
                    value={newIncome.source}
                    onChange={e => setNewIncome({ ...newIncome, source: e.target.value })}
                    className="border rounded px-3 py-2"
                  >
                    {['TikTok Shop', 'Brand Deal', 'Trading', 'YouTube AdSense', 'Affiliate (Amazon/LTK)', 'Other'].map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Platform (TikTok, IG, YouTube...)"
                    value={newIncome.platform}
                    onChange={e => setNewIncome({ ...newIncome, platform: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Description (eg. Commission for skincare promo)"
                    value={newIncome.description}
                    onChange={e => setNewIncome({ ...newIncome, description: e.target.value })}
                    className="border rounded px-3 py-2"
                  />

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newIncome.amount}
                      onChange={e => setNewIncome({ ...newIncome, amount: e.target.value })}
                      className="border rounded px-3 py-2 flex-1"
                    />
                    <button
                      onClick={addIncome}
                      className="text-white px-4 py-2 rounded hover:opacity-90 flex items-center"
                      style={{ background: INDIGO }}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>

                  <select
                    value={newIncome.category}
                    onChange={e => setNewIncome({ ...newIncome, category: e.target.value })}
                    className="border rounded px-3 py-2"
                  >
                    <option value="Affiliate">Affiliate/TikTok Shop</option>
                    <option value="Sponsorship">Brand Sponsorship</option>
                    <option value="Trading">Trading Profits</option>
                    <option value="YouTube">YouTube Ad Revenue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tip: "Income Source" covers items like TikTok Shop, Brand Deal, Trading, AdSense, Affiliate networks, etc.
                </p>
              </div>

              <div className="space-y-3">
                {incomeEntries.map(entry => (
                  <div key={entry.id} className="p-3 bg-green-50 rounded-lg">
                    {editingIncomeId === entry.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                        <input
                          type="date"
                          value={incomeDraft.date}
                          onChange={e => setIncomeDraft({ ...incomeDraft, date: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                        <select
                          value={incomeDraft.source}
                          onChange={e => setIncomeDraft({ ...incomeDraft, source: e.target.value })}
                          className="border rounded px-2 py-1"
                        >
                          {['TikTok Shop', 'Brand Deal', 'Trading', 'YouTube AdSense', 'Affiliate (Amazon/LTK)', 'Other'].map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={incomeDraft.platform}
                          onChange={e => setIncomeDraft({ ...incomeDraft, platform: e.target.value })}
                          placeholder="Platform"
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={incomeDraft.description}
                          onChange={e => setIncomeDraft({ ...incomeDraft, description: e.target.value })}
                          placeholder="Description"
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="number"
                          value={incomeDraft.amount}
                          onChange={e => setIncomeDraft({ ...incomeDraft, amount: e.target.value })}
                          placeholder="Amount"
                          className="border rounded px-2 py-1"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={saveIncomeEdit}
                            className="inline-flex items-center gap-1 text-white px-3 py-1 rounded hover:opacity-95 text-sm"
                            style={{ background: INDIGO }}
                          >
                            <Save className="h-4 w-4" />Save
                          </button>
                          <button
                            onClick={cancelIncomeEdit}
                            className="inline-flex items-center gap-1 bg-gray-200 px-3 py-1 rounded text-sm"
                          >
                            <X className="h-4 w-4" />Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{entry.source}</span>
                            <span className="text-xs" style={{ background: '#C7F9FF', color: '#0E7490', padding: '2px 8px', borderRadius: 9999 }}>{entry.category}</span>
                            <span className="text-sm text-gray-600">{entry.platform}</span>
                          </div>
                          <p className="text-sm text-gray-600">{entry.description}</p>
                          <p className="text-xs text-gray-500">{entry.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold" style={{ color: CYAN }}>
                            ${entry.amount}
                          </span>
                          <button onClick={() => startEditIncome(entry)} className="hover:opacity-90" style={{ color: INDIGO }}>
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteIncome(entry.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPENSES */}
          {activeTab === 'expenses' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Expenses & Tax Deductibles</h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4 relative">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  Add New Expense
                  <button
                    type="button"
                    onClick={() => setShowTaxInfo(v => !v)}
                    className="inline-flex items-center"
                    style={{ color: GOLD }}
                  >
                    <Info className="h-4 w-4" /> <span className="text-xs">What qualifies?</span>
                  </button>
                </h4>
                {showTaxInfo && (
                  <div className="absolute right-4 top-12 bg-white border rounded-md shadow p-3 text-xs max-w-sm z-10">
                    <p className="font-semibold mb-1">Expenses that may be deductible:</p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-700">
                      <li>Equipment & supplies for content (cameras, lights, mics)</li>
                      <li>Software & subscriptions (editing tools, Canva, schedulers)</li>
                      <li>Marketing & ads (sponsored posts, ad spend)</li>
                      <li>Home office % (portion of internet, utilities, workspace)</li>
                      <li>Travel for business (events, shoots) & education/courses)</li>
                    </ul>
                    <p className="mt-2 text-gray-500">Always consult a tax professional for your situation.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={newExpense.category}
                    onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="border rounded px-3 py-2"
                  >
                    {['Equipment', 'Software', 'Marketing', 'Office', 'Travel', 'Education', 'Other'].map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="border rounded px-3 py-2 flex-1"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newExpense.taxDeductible}
                        onChange={e => setNewExpense({ ...newExpense, taxDeductible: e.target.checked })}
                      />
                      Tax Deductible
                    </label>
                    <button
                      onClick={addExpense}
                      className="text-white px-4 py-2 rounded hover:opacity-90"
                      style={{ background: INDIGO }}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 p-4 mb-4" style={{ borderColor: GOLD }}>
                <h4 className="font-medium" style={{ color: GOLD }}>Tax Deductible Summary</h4>
                <p className="text-yellow-700">
                  Total deductible expenses: <span className="font-bold">${deductibleExpenses}</span>
                </p>
                <p className="text-sm" style={{ color: GOLD }}>
                  Approx tax savings @ {taxRate}%: ${(deductibleExpenses * taxRate / 100).toFixed(0)}
                </p>
              </div>

              <div className="space-y-3">
                {expenses.map(expense => (
                  <div key={expense.id} className="p-3 bg-red-50 rounded-lg">
                    {editingExpenseId === expense.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                        <input
                          type="date"
                          value={expenseDraft.date}
                          onChange={e => setExpenseDraft({ ...expenseDraft, date: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                        <select
                          value={expenseDraft.category}
                          onChange={e => setExpenseDraft({ ...expenseDraft, category: e.target.value })}
                          className="border rounded px-2 py-1"
                        >
                          {['Equipment', 'Software', 'Marketing', 'Office', 'Travel', 'Education', 'Other'].map(c => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={expenseDraft.description}
                          onChange={e => setExpenseDraft({ ...expenseDraft, description: e.target.value })}
                          placeholder="Description"
                          className="border rounded px-2 py-1"
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={expenseDraft.taxDeductible}
                            onChange={e => setExpenseDraft({ ...expenseDraft, taxDeductible: e.target.checked })}
                          />
                          Tax Deductible
                        </label>
                        <input
                          type="number"
                          value={expenseDraft.amount}
                          onChange={e => setExpenseDraft({ ...expenseDraft, amount: e.target.value })}
                          placeholder="Amount"
                          className="border rounded px-2 py-1"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={saveExpenseEdit}
                            className="inline-flex items-center gap-1 text-white px-3 py-1 rounded hover:opacity-95 text-sm"
                            style={{ background: INDIGO }}
                          >
                            <Save className="h-4 w-4" />Save
                          </button>
                          <button
                            onClick={cancelExpenseEdit}
                            className="inline-flex items-center gap-1 bg-gray-200 px-3 py-1 rounded text-sm"
                          >
                            <X className="h-4 w-4" />Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{expense.description}</span>
                            <span className="text-sm bg-red-200 px-2 py-1 rounded">{expense.category}</span>
                            {expense.taxDeductible && (
                              <span className="text-xs" style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 9999 }}>
                                Tax Deductible
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{expense.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-red-700">${expense.amount}</span>
                          <button onClick={() => startEditExpense(expense)} className="hover:opacity-90" style={{ color: INDIGO }}>
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteExpense(expense.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BRAND DEALS */}
          {activeTab === 'brands' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Brand Deal Pipeline</h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Add New Brand Deal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Brand name"
                    value={newBrandDeal.brand}
                    onChange={e => setNewBrandDeal({ ...newBrandDeal, brand: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Campaign name"
                    value={newBrandDeal.campaign}
                    onChange={e => setNewBrandDeal({ ...newBrandDeal, campaign: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={newBrandDeal.stage}
                    onChange={e => setNewBrandDeal({ ...newBrandDeal, stage: e.target.value })}
                    className="border rounded px-3 py-2"
                  >
                    {['Outreach', 'Negotiation', 'Signed', 'Content Due', 'Completed'].map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newBrandDeal.paymentStatus}
                    onChange={e => setNewBrandDeal({ ...newBrandDeal, paymentStatus: e.target.value })}
                    className="border rounded px-3 py-2"
                  >
                    {['Pending', 'Not Due', 'Overdue', 'Paid'].map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newBrandDeal.dueDate}
                    onChange={e => setNewBrandDeal({ ...newBrandDeal, dueDate: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Deal value ($)"
                    value={newBrandDeal.amount}
                    onChange={e => setNewBrandDeal({ ...newBrandDeal, amount: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={newBrandDeal.notes}
                    onChange={e => setNewBrandDeal({ ...newBrandDeal, notes: e.target.value })}
                    className="border rounded px-3 py-2 md:col-span-2"
                  />
                  <button
                    onClick={addBrandDeal}
                    className="text-white px-4 py-2 rounded hover:opacity-90 flex items-center gap-2 md:col-span-2"
                    style={{ background: INDIGO }}
                  >
                    <PlusCircle className="h-4 w-4" />Add Brand Deal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <h5 className="font-medium text-yellow-800">In Progress</h5>
                  <p className="text-2xl font-bold text-yellow-600">
                    {brandDeals.filter(d => ['Outreach', 'Negotiation', 'Signed'].includes(d.stage)).length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <h5 className="font-medium text-green-800">Pending Payment</h5>
                  <p className="text-2xl font-bold text-green-600">
                    ${brandDeals
                      .filter(d => d.paymentStatus === 'Pending')
                      .reduce((s, d) => s + (Number(d.amount) || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <h5 className="font-medium text-red-800">Overdue</h5>
                  <p className="text-2xl font-bold text-red-600">{brandDeals.filter(d => d.paymentStatus === 'Overdue').length}</p>
                </div>
              </div>

              <div className="space-y-3">
                {brandDeals.map(deal => (
                  <div key={deal.id} className="bg-white border rounded-lg p-4">
                    {editingDealId === deal.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                        <input
                          type="text"
                          value={dealDraft.brand}
                          onChange={e => setDealDraft({ ...dealDraft, brand: e.target.value })}
                          placeholder="Brand"
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={dealDraft.campaign}
                          onChange={e => setDealDraft({ ...dealDraft, campaign: e.target.value })}
                          placeholder="Campaign"
                          className="border rounded px-2 py-1"
                        />
                        <select
                          value={dealDraft.stage}
                          onChange={e => setDealDraft({ ...dealDraft, stage: e.target.value })}
                          className="border rounded px-2 py-1"
                        >
                          {['Outreach', 'Negotiation', 'Signed', 'Content Due', 'Completed'].map(s => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <select
                          value={dealDraft.paymentStatus}
                          onChange={e => setDealDraft({ ...dealDraft, paymentStatus: e.target.value })}
                          className="border rounded px-2 py-1"
                        >
                          {['Pending', 'Not Due', 'Overdue', 'Paid'].map(s => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={dealDraft.dueDate}
                          onChange={e => setDealDraft({ ...dealDraft, dueDate: e.target.value })}
                          className="border rounded px-2 py-1"
                        />
                        <div className="flex gap-2 justify-end">
                          <input
                            type="number"
                            value={dealDraft.amount}
                            onChange={e => setDealDraft({ ...dealDraft, amount: e.target.value })}
                            placeholder="Amount"
                            className="border rounded px-2 py-1 w-32"
                          />
                          <button
                            onClick={saveDealEdit}
                            className="inline-flex items-center gap-1 text-white px-3 py-1 rounded hover:opacity-95 text-sm"
                            style={{ background: INDIGO }}
                          >
                            <Save className="h-4 w-4" />Save
                          </button>
                          <button
                            onClick={cancelDealEdit}
                            className="inline-flex items-center gap-1 bg-gray-200 px-3 py-1 rounded text-sm"
                          >
                            <X className="h-4 w-4" />Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-lg">{deal.brand}</h5>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{deal.campaign}</span>
                            <select
                              value={deal.stage}
                              onChange={e => updateBrandDealStage(deal.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              {['Outreach', 'Negotiation', 'Signed', 'Content Due', 'Completed'].map(s => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <strong>Due:</strong> {deal.dueDate || 'TBD'}
                            </p>
                            <p>
                              <strong>Payment:</strong>{' '}
                              <span
                                className={`ml-1 px-2 py-1 rounded text-xs ${
                                  deal.paymentStatus === 'Paid'
                                    ? 'bg-green-100 text-green-800'
                                    : deal.paymentStatus === 'Overdue'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {deal.paymentStatus}
                              </span>
                            </p>
                            {deal.notes && (
                              <p>
                                <strong>Notes:</strong> {deal.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-green-700">${deal.amount.toLocaleString()}</span>
                          <button onClick={() => startEditDeal(deal)} className="hover:opacity-90" style={{ color: INDIGO }}>
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteBrandDeal(deal.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAX */}
          {activeTab === 'tax' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Tax Planning & Estimates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Tax Calculator</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Tax Rate (%)</label>
                      <input
                        type="number"
                        value={taxRate}
                        onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-full border rounded px-3 py-2"
                        min={0}
                        max={50}
                      />
                    </div>
                    <div className="pt-3 border-t">
                      <p>
                        <strong>Taxable Income:</strong> ${netProfit.toLocaleString()}
                      </p>
                      <p>
                        <strong>Deductible Expenses:</strong> ${deductibleExpenses.toLocaleString()}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        <strong>Estimated Tax:</strong> ${estimatedTax.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Quarterly Tax Planning</h4>
                  {['Apr 15', 'Jun 15', 'Sep 15', 'Jan 15'].map((due, i) => (
                    <div key={due} className="flex justify-between">
                      <span>Q{i + 1} (Due: {due})</span>
                      <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                    </div>
                  ))}
                  <p className="text-sm text-purple-600 mt-3">
                    💡 Tip: Set aside {(estimatedTax / 12).toFixed(0)}/month for taxes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Day breakdown modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setSelectedDay(null)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Breakdown for {selectedDay}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Income</h4>
                <ul className="space-y-1 text-sm">
                  {incomeEntries
                    .filter(e => e.date === selectedDay)
                    .map(e => (
                      <li key={e.id} className="flex justify-between">
                        <span>
                          {e.source} — {e.description}
                        </span>
                        <span className="font-medium" style={{ color: CYAN }}>
                          ${e.amount}
                        </span>
                      </li>
                    ))}
                  {incomeEntries.filter(e => e.date === selectedDay).length === 0 && (
                    <li className="text-gray-500">No income recorded.</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Expenses</h4>
                <ul className="space-y-1 text-sm">
                  {expenses
                    .filter(e => e.date === selectedDay)
                    .map(e => (
                      <li key={e.id} className="flex justify-between">
                        <span>
                          {e.category} — {e.description}
                        </span>
                        <span className="text-red-700 font-medium">${e.amount}</span>
                      </li>
                    ))}
                  {expenses.filter(e => e.date === selectedDay).length === 0 && (
                    <li className="text-gray-500">No expenses recorded.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF options modal */}
      {showPdfOptions && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowPdfOptions(false)} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold mb-3">Export to PDF</h3>
            <p className="text-sm text-gray-600 mb-4">Choose which sections to include:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.keys(pdfSections).map(key => (
                <label key={key} className="flex items-center gap-2 capitalize">
                  <input
                    type="checkbox"
                    checked={!!pdfSections[key]}
                    onChange={e => setPdfSections(prev => ({ ...prev, [key]: e.target.checked }))}
                  />
                  {key}
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowPdfOptions(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={exportSelectedPdf} className="px-4 py-2 text-white rounded" style={{ background: INDIGO }}>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>💡 CreatorFlow helps micro‑influencers manage irregular income & maximize tax deductions.</p>
      </div>
    </div>
  );
};

export default CreatorFlowTracker;
