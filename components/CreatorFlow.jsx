import React, { useMemo, useState } from 'react';
import {
  DollarSign, TrendingUp, Calendar, Calculator, PlusCircle, Trash2,
  CalendarDays, Download, Edit3, Info, X, BarChart3, User
} from 'lucide-react';
import SupabaseIncomeLoader from './SupabaseIncomeLoader';

export default function CreatorFlow() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- Income (actual money received) ---
  const [incomeEntries, setIncomeEntries] = useState([
    { id: 1, date: '2025-09-15', source: 'TikTok Shop Commission', platform: 'TikTok', description: 'Commission from skincare promo', amount: 450, category: 'Affiliate' },
    { id: 2, date: '2025-09-20', source: 'FitTech Brand Deal', platform: 'Brand', description: 'Paid brand deal', amount: 800, category: 'Sponsorship' },
  ]);
  const [newIncome, setNewIncome] = useState({ date: '', source: '', platform: '', description: '', amount: '', category: 'Affiliate' });
  const [editingIncome, setEditingIncome] = useState(null);

  // --- Expenses ---
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2025-09-10', category: 'Equipment', description: 'Ring light for content', amount: 120, taxDeductible: true },
    { id: 2, date: '2025-09-12', category: 'Software', description: 'Canva Pro subscription', amount: 15, taxDeductible: true },
    { id: 3, date: '2025-09-08', category: 'Marketing', description: 'Instagram ads', amount: 85, taxDeductible: true }
  ]);
  const [newExpense, setNewExpense] = useState({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
  const [taxRate, setTaxRate] = useState(25);
  const [showTaxInfo, setShowTaxInfo] = useState(false);

  // --- Brand Pipeline (unpaid pipeline) ---
  const [brandDeals, setBrandDeals] = useState([
    { id: 101, brand: 'FitTech Co', campaign: 'Summer Wellness', stage: 'Negotiation', dueDate: '2025-10-15', paymentStatus: 'Pending', amount: 1200, notes: 'Need to submit content draft' },
    { id: 102, brand: 'StyleBox', campaign: 'Fall Fashion', stage: 'Signed',       dueDate: '2025-10-30', paymentStatus: 'Not Due', amount: 800, notes: 'Contract signed, content due Oct 30' }
  ]);
  const [newBrandDeal, setNewBrandDeal] = useState({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });
  const [editingBrandDeal, setEditingBrandDeal] = useState(null);

  // --- Dashboard monthly goal tracker ---
  const [monthlyGoal, setMonthlyGoal] = useState(2000);

  // --- Calendar state ---
  const [calDate, setCalDate] = useState(new Date()); // visible month
  const [dayModal, setDayModal] = useState({ open: false, dateStr: '', income: [], expenses: [] });

  // --- Export PDF modal + print selections ---
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfSections, setPdfSections] = useState({
    dashboard: true,
    income: true,
    expenses: true,
    brands: true,
    calendar: false,
    tax: true,
  });
  const [printSelections, setPrintSelections] = useState(null); // set right before printing

  // ===== Derived metrics =====
  const totalIncome = useMemo(() => incomeEntries.reduce((s, e) => s + e.amount, 0), [incomeEntries]);
  const totalExpenses = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const deductibleExpenses = useMemo(() => expenses.filter(e => e.taxDeductible).reduce((s, e) => s + e.amount, 0), [expenses]);
  const netProfit = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
  const estimatedTax = useMemo(() => (netProfit * taxRate) / 100, [netProfit, taxRate]);

  const monthKey = (d) => (d || '').slice(0,7); // "YYYY-MM"
  const currentMonth = new Date().toISOString().slice(0,7);
  const monthlyIncome = useMemo(() =>
    incomeEntries.filter(e => monthKey(e.date) === currentMonth).reduce((s, e) => s + e.amount, 0),
  [incomeEntries]);
  const monthlyExpenses = useMemo(() =>
    expenses.filter(e => monthKey(e.date) === currentMonth).reduce((s, e) => s + e.amount, 0),
  [expenses]);
  const monthlyNet = monthlyIncome - monthlyExpenses;
  const goalProgress = Math.max(0, Math.min(100, Math.round((monthlyNet / (monthlyGoal || 1)) * 100)));
  const goalSurplus = Math.max(0, monthlyNet - monthlyGoal);

  // ===== Income handlers =====
  const addIncome = () => {
    if (!newIncome.source || !newIncome.amount) return;
    setIncomeEntries(prev => [
      ...prev,
      {
        ...newIncome,
        id: Date.now(),
        amount: parseFloat(newIncome.amount || 0),
        date: newIncome.date || new Date().toISOString().slice(0,10),
      }
    ]);
    setNewIncome({ date: '', source: '', platform: '', description: '', amount: '', category: 'Affiliate' });
  };
  const updateIncome = (id, field, value) => {
    setIncomeEntries(prev =>
      prev.map(e => (e.id === id ? { ...e, [field]: field === 'amount' ? parseFloat(value || 0) : value } : e))
    );
    setEditingIncome(null);
  };
  const deleteIncome = (id) => {
    setIncomeEntries(prev => prev.filter(e => e.id !== id));
  };

  // ===== Expense handlers =====
  const addExpense = () => {
    if (!newExpense.date || !newExpense.description || !newExpense.amount) return;
    setExpenses(prev => [
      ...prev,
      { ...newExpense, id: Date.now(), amount: parseFloat(newExpense.amount || 0) }
    ]);
    setNewExpense({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
  };
  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // ===== Brand handlers =====
  const addBrandDeal = () => {
    if (!newBrandDeal.brand || !newBrandDeal.campaign || !newBrandDeal.amount) return;
    setBrandDeals(prev => [
      ...prev,
      { ...newBrandDeal, id: Date.now(), amount: parseFloat(newBrandDeal.amount || 0) }
    ]);
    setNewBrandDeal({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });
  };

  // change payment status; Paid → add income (dated today), revert → remove linked income
  const updateBrandDealStatus = (id, newStatus) => {
    setBrandDeals(prevDeals => {
      const deal = prevDeals.find(d => d.id === id);
      if (!deal) return prevDeals;

      let updatedDeal = { ...deal, paymentStatus: newStatus };
      let nextDeals = prevDeals.map(d => (d.id === id ? updatedDeal : d));

      if (newStatus === 'Paid' && !deal.linkedIncomeId) {
        const newIncome = {
          id: Date.now(),
          date: new Date().toISOString().slice(0,10),   // books today so dashboard goal updates
          paidAt: new Date().toISOString(),
          source: `${deal.brand} — ${deal.campaign}`,
          platform: 'Brand',
          description: 'Brand deal payment',
          amount: deal.amount,
          category: 'Sponsorship',
          fromDealId: deal.id,
        };
        setIncomeEntries(prevInc => [...prevInc, newIncome]);
        nextDeals = nextDeals.map(d => (d.id === id ? { ...updatedDeal, linkedIncomeId: newIncome.id } : d));
      }

      if (newStatus !== 'Paid' && deal.linkedIncomeId) {
        const linkedId = deal.linkedIncomeId;
        setIncomeEntries(prevInc => prevInc.filter(i => i.id !== linkedId));
        nextDeals = nextDeals.map(d => (d.id === id ? { ...updatedDeal, linkedIncomeId: undefined } : d));
      }

      return nextDeals;
    });
    setEditingBrandDeal(null);
  };

  const updateBrandDeal = (id, field, value) => {
    if (field === 'paymentStatus') {
      updateBrandDealStatus(id, value);
      return;
    }
    setBrandDeals(prev =>
      prev.map(d => (d.id === id ? { ...d, [field]: field === 'amount' ? parseFloat(value || 0) : value } : d))
    );
    setEditingBrandDeal(null);
  };

  const deleteBrandDeal = (id) => {
    setBrandDeals(prev => {
      const deal = prev.find(d => d.id === id);
      if (deal?.linkedIncomeId) {
        setIncomeEntries(prevInc => prevInc.filter(i => i.id !== deal.linkedIncomeId));
      }
      return prev.filter(d => d.id !== id);
    });
  };

  // ===== Calendar helpers =====
  const ym = (d) => ({ y: d.getFullYear(), m: d.getMonth() }); // m: 0..11
  const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const firstWeekday = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay(); // 0=Sun
  const dateStr = (y, m, day) => `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

  const openDay = (y, m, day) => {
    const ds = dateStr(y, m, day);
    const dayIncome = incomeEntries.filter(e => e.date === ds);
    const dayExpenses = expenses.filter(e => e.date === ds);
    setDayModal({ open: true, dateStr: ds, income: dayIncome, expenses: dayExpenses });
  };

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-7 w-7 rounded-lg" style={{ background: "#4338CA" }} />
              <div>
                <h1 className="font-semibold tracking-tight text-xl md:text-2xl">Creator Reserve</h1>
                <p className="text-xs text-slate-500 -mt-1">Finally, budgeting built for micro-influencers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPdfModal(true)}
              className="bg-[#4338CA] hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
              <a href="/app/profile" className="ml-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50" aria-label="Profile">
                <User className="h-5 w-5 text-slate-700" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main app content (hidden in print) */}
      <div className="print:hidden">
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="flex border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3, User },
                { id: 'income', label: 'Income Sources', icon: TrendingUp },
                { id: 'expenses', label: 'Expenses & Deductibles', icon: DollarSign },
                { id: 'brands', label: 'Brand Pipeline', icon: Calendar },
                { id: 'calendar', label: 'Calendar View', icon: CalendarDays },
                { id: 'tax', label: 'Tax Planning', icon: Calculator }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ===== DASHBOARD ===== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                      <p className="text-slate-600 text-sm font-medium">Total Income</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">${totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                      <p className="text-slate-600 text-sm font-medium">Total Expenses</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">${totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                      <p className="text-slate-600 text-sm font-medium">Net Profit</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">${netProfit.toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                      <p className="text-slate-600 text-sm font-medium">Est. Tax Owed</p>
                      <p className="text-3xl font-bold text-slate-700">${estimatedTax.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Monthly goal progress */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">Monthly Goal Progress</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">Goal: $</span>
                        <input
                          type="number"
                          min="0"
                          value={monthlyGoal}
                          onChange={(e) => setMonthlyGoal(parseFloat(e.target.value) || 0)}
                          className="w-24 text-sm border border-slate-300 rounded-lg px-2 py-1 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-cyan-500 to-indigo-600" style={{ width: `${goalProgress}%` }}/>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-slate-700">
                      <span>${monthlyNet.toLocaleString()} of ${monthlyGoal.toLocaleString()} this month ({goalProgress}%)</span>
                      {goalSurplus > 0 && (
                        <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                          Surplus: +${goalSurplus.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">Recent Income</h4>
                      <div className="space-y-3">
                        {incomeEntries.slice(-5).reverse().map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-lg border border-cyan-100">
                            <div>
                              <p className="font-medium text-slate-800">{entry.source}</p>
                              <p className="text-sm text-slate-600">{entry.category} • {entry.platform || '—'} • {entry.date}</p>
                            </div>
                            <span className="font-bold text-cyan-600">${entry.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-4">Tax Deductibles Summary</h4>
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-4">
                        <h5 className="font-medium text-amber-800 mb-2">Total Deductible Expenses</h5>
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-2">${deductibleExpenses.toLocaleString()}</p>
                        <p className="text-sm text-amber-600">Could save ~${(deductibleExpenses * taxRate / 100).toFixed(0)} in taxes</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center">
                          <p className="text-xs text-yellow-700">In Progress</p>
                          <p className="text-xl font-bold text-yellow-600">
                            {brandDeals.filter(d => ['Outreach','Negotiation','Signed'].includes(d.stage)).length}
                          </p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center">
                          <p className="text-xs text-emerald-700">Pending Payment</p>
                          <p className="text-xl font-bold text-emerald-600">
                            ${brandDeals.filter(d => d.paymentStatus === 'Pending').reduce((s,d)=>s+d.amount,0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                          <p className="text-xs text-red-700">Overdue</p>
                          <p className="text-xl font-bold text-red-600">
                            {brandDeals.filter(d => d.paymentStatus === 'Overdue').length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== INCOME ===== */}
              {activeTab === 'income' && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">Income Sources</h3>

                  <div className="bg-slate-50 p-6 rounded-xl mb-6">
                    <h4 className="font-medium text-slate-800 mb-4">Add New Income</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="date" value={newIncome.date} onChange={(e) => setNewIncome({ ...newIncome, date: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <input type="text" placeholder="e.g., TikTok Shop Commission, Brand Deal Name" value={newIncome.source} onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <select value={newIncome.category} onChange={(e) => setNewIncome({ ...newIncome, category: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        <option value="Affiliate">Affiliate/TikTok Shop</option>
                        <option value="Sponsorship">Brand Sponsorship</option>
                        <option value="Trading">Trading Profits</option>
                        <option value="YouTube">YouTube Ad Revenue</option>
                        <option value="Other">Other</option>
                      </select>
                      <input type="text" placeholder="Platform (Instagram, TikTok, etc.)" value={newIncome.platform} onChange={(e) => setNewIncome({ ...newIncome, platform: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <input type="text" placeholder="Description" value={newIncome.description} onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <div className="flex gap-2">
                        <input type="number" placeholder="Amount ($)" value={newIncome.amount} onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 flex-1 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                        <button onClick={addIncome} className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200">
                          <PlusCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {incomeEntries.map(entry => (
                      <div key={entry.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-lg border border-cyan-100">
                        {editingIncome === entry.id ? (
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 mr-4">
                            <input type="text" defaultValue={entry.source} onBlur={(e) => updateIncome(entry.id, 'source', e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm" />
                            <input type="text" defaultValue={entry.platform} onBlur={(e) => updateIncome(entry.id, 'platform', e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm" />
                            <input type="text" defaultValue={entry.description} onBlur={(e) => updateIncome(entry.id, 'description', e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm" />
                            <input type="number" defaultValue={entry.amount} onBlur={(e) => updateIncome(entry.id, 'amount', e.target.value)} className="border border-slate-300 rounded px-2 py-1 text-sm" />
                          </div>
                        ) : (
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <span className="font-medium text-slate-800">{entry.source}</span>
                              <span className="text-sm bg-gradient-to-r from-cyan-200 to-cyan-300 text-cyan-800 px-2 py-1 rounded">{entry.category}</span>
                              <span className="text-sm text-slate-600">{entry.platform || '—'}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{entry.description}</p>
                            <p className="text-xs text-slate-500 mt-1">{entry.date}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-cyan-600 text-lg">${entry.amount.toLocaleString()}</span>
                          <button onClick={() => setEditingIncome(editingIncome === entry.id ? null : entry.id)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteIncome(entry.id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== EXPENSES ===== */}
              {activeTab === 'expenses' && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">Expenses & Tax Deductibles</h3>

                  <div className="bg-slate-50 p-6 rounded-xl mb-6">
                    <h4 className="font-medium text-slate-800 mb-4">Add New Expense</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        <option value="Equipment">Equipment</option>
                        <option value="Software">Software/Subscriptions</option>
                        <option value="Marketing">Marketing/Ads</option>
                        <option value="Office">Home Office</option>
                        <option value="Travel">Travel/Events</option>
                        <option value="Education">Courses/Education</option>
                        <option value="Other">Other</option>
                      </select>
                      <input type="text" placeholder="Description" value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <div className="flex gap-2">
                        <input type="number" placeholder="Amount ($)" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 flex-1 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={newExpense.taxDeductible} onChange={(e) => setNewExpense({...newExpense, taxDeductible: e.target.checked})} className="rounded" />
                          <span className="text-sm text-slate-700">Deductible</span>
                          <button onClick={() => setShowTaxInfo(true)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                        <button onClick={addExpense} className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200">
                          <PlusCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h4 className="font-medium text-amber-800 mb-2">Tax Deductible Summary</h4>
                    <p className="text-amber-700 mb-1">Total deductible expenses: <span className="font-bold">${deductibleExpenses.toLocaleString()}</span></p>
                    <p className="text-sm text-amber-600">This could save you approximately ${(deductibleExpenses * taxRate / 100).toFixed(0)} in taxes</p>
                  </div>

                  <div className="space-y-4">
                    {expenses.map(expense => (
                      <div key={expense.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-slate-800">{expense.description}</span>
                            <span className="text-sm bg-gradient-to-r from-amber-200 to-amber-300 text-amber-800 px-2 py-1 rounded">{expense.category}</span>
                            {expense.taxDeductible && (<span className="text-xs bg-gradient-to-r from-emerald-200 to-emerald-300 text-emerald-800 px-2 py-1 rounded">Tax Deductible</span>)}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{expense.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-600 text-lg">${expense.amount.toLocaleString()}</span>
                          <button onClick={() => deleteExpense(expense.id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== BRAND PIPELINE ===== */}
              {activeTab === 'brands' && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">Brand Deal Pipeline</h3>

                  <div className="bg-slate-50 p-6 rounded-xl mb-6">
                    <h4 className="font-medium text-slate-800 mb-4">Add New Brand Deal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Brand name" value={newBrandDeal.brand} onChange={(e) => setNewBrandDeal({...newBrandDeal, brand: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <input type="text" placeholder="Campaign name" value={newBrandDeal.campaign} onChange={(e) => setNewBrandDeal({...newBrandDeal, campaign: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <select value={newBrandDeal.stage} onChange={(e) => setNewBrandDeal({...newBrandDeal, stage: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        <option value="Outreach">Outreach</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Signed">Signed</option>
                        <option value="Content Due">Content Due</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <select value={newBrandDeal.paymentStatus} onChange={(e) => setNewBrandDeal({...newBrandDeal, paymentStatus: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        <option value="Pending">Pending</option>
                        <option value="Not Due">Not Due</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Paid">Paid</option>
                      </select>
                      <input type="date" value={newBrandDeal.dueDate} onChange={(e) => setNewBrandDeal({...newBrandDeal, dueDate: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <input type="number" placeholder="Deal value ($)" value={newBrandDeal.amount} onChange={(e) => setNewBrandDeal({...newBrandDeal, amount: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <input type="text" placeholder="Notes" value={newBrandDeal.notes} onChange={(e) => setNewBrandDeal({...newBrandDeal, notes: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 md:col-span-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                      <button onClick={addBrandDeal} className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 md:col-span-2">
                        <PlusCircle className="h-4 w-4" />
                        Add Brand Deal
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-2">In Progress</h5>
                      <p className="text-2xl font-bold text-yellow-600">{brandDeals.filter(deal => ['Outreach','Negotiation','Signed'].includes(deal.stage)).length}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                      <h5 className="font-medium text-emerald-800 mb-2">Pending Payment</h5>
                      <p className="text-2xl font-bold text-emerald-600">${brandDeals.filter(deal => deal.paymentStatus === 'Pending').reduce((sum, deal) => sum + deal.amount, 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">Overdue</h5>
                      <p className="text-2xl font-bold text-red-600">{brandDeals.filter(deal => deal.paymentStatus === 'Overdue').length}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {brandDeals.map(deal => (
                      <div key={deal.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                        {editingBrandDeal === deal.id ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" defaultValue={deal.brand} onBlur={(e) => updateBrandDeal(deal.id, 'brand', e.target.value)} className="border border-slate-300 rounded px-3 py-2" />
                            <input type="text" defaultValue={deal.campaign} onBlur={(e) => updateBrandDeal(deal.id, 'campaign', e.target.value)} className="border border-slate-300 rounded px-3 py-2" />
                            <select defaultValue={deal.stage} onChange={(e) => updateBrandDeal(deal.id, 'stage', e.target.value)} className="border border-slate-300 rounded px-3 py-2">
                              <option value="Outreach">Outreach</option>
                              <option value="Negotiation">Negotiation</option>
                              <option value="Signed">Signed</option>
                              <option value="Content Due">Content Due</option>
                              <option value="Completed">Completed</option>
                            </select>
                            <select defaultValue={deal.paymentStatus} onChange={(e) => updateBrandDealStatus(deal.id, e.target.value)} className="border border-slate-300 rounded px-3 py-2">
                              <option value="Pending">Pending</option>
                              <option value="Not Due">Not Due</option>
                              <option value="Overdue">Overdue</option>
                              <option value="Paid">Paid</option>
                            </select>
                            <input type="number" defaultValue={deal.amount} onBlur={(e) => updateBrandDeal(deal.id, 'amount', e.target.value)} className="border border-slate-300 rounded px-3 py-2" />
                            <input type="date" defaultValue={deal.dueDate} onChange={(e) => updateBrandDeal(deal.id, 'dueDate', e.target.value)} className="border border-slate-300 rounded px-3 py-2" />
                            <input type="text" defaultValue={deal.notes} onBlur={(e) => updateBrandDeal(deal.id, 'notes', e.target.value)} className="border border-slate-300 rounded px-3 py-2 md:col-span-3" />
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h5 className="font-semibold text-lg text-slate-800">{deal.brand}</h5>
                                <span className="text-sm bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 px-3 py-1 rounded-full">{deal.campaign}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  deal.stage === 'Completed' ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800' :
                                  deal.stage === 'Signed' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800' :
                                  'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                                }`}>{deal.stage}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  deal.paymentStatus === 'Paid' ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800' :
                                  deal.paymentStatus === 'Overdue' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' :
                                  deal.paymentStatus === 'Pending' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                                  'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800'
                                }`}>{deal.paymentStatus}</span>
                              </div>
                              <div className="text-sm text-slate-600 space-y-1">
                                <p><strong>Due:</strong> {deal.dueDate || 'TBD'}</p>
                                {deal.notes && <p><strong>Notes:</strong> {deal.notes}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">${deal.amount.toLocaleString()}</span>
                              <button onClick={() => setEditingBrandDeal(editingBrandDeal === deal.id ? null : deal.id)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteBrandDeal(deal.id)} className="text-red-500 hover:text-red-700 transition-colors">
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

              {/* ===== CALENDAR (per-day totals + modal) ===== */}
              {activeTab === 'calendar' && (() => {
                const { y, m } = ym(calDate);
                const dim = daysInMonth(calDate);
                const start = firstWeekday(calDate);
                const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

                const cells = [];
                for (let i = 0; i < start; i++) {
                  cells.push(<div key={`blank-${i}`} className="h-24 border border-slate-200 bg-slate-50" />);
                }
                for (let d = 1; d <= dim; d++) {
                  const ds = dateStr(y, m, d);
                  const dayIncome = incomeEntries.filter(e => e.date === ds);
                  const dayExpenses = expenses.filter(e => e.date === ds);
                  const incTotal = dayIncome.reduce((s,e)=>s+e.amount,0);
                  const expTotal = dayExpenses.reduce((s,e)=>s+e.amount,0);
                  const has = incTotal>0 || expTotal>0;

                  cells.push(
                    <div key={ds} onClick={() => openDay(y, m, d)}
                         className="h-24 border border-slate-200 p-2 bg-white hover:bg-gradient-to-br hover:from-cyan-50 hover:to-indigo-50 transition-all duration-150 cursor-pointer">
                      <div className="text-sm font-medium text-slate-700">{d}</div>
                      {has && (
                        <div className="mt-1 space-y-1">
                          {incTotal>0 && <div className="text-xs bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 rounded px-1 py-0.5">+${incTotal}</div>}
                          {expTotal>0 && <div className="text-xs bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded px-1 py-0.5">-${expTotal}</div>}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-6">Calendar View</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-slate-800 font-semibold">
                        {calDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setCalDate(new Date(y, m-1, 1))} className="px-3 py-1 text-sm bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">Previous</button>
                        <button onClick={() => setCalDate(new Date(y, m+1, 1))} className="px-3 py-1 text-sm bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors">Next</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-0 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                      {weekdays.map(w => (
                        <div key={w} className="bg-gradient-to-r from-slate-100 to-slate-50 p-2 text-center text-sm font-medium text-slate-700 border-r border-slate-200 last:border-r-0">{w}</div>
                      ))}
                      {cells}
                    </div>

                    <div className="flex gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-cyan-100 to-cyan-200 rounded" />
                        <span>Income</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-amber-100 to-amber-200 rounded" />
                        <span>Expenses</span>
                      </div>
                      <p className="text-slate-500 italic">Click any day to see details</p>
                    </div>
                  </div>
                );
              })()}

              {/* ===== TAX PLANNING ===== */}
              {activeTab === 'tax' && (
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">Tax Planning & Estimates</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl">
                      <h4 className="font-medium text-indigo-800 mb-4">Tax Calculator</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Tax Rate (%)</label>
                          <input
                            type="number"
                            value={taxRate}
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            min="0"
                            max="50"
                          />
                        </div>
                        <div className="pt-4 border-t border-indigo-200 space-y-2">
                          <p className="text-slate-700"><strong>Taxable Income:</strong> ${netProfit.toLocaleString()}</p>
                          <p className="text-slate-700"><strong>Deductible Expenses:</strong> ${deductibleExpenses.toLocaleString()}</p>
                          <p className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                            <strong>Estimated Tax:</strong> ${estimatedTax.toFixed(0)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
                      <h4 className="font-medium text-purple-800 mb-4">Quarterly Tax Planning</h4>
                      <div className="space-y-3">
                        {['Q1 (Due: Apr 15)', 'Q2 (Due: Jun 15)', 'Q3 (Due: Sep 15)', 'Q4 (Due: Jan 15)'].map((quarter, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-slate-700">{quarter}</span>
                            <span className="font-medium text-slate-800">${(estimatedTax / 4).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-purple-600 mt-4 p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
                        💡 Tip: Set aside ${(estimatedTax / 12).toFixed(0)}/month for taxes
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 border border-cyan-200 p-6 rounded-xl mt-6">
                    <h4 className="font-medium text-cyan-800 mb-3">Income Smoothing Strategy</h4>
                    <p className="text-sm text-cyan-700 mb-4">
                      Based on your ${totalIncome.toLocaleString()} income, consider setting aside ${(totalIncome * 0.3).toFixed(0)} (30%)
                      for taxes and ${(totalIncome * 0.2).toFixed(0)} (20%) for irregular months.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white/50 p-3 rounded">
                        <p className="text-xs text-cyan-600 uppercase tracking-wide">Tax Reserve</p>
                        <p className="font-bold text-cyan-800">${(totalIncome * 0.3).toFixed(0)}</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded">
                        <p className="text-xs text-cyan-600 uppercase tracking-wide">Buffer Fund</p>
                        <p className="font-bold text-cyan-800">${(totalIncome * 0.2).toFixed(0)}</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded">
                        <p className="text-xs text-cyan-600 uppercase tracking-wide">After-Tax Take-Home</p>
                        <p className="font-bold text-cyan-800">${(totalIncome - estimatedTax).toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deductible info modal */}
      {showTaxInfo && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button onClick={()=>setShowTaxInfo(false)} className="absolute top-3 right-3 text-slate-500 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-semibold text-slate-800 mb-2">Tax Deductible?</h4>
            <p className="text-sm text-slate-600">
              A deductible expense is an ordinary and necessary cost of running your creator business (equipment, software, marketing, a portion of home office, travel for shoots, education, etc.). Keep receipts and categorize clearly.
            </p>
          </div>
        </div>
      )}

      {/* Day details modal */}
      {dayModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button onClick={()=>setDayModal(m=>({ ...m, open:false }))} className="absolute top-3 right-3 text-slate-500 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Details for {dayModal.dateStr}</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-slate-800 mb-2">Income</h5>
                <div className="space-y-2">
                  {dayModal.income.length === 0 && (<p className="text-sm text-slate-500">No income</p>)}
                  {dayModal.income.map(i => (
                    <div key={i.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-indigo-50 rounded border border-cyan-100">
                      <div>
                        <p className="font-medium text-slate-800">{i.source}</p>
                        <p className="text-xs text-slate-600">{i.category} • {i.platform || '—'}</p>
                      </div>
                      <span className="font-bold text-cyan-700">+${i.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-800 mb-2">Expenses</h5>
                <div className="space-y-2">
                  {dayModal.expenses.length === 0 && (<p className="text-sm text-slate-500">No expenses</p>)}
                  {dayModal.expenses.map(e => (
                    <div key={e.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded border border-amber-100">
                      <div>
                        <p className="font-medium text-slate-800">{e.description}</p>
                        <p className="text-xs text-slate-600">{e.category}</p>
                      </div>
                      <span className="font-bold text-amber-700">-${e.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-6 text-sm text-slate-700">
              <span><strong>Total Income:</strong> ${dayModal.income.reduce((s,i)=>s+i.amount,0).toLocaleString()}</span>
              <span><strong>Total Expenses:</strong> ${dayModal.expenses.reduce((s,e)=>s+e.amount,0).toLocaleString()}</span>
              <span><strong>Net:</strong> {(dayModal.income.reduce((s,i)=>s+i.amount,0)-dayModal.expenses.reduce((s,e)=>s+e.amount,0)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={()=>setShowPdfModal(false)} className="absolute top-3 right-3 text-slate-500 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Export PDF</h4>
            <p className="text-sm text-slate-600 mb-3">Choose which sections to include:</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                ['dashboard','Dashboard'],
                ['income','Income'],
                ['expenses','Expenses'],
                ['brands','Brand Pipeline'],
                ['calendar','Calendar'],
                ['tax','Tax Planning'],
              ].map(([key,label]) => (
                <label key={key} className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={pdfSections[key]}
                    onChange={(e)=>setPdfSections(ps=>({ ...ps, [key]: e.target.checked }))}
                    className="rounded"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={()=>setShowPdfModal(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
              <button
                onClick={()=>{
                  setPrintSelections(pdfSections);
                  setShowPdfModal(false);
                  // give React a tick to render print view
                  setTimeout(()=>window.print(), 200);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-700 hover:to-cyan-700"
              >
                Generate PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY VIEW */}
      <div className="hidden print:block p-8">
        <h1 className="text-2xl font-bold">Creator Flow Report</h1>
        <p className="text-sm text-slate-600 mb-6">Generated: {new Date().toLocaleString()}</p>

        {/* DASHBOARD (print) */}
        {printSelections?.dashboard && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Total Income:</strong> ${totalIncome.toLocaleString()}</div>
              <div><strong>Total Expenses:</strong> ${totalExpenses.toLocaleString()}</div>
              <div><strong>Net Profit:</strong> ${netProfit.toLocaleString()}</div>
              <div><strong>Est. Tax Owed:</strong> ${estimatedTax.toFixed(0)}</div>
            </div>
            <p className="mt-2 text-sm">
              <strong>Monthly Goal:</strong> ${monthlyGoal.toLocaleString()} •
              <strong> Progress:</strong> ${monthlyNet.toLocaleString()} ({Math.round(goalProgress)}%)
              {goalSurplus>0 && <> • <strong>Surplus:</strong> +${goalSurplus.toLocaleString()}</>}
            </p>
          </section>
        )}

        {/* INCOME (print) */}
        {printSelections?.income && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Income</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">Date</th>
                  <th className="border px-2 py-1 text-left">Source</th>
                  <th className="border px-2 py-1 text-left">Category</th>
                  <th className="border px-2 py-1 text-left">Platform</th>
                  <th className="border px-2 py-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {incomeEntries.map(e=>(
                  <tr key={e.id}>
                    <td className="border px-2 py-1">{e.date}</td>
                    <td className="border px-2 py-1">{e.source}</td>
                    <td className="border px-2 py-1">{e.category}</td>
                    <td className="border px-2 py-1">{e.platform || '—'}</td>
                    <td className="border px-2 py-1 text-right">${e.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* EXPENSES (print) */}
        {printSelections?.expenses && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Expenses</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">Date</th>
                  <th className="border px-2 py-1 text-left">Category</th>
                  <th className="border px-2 py-1 text-left">Description</th>
                  <th className="border px-2 py-1 text-right">Amount</th>
                  <th className="border px-2 py-1 text-left">Deductible</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e=>(
                  <tr key={e.id}>
                    <td className="border px-2 py-1">{e.date}</td>
                    <td className="border px-2 py-1">{e.category}</td>
                    <td className="border px-2 py-1">{e.description}</td>
                    <td className="border px-2 py-1 text-right">${e.amount.toLocaleString()}</td>
                    <td className="border px-2 py-1">{e.taxDeductible ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* BRAND PIPELINE (print) */}
        {printSelections?.brands && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Brand Pipeline</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">Brand</th>
                  <th className="border px-2 py-1 text-left">Campaign</th>
                  <th className="border px-2 py-1 text-left">Stage</th>
                  <th className="border px-2 py-1 text-left">Payment</th>
                  <th className="border px-2 py-1 text-left">Due Date</th>
                  <th className="border px-2 py-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {brandDeals.map(d=>(
                  <tr key={d.id}>
                    <td className="border px-2 py-1">{d.brand}</td>
                    <td className="border px-2 py-1">{d.campaign}</td>
                    <td className="border px-2 py-1">{d.stage}</td>
                    <td className="border px-2 py-1">{d.paymentStatus}</td>
                    <td className="border px-2 py-1">{d.dueDate || '—'}</td>
                    <td className="border px-2 py-1 text-right">${d.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* CALENDAR SUMMARY (print) */}
        {printSelections?.calendar && (() => {
          const { y, m } = ym(calDate);
          const dim = daysInMonth(calDate);
          const rows = [];
          for (let d = 1; d <= dim; d++) {
            const ds = dateStr(y, m, d);
            const inc = incomeEntries.filter(e=>e.date===ds).reduce((s,e)=>s+e.amount,0);
            const exp = expenses.filter(e=>e.date===ds).reduce((s,e)=>s+e.amount,0);
            if (inc>0 || exp>0) {
              rows.push({ ds, inc, exp, net: inc-exp });
            }
          }
          if (rows.length === 0) return null;
          return (
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Calendar (Activity in {calDate.toLocaleString(undefined,{month:'long',year:'numeric'})})</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 text-left">Date</th>
                    <th className="border px-2 py-1 text-right">Income</th>
                    <th className="border px-2 py-1 text-right">Expenses</th>
                    <th className="border px-2 py-1 text-right">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r=>(
                    <tr key={r.ds}>
                      <td className="border px-2 py-1">{r.ds}</td>
                      <td className="border px-2 py-1 text-right">${r.inc.toLocaleString()}</td>
                      <td className="border px-2 py-1 text-right">${r.exp.toLocaleString()}</td>
                      <td className="border px-2 py-1 text-right">${r.net.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })()}

        {/* TAX (print) */}
        {printSelections?.tax && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Tax Planning</h2>
            <p className="text-sm"><strong>Tax Rate:</strong> {taxRate}%</p>
            <p className="text-sm"><strong>Estimated Tax:</strong> ${estimatedTax.toFixed(0)}</p>
            <p className="text-sm"><strong>Quarterly (approx):</strong> ${(estimatedTax/4).toFixed(0)} each</p>
            <p className="text-sm"><strong>Monthly set-aside suggestion:</strong> ${(estimatedTax/12).toFixed(0)}</p>
          </section>
        )}
      </div>
    </div>
  );
}
