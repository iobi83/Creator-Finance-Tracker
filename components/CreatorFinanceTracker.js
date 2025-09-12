import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Calculator, PlusCircle, Trash2, CalendarDays, Edit3, Save, X, Info, FileDown, LayoutDashboard } from 'lucide-react';

const CreatorFinanceTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incomeEntries, setIncomeEntries] = useState([
    { id: 1, date: '2025-09-15', source: 'TikTok Shop', platform: 'TikTok', description: 'Commission from skincare promo', amount: 450, category: 'Affiliate' },
    { id: 2, date: '2025-09-20', source: 'Brand Deal', platform: 'Instagram', description: 'Fitness brand partnership', amount: 800, category: 'Sponsorship' },
    { id: 3, date: '2025-09-05', source: 'Trading', platform: 'Other', description: 'Stock market gains', amount: 230, category: 'Trading' }
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2025-09-10', category: 'Equipment', description: 'Ring light for content', amount: 120, taxDeductible: true },
    { id: 2, date: '2025-09-12', category: 'Software', description: 'Canva Pro subscription', amount: 15, taxDeductible: true },
    { id: 3, date: '2025-09-08', category: 'Marketing', description: 'Instagram ads', amount: 85, taxDeductible: true }
  ]);
  const [brandDeals, setBrandDeals] = useState([
    { id: 1, brand: 'FitTech Co', campaign: 'Summer Wellness', stage: 'Negotiation', dueDate: '2025-10-15', paymentStatus: 'Pending', amount: 1200, notes: 'Need to submit content draft' },
    { id: 2, brand: 'StyleBox', campaign: 'Fall Fashion', stage: 'Signed', dueDate: '2025-10-30', paymentStatus: 'Not Due', amount: 800, notes: 'Contract signed, content due Oct 30' }
  ]);
  const [taxRate, setTaxRate] = useState(25);
  const [monthlyBufferGoal, setMonthlyBufferGoal] = useState(2000);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1));

  const [newIncome, setNewIncome] = useState({ date: '', source: 'TikTok Shop', platform: '', description: '', amount: '', category: 'Affiliate' });
  const [newExpense, setNewExpense] = useState({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
  const [newBrandDeal, setNewBrandDeal] = useState({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });
  
  // UI State
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showTaxInfo, setShowTaxInfo] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [pdfSections, setPdfSections] = useState({
    dashboard: true,
    income: true,
    expenses: true,
    brands: true,
    calendar: false
  });

  // Calculate current month data
  const getCurrentMonthData = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyIncome = incomeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    }).reduce((sum, entry) => sum + entry.amount, 0);
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    }).reduce((sum, expense) => sum + expense.amount, 0);
    
    return { monthlyIncome, monthlyExpenses };
  };

  const { monthlyIncome, monthlyExpenses } = getCurrentMonthData();
  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const deductibleExpenses = expenses.filter(e => e.taxDeductible).reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const monthlyNetProfit = monthlyIncome - monthlyExpenses;
  const estimatedTax = (netProfit * taxRate) / 100;
  
  // Monthly buffer progress
  const bufferProgress = monthlyBufferGoal > 0 ? (monthlyNetProfit / monthlyBufferGoal) * 100 : 0;
  const bufferSurplus = monthlyNetProfit > monthlyBufferGoal ? monthlyNetProfit - monthlyBufferGoal : 0;

  // Income source options
  const incomeSourceOptions = [
    'TikTok Shop',
    'Brand Deal', 
    'Trading',
    'YouTube AdSense',
    'Affiliate (Amazon/LTK)',
    'Sponsored Post',
    'UGC Creation',
    'Course Sales',
    'Coaching/Consulting',
    'Other'
  ];

  const addIncome = () => {
    const date = newIncome.date?.trim();
    const source = newIncome.source?.trim();
    const amount = newIncome.amount?.trim();
    
    if (!date || !source || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all required fields: Date, Source, and Amount (must be greater than 0)');
      return;
    }
    
    setIncomeEntries([...incomeEntries, { 
      ...newIncome, 
      id: Date.now(), 
      amount: parseFloat(amount) 
    }]);
    setNewIncome({ date: '', source: 'TikTok Shop', platform: '', description: '', amount: '', category: 'Affiliate' });
  };

  const addExpense = () => {
    const date = newExpense.date?.trim();
    const description = newExpense.description?.trim();
    const amount = newExpense.amount?.trim();
    
    if (!date || !description || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all required fields: Date, Description, and Amount (must be greater than 0)');
      return;
    }
    
    setExpenses([...expenses, { 
      ...newExpense, 
      id: Date.now(), 
      amount: parseFloat(amount) 
    }]);
    setNewExpense({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
  };

  const addBrandDeal = () => {
    const brand = newBrandDeal.brand?.trim();
    const campaign = newBrandDeal.campaign?.trim();
    const amount = newBrandDeal.amount?.trim();
    
    if (!brand || !campaign || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all required fields: Brand, Campaign, and Amount (must be greater than 0)');
      return;
    }
    
    setBrandDeals([...brandDeals, { 
      ...newBrandDeal, 
      id: Date.now(), 
      amount: parseFloat(amount) 
    }]);
    setNewBrandDeal({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });
  };

  const deleteIncome = (id) => {
    setIncomeEntries(incomeEntries.filter(entry => entry.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const deleteBrandDeal = (id) => {
    setBrandDeals(brandDeals.filter(deal => deal.id !== id));
  };

  const updateBrandDealStage = (id, newStage) => {
    setBrandDeals(brandDeals.map(deal => 
      deal.id === id ? { ...deal, stage: newStage } : deal
    ));
  };

  const updateBrandDealPayment = (id, newPaymentStatus) => {
    const deal = brandDeals.find(d => d.id === id);
    if (!deal) return;

    // If marking as paid, add to income
    if (newPaymentStatus === 'Paid' && deal.paymentStatus !== 'Paid') {
      const incomeEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0], // Today's date
        source: 'Brand Deal',
        platform: 'Brand Partnership',
        description: `${deal.brand} - ${deal.campaign}`,
        amount: deal.amount,
        category: 'Sponsorship'
      };
      
      setIncomeEntries(prev => [...prev, incomeEntry]);
    }
    
    // If changing from paid to something else, remove from income
    if (deal.paymentStatus === 'Paid' && newPaymentStatus !== 'Paid') {
      setIncomeEntries(prev => 
        prev.filter(income => 
          !(income.source === 'Brand Deal' && 
            income.description === `${deal.brand} - ${deal.campaign}` && 
            income.amount === deal.amount)
        )
      );
    }

    setBrandDeals(brandDeals.map(deal => 
      deal.id === id ? { ...deal, paymentStatus: newPaymentStatus } : deal
    ));
  };

  // Edit functions
  const startEdit = (type, item) => {
    if (type === 'income') {
      setEditingIncomeId(item.id);
      setEditData({...item, amount: item.amount.toString()});
    } else if (type === 'expense') {
      setEditingExpenseId(item.id);
      setEditData({...item, amount: item.amount.toString()});
    } else if (type === 'brand') {
      setEditingBrandId(item.id);
      setEditData({...item, amount: item.amount.toString()});
    }
  };

  const saveEdit = (type) => {
    if (type === 'income') {
      setIncomeEntries(incomeEntries.map(item => 
        item.id === editingIncomeId ? {...editData, amount: parseFloat(editData.amount)} : item
      ));
      setEditingIncomeId(null);
    } else if (type === 'expense') {
      setExpenses(expenses.map(item => 
        item.id === editingExpenseId ? {...editData, amount: parseFloat(editData.amount)} : item
      ));
      setEditingExpenseId(null);
    } else if (type === 'brand') {
      const oldDeal = brandDeals.find(deal => deal.id === editingBrandId);
      const updatedDeal = {...editData, amount: parseFloat(editData.amount)};
      
      // Check if payment status changed
      if (oldDeal && oldDeal.paymentStatus !== updatedDeal.paymentStatus) {
        // Handle payment status change with income integration
        updateBrandDealPayment(editingBrandId, updatedDeal.paymentStatus);
        
        // Update other fields
        setBrandDeals(brandDeals.map(item => 
          item.id === editingBrandId ? updatedDeal : item
        ));
      } else {
        // No payment status change, just update normally
        setBrandDeals(brandDeals.map(item => 
          item.id === editingBrandId ? updatedDeal : item
        ));
      }
      setEditingBrandId(null);
    }
    setEditData({});
  };

  const cancelEdit = () => {
    setEditingIncomeId(null);
    setEditingExpenseId(null);
    setEditingBrandId(null);
    setEditData({});
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDateEntries = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayIncome = incomeEntries.filter(entry => entry.date === dateStr);
    const dayExpenses = expenses.filter(expense => expense.date === dateStr);
    return { dateStr, dayIncome, dayExpenses };
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 border border-gray-200 bg-gray-50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const { dateStr, dayIncome, dayExpenses } = getDateEntries(day);
      const totalDayIncome = dayIncome.reduce((sum, entry) => sum + entry.amount, 0);
      const totalDayExpenses = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const hasActivity = dayIncome.length > 0 || dayExpenses.length > 0;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDay(dateStr)}
          className={`h-20 border border-gray-200 p-1 bg-white hover:bg-gray-50 transition-colors text-left ${hasActivity ? 'ring-2 ring-cyan-200' : ''}`}
        >
          <div className="text-sm font-medium text-gray-700 mb-1">{day}</div>
          {hasActivity && (
            <div className="space-y-1">
              {totalDayIncome > 0 && (
                <div className="text-xs bg-cyan-100 text-cyan-800 rounded px-1 py-0.5">
                  +${totalDayIncome}
                </div>
              )}
              {totalDayExpenses > 0 && (
                <div className="text-xs bg-amber-100 text-amber-800 rounded px-1 py-0.5">
                  -${totalDayExpenses}
                </div>
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-100 p-2 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
          {days}
        </div>

        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-100 rounded"></div>
            <span>Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 rounded"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>
    );
  };

  // PDF Export Functions
  const generatePdfHtml = (sections) => {
    const style = `body{font-family: system-ui, sans-serif; padding:24px; color:#111} h1{margin:0 0 8px;} h2{margin:24px 0 8px;} .meta{margin:8px 0 16px;color:#444} table{width:100%; border-collapse:collapse; margin:12px 0;} th,td{border:1px solid #ddd; padding:8px; font-size:12px;} th{background:#f5f5f5;}`;
    const header = `<h1 style="display:flex;align-items:center;gap:8px"><span style="width:18px;height:18px;border-radius:4px;background:#4338CA;display:inline-block"></span> CreatorFlow — Financial Summary</h1>`;
    const meta = `<div class='meta'><strong>Total Income:</strong> $${totalIncome.toFixed(2)} | <strong>Total Expenses:</strong> $${totalExpenses.toFixed(2)} | <strong>Net Profit:</strong> $${netProfit.toFixed(2)} | <strong>Est. Tax:</strong> $${estimatedTax.toFixed(2)}</div>`;

    const incomeRows = incomeEntries.map(e => `<tr><td>${e.date}</td><td>${e.source}</td><td>${e.platform || ''}</td><td>${e.description || ''}</td><td>$${e.amount.toFixed(2)}</td></tr>`).join('');
    const expenseRows = expenses.map(e => `<tr><td>${e.date}</td><td>${e.category}</td><td>${e.description || ''}</td><td>${e.taxDeductible ? 'Yes' : 'No'}</td><td>$${e.amount.toFixed(2)}</td></tr>`).join('');
    const dealRows = brandDeals.map(d => `<tr><td>${d.brand}</td><td>${d.campaign}</td><td>${d.stage}</td><td>${d.paymentStatus}</td><td>${d.dueDate || ''}</td><td>$${d.amount.toFixed(2)}</td></tr>`).join('');

    let body = header + meta;
    if (sections.dashboard) {
      body += `<h2>Dashboard Snapshot</h2><p>Monthly Net Profit: $${monthlyNetProfit.toFixed(2)} | Buffer Goal: $${monthlyBufferGoal.toFixed(2)}</p>`;
    }
    if (sections.income) {
      body += `<h2>Income</h2><table><thead><tr><th>Date</th><th>Source</th><th>Platform</th><th>Description</th><th>Amount</th></tr></thead><tbody>${incomeRows}</tbody></table>`;
    }
    if (sections.expenses) {
      body += `<h2>Expenses</h2><table><thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Tax Deductible</th><th>Amount</th></tr></thead><tbody>${expenseRows}</tbody></table>`;
    }
    if (sections.brands) {
      body += `<h2>Brand Deals</h2><table><thead><tr><th>Brand</th><th>Campaign</th><th>Stage</th><th>Payment</th><th>Due</th><th>Amount</th></tr></thead><tbody>${dealRows}</tbody></table>`;
    }
    if (sections.calendar) {
      body += `<h2>Calendar Activity</h2><p>Days with activity are highlighted in the app. Consider exporting CSV for full per-day logs.</p>`;
    }
    body += `<p style='margin-top:16px;font-size:11px;color:#666'>Note: This export is for record-keeping only and is not tax advice. Consult a qualified tax professional.</p>`;
    return `<!DOCTYPE html><html><head><meta charset='utf-8'><title>CreatorFlow Export</title><style>${style}</style></head><body>${body}</body></html>`;
  };

  const exportPdf = () => {
    const html = generatePdfHtml(pdfSections);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      setTimeout(() => {
        newWindow.print();
        URL.revokeObjectURL(url);
      }, 500);
    }
    setShowPdfOptions(false);
  };

  // Sine Wave Logo Component
  const SineWaveLogo = ({ size = 40 }) => (
    <div className="relative" style={{ width: size, height: size }}>
      <div 
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500"
        style={{ 
          background: 'linear-gradient(135deg, #4338CA 0%, #06B6D4 100%)'
        }}
      />
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        className="absolute inset-0"
      >
        <path
          d="M8 20 Q 14 12, 20 20 T 32 20"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M8 20 Q 14 28, 20 20 T 32 20"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );

  // Enhanced expense calculations
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const taxSavings = deductibleExpenses * (taxRate / 100);
  const effectiveCost = totalExpenses - taxSavings;

  // Brand deal analytics
  const signedDeals = brandDeals.filter(deal => deal.stage === 'Signed' || deal.stage === 'Completed');
  const averageDealValue = brandDeals.length > 0 ? brandDeals.reduce((sum, deal) => sum + deal.amount, 0) / brandDeals.length : 0;
  const totalPipelineValue = brandDeals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div 
      className="max-w-6xl mx-auto p-6 min-h-screen"
      style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(67, 56, 202, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.03) 0%, transparent 50%),
          linear-gradient(135deg, 
            rgba(67, 56, 202, 0.02) 0%, 
            rgba(6, 182, 212, 0.02) 50%, 
            rgba(217, 119, 6, 0.02) 100%
          ),
          #fafbff
        `
      }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SineWaveLogo size={40} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">CreatorFlow</h1>
              <p className="text-gray-600 text-lg">Finally, budgeting that works for micro-influencers</p>
            </div>
          </div>
          <button
            onClick={() => setShowPdfOptions(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Income</p>
              <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-cyan-500" />
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
            <Calculator className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Est. Tax Owed</p>
              <p className="text-2xl font-bold">${estimatedTax.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Monthly Buffer Progress */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Monthly Buffer Progress</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Goal: $</span>
            <input
              type="number"
              value={monthlyBufferGoal}
              onChange={(e) => setMonthlyBufferGoal(parseFloat(e.target.value) || 0)}
              className="w-20 text-sm border rounded px-2 py-1"
              min="0"
            />
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="h-4 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.min(bufferProgress, 100)}%`,
              background: 'linear-gradient(90deg, #06B6D4 0%, #0891B2 50%, #0E7490 100%)'
            }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-600">
            ${monthlyNetProfit.toLocaleString()} of ${monthlyBufferGoal.toLocaleString()} this month ({Math.round(bufferProgress)}%)
          </p>
          {bufferSurplus > 0 && (
            <p className="text-sm text-indigo-600 font-medium">
              Surplus: +${bufferSurplus.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex flex-wrap border-b">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'income', label: 'Income Tracker', icon: TrendingUp },
            { id: 'expenses', label: 'Expenses & Deductibles', icon: DollarSign },
            { id: 'brands', label: 'Brand Pipeline', icon: Calendar },
            { id: 'calendar', label: 'Calendar View', icon: CalendarDays },
            { id: 'tax', label: 'Tax Planning', icon: Calculator }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 md:px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
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
                    {incomeEntries.slice(-5).reverse().map(entry => (
                      <tr key={entry.id} className="border-t">
                        <td className="py-1">{entry.date}</td>
                        <td>{entry.source}</td>
                        <td className="font-medium text-cyan-600">
                          ${entry.amount.toLocaleString()}
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
                    {expenses.slice(-5).reverse().map(expense => (
                      <tr key={expense.id} className="border-t">
                        <td className="py-1">{expense.date}</td>
                        <td>{expense.category}</td>
                        <td className="font-medium text-red-700">${expense.amount.toLocaleString()}</td>
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
                      {brandDeals.filter(deal => ['Outreach', 'Negotiation', 'Signed'].includes(deal.stage)).length}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <p className="text-green-800">Pending Payment</p>
                    <p className="text-2xl font-bold text-green-700">
                      ${brandDeals.filter(deal => deal.paymentStatus === 'Pending').reduce((sum, deal) => sum + deal.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 rounded">
                    <p className="text-red-800">Overdue</p>
                    <p className="text-2xl font-bold text-red-700">
                      {brandDeals.filter(deal => deal.paymentStatus === 'Overdue').length}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded">
                    <p className="text-blue-800">Completed</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {brandDeals.filter(deal => deal.stage === 'Completed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 lg:col-span-2">
                <h4 className="font-semibold mb-3 text-blue-800">Income Smoothing Strategy</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600">Set aside for taxes</p>
                    <p className="text-xl font-bold text-blue-800">${(totalIncome * 0.3).toFixed(0)}</p>
                    <p className="text-xs text-blue-600">30% of income</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Monthly buffer fund</p>
                    <p className="text-xl font-bold text-blue-800">${(totalIncome * 0.2 / 12).toFixed(0)}</p>
                    <p className="text-xs text-blue-600">20% for irregular months</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Available for spending</p>
                    <p className="text-xl font-bold text-blue-800">${(totalIncome * 0.5).toFixed(0)}</p>
                    <p className="text-xs text-blue-600">After taxes & buffer</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Calendar View</h3>
              {renderCalendar()}
            </div>
          )}

          {activeTab === 'income' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Income Sources</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Add New Income</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    {incomeSourceOptions.map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                  <select
                    value={newIncome.category}
                    onChange={(e) => setNewIncome({...newIncome, category: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="Affiliate">Affiliate/TikTok Shop</option>
                    <option value="Sponsorship">Brand Sponsorship</option>
                    <option value="Trading">Trading Profits</option>
                    <option value="YouTube">YouTube Ad Revenue</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Platform (Instagram, TikTok, etc.)"
                    value={newIncome.platform}
                    onChange={(e) => setNewIncome({...newIncome, platform: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g., Commission for skincare promo)"
                    value={newIncome.description}
                    onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newIncome.amount}
                      onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                      className="border rounded px-3 py-2 flex-1"
                    />
                    <button
                      onClick={addIncome}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Income Source covers items like TikTok Shop, Brand Deal, Trading, AdSense, Affiliate networks, etc.
                </p>
              </div>

              <div className="space-y-3">
                {incomeEntries.map(entry => (
                  <div key={entry.id} className="p-3 bg-green-50 rounded-lg">
                    {editingIncomeId === entry.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                        <input
                          type="date"
                          value={editData.date || ''}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                          className="border rounded px-2 py-1"
                        />
                        <select
                          value={editData.source || ''}
                          onChange={(e) => setEditData({...editData, source: e.target.value})}
                          className="border rounded px-2 py-1"
                        >
                          {incomeSourceOptions.map(source => (
                            <option key={source} value={source}>{source}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={editData.platform || ''}
                          onChange={(e) => setEditData({...editData, platform: e.target.value})}
                          placeholder="Platform"
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={editData.description || ''}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          placeholder="Description"
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="number"
                          value={editData.amount || ''}
                          onChange={(e) => setEditData({...editData, amount: e.target.value})}
                          placeholder="Amount"
                          className="border rounded px-2 py-1"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit('income')}
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 flex items-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">{entry.source}</span>
                            <span className="text-sm bg-cyan-100 text-cyan-800 px-2 py-1 rounded">{entry.category}</span>
                            <span className="text-sm text-gray-600">{entry.platform}</span>
                          </div>
                          <p className="text-sm text-gray-600">{entry.description}</p>
                          <p className="text-xs text-gray-500">{entry.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-cyan-600">${entry.amount}</span>
                          <button
                            onClick={() => startEdit('income', entry)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteIncome(entry.id)}
                            className="text-red-500 hover:text-red-700"
                          >
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

          {activeTab === 'expenses' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Expenses & Tax Deductibles</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4 relative">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  Add New Expense
                  <button
                    onClick={() => setShowTaxInfo(!showTaxInfo)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </h4>
                
                {showTaxInfo && (
                  <div className="absolute right-4 top-12 bg-white border rounded-md shadow-lg p-3 text-xs max-w-sm z-10">
                    <p className="font-semibold mb-1">Expenses that may be deductible:</p>
                    <ul className="list-disc pl-4 space-y-1 text-gray-700">
                      <li>Equipment & supplies for content (cameras, lights, mics)</li>
                      <li>Software & subscriptions (editing tools, Canva, schedulers)</li>
                      <li>Marketing & ads (sponsored posts, ad spend)</li>
                      <li>Home office portion (internet, utilities, workspace)</li>
                      <li>Travel for business (events, shoots) & education/courses</li>
                    </ul>
                    <p className="mt-2 text-gray-500">Always consult a tax professional for your situation.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Software">Software/Subscriptions</option>
                    <option value="Marketing">Marketing/Ads</option>
                    <option value="Office">Home Office</option>
                    <option value="Travel">Travel/Events</option>
                    <option value="Education">Courses/Education</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      className="border rounded px-3 py-2 flex-1"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newExpense.taxDeductible}
                        onChange={(e) => setNewExpense({...newExpense, taxDeductible: e.target.checked})}
                      />
                      Tax Deductible
                    </label>
                    <button
                      onClick={addExpense}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced expense summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h4 className="font-medium text-yellow-800">Tax Deductible Summary</h4>
                  <p className="text-yellow-700">Total deductible: <span className="font-bold">${deductibleExpenses}</span></p>
                  <p className="text-sm text-yellow-600">Tax savings: ${taxSavings.toFixed(0)}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h4 className="font-medium text-green-800">Effective Cost</h4>
                  <p className="text-green-700">After tax savings: <span className="font-bold">${effectiveCost.toFixed(0)}</span></p>
                  <p className="text-sm text-green-600">Real cost to business</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h4 className="font-medium text-blue-800">Monthly Average</h4>
                  <p className="text-blue-700">Average per month: <span className="font-bold">${(totalExpenses / 12).toFixed(0)}</span></p>
                  <p className="text-sm text-blue-600">Budget planning</p>
                </div>
              </div>

              {/* Expense breakdown by category */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold mb-3">Monthly Expense Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {Object.entries(expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="bg-white p-2 rounded">
                      <p className="text-gray-600">{category}</p>
                      <p className="font-bold">${amount.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {expenses.map(expense => (
                  <div key={expense.id} className="p-3 bg-red-50 rounded-lg">
                    {editingExpenseId === expense.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                        <input
                          type="date"
                          value={editData.date || ''}
                          onChange={(e) => setEditData({...editData, date: e.target.value})}
                          className="border rounded px-2 py-1"
                        />
                        <select
                          value={editData.category || ''}
                          onChange={(e) => setEditData({...editData, category: e.target.value})}
                          className="border rounded px-2 py-1"
                        >
                          <option value="Equipment">Equipment</option>
                          <option value="Software">Software</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Office">Office</option>
                          <option value="Travel">Travel</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="text"
                          value={editData.description || ''}
                          onChange={(e) => setEditData({...editData, description: e.target.value})}
                          placeholder="Description"
                          className="border rounded px-2 py-1"
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={editData.taxDeductible || false}
                            onChange={(e) => setEditData({...editData, taxDeductible: e.target.checked})}
                          />
                          Deductible
                        </label>
                        <input
                          type="number"
                          value={editData.amount || ''}
                          onChange={(e) => setEditData({...editData, amount: e.target.value})}
                          placeholder="Amount"
                          className="border rounded px-2 py-1"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit('expense')}
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 flex items-center"
                          >
                            <X className="h-4 w-4" />
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
                              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Tax Deductible</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{expense.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-red-600">${expense.amount}</span>
                          <button
                            onClick={() => startEdit('expense', expense)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700"
                          >
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
                    onChange={(e) => setNewBrandDeal({...newBrandDeal, brand: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Campaign name"
                    value={newBrandDeal.campaign}
                    onChange={(e) => setNewBrandDeal({...newBrandDeal, campaign: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <select
                    value={newBrandDeal.stage}
                    onChange={(e) => setNewBrandDeal({...newBrandDeal, stage: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="Outreach">Outreach</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Signed">Signed</option>
                    <option value="Content Due">Content Due</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <select
                    value={newBrandDeal.paymentStatus}
                    onChange={(e) => setNewBrandDeal({...newBrandDeal, paymentStatus: e.target.value})}
                    className="border rounded px-3 py-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Not Due">Not Due</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Paid">Paid</option>
                  </select>
                  <input
                    type="date"
                    value={newBrandDeal.dueDate}
                    onChange={(e) => setNewBrandDeal({...newBrandDeal, dueDate: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Deal value ($)"
                    value={newBrandDeal.amount}
                    onChange={(e) => setNewBrandDeal({...newBrandDeal, amount: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={newBrandDeal.notes}
                    onChange={(e) => setNewBrandDeal({...newBrandDeal, notes: e.target.value})}
                    className="border rounded px-3 py-2 md:col-span-2"
                  />
                  <button
                    onClick={addBrandDeal}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2 md:col-span-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Brand Deal
                  </button>
                </div>
              </div>

              {/* Enhanced brand analytics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <h5 className="font-medium text-yellow-800">In Progress</h5>
                  <p className="text-2xl font-bold text-yellow-600">
                    {brandDeals.filter(deal => ['Outreach', 'Negotiation', 'Signed'].includes(deal.stage)).length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <h5 className="font-medium text-green-800">Pending Payment</h5>
                  <p className="text-2xl font-bold text-green-600">
                    ${brandDeals.filter(deal => deal.paymentStatus === 'Pending').reduce((sum, deal) => sum + deal.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <h5 className="font-medium text-blue-800">Average Deal</h5>
                  <p className="text-2xl font-bold text-blue-600">
                    ${averageDealValue.toFixed(0)}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <h5 className="font-medium text-purple-800">Total Pipeline</h5>
                  <p className="text-2xl font-bold text-purple-600">
                    ${totalPipelineValue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {brandDeals.map(deal => (
                  <div key={deal.id} className="bg-white border rounded-lg p-4">
                    {editingBrandId === deal.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
                        <input
                          type="text"
                          value={editData.brand || ''}
                          onChange={(e) => setEditData({...editData, brand: e.target.value})}
                          placeholder="Brand"
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="text"
                          value={editData.campaign || ''}
                          onChange={(e) => setEditData({...editData, campaign: e.target.value})}
                          placeholder="Campaign"
                          className="border rounded px-2 py-1"
                        />
                        <select
                          value={editData.stage || ''}
                          onChange={(e) => setEditData({...editData, stage: e.target.value})}
                          className="border rounded px-2 py-1"
                        >
                          <option value="Outreach">Outreach</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Signed">Signed</option>
                          <option value="Content Due">Content Due</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <select
                          value={editData.paymentStatus || ''}
                          onChange={(e) => setEditData({...editData, paymentStatus: e.target.value})}
                          className="border rounded px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Not Due">Not Due</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Paid">Paid</option>
                        </select>
                        <input
                          type="date"
                          value={editData.dueDate || ''}
                          onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                          className="border rounded px-2 py-1"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editData.amount || ''}
                            onChange={(e) => setEditData({...editData, amount: e.target.value})}
                            placeholder="Amount"
                            className="border rounded px-2 py-1 w-20"
                          />
                          <button
                            onClick={() => saveEdit('brand')}
                            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300 flex items-center"
                          >
                            <X className="h-4 w-4" />
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
                              onChange={(e) => updateBrandDealStage(deal.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="Outreach">Outreach</option>
                              <option value="Negotiation">Negotiation</option>
                              <option value="Signed">Signed</option>
                              <option value="Content Due">Content Due</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Due:</strong> {deal.dueDate || 'TBD'}</p>
                            <p><strong>Payment:</strong> 
                              <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                deal.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                                deal.paymentStatus === 'Overdue' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {deal.paymentStatus}
                              </span>
                            </p>
                            {deal.notes && <p><strong>Notes:</strong> {deal.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-green-600">${deal.amount.toLocaleString()}</span>
                          <button
                            onClick={() => startEdit('brand', deal)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteBrandDeal(deal.id)}
                            className="text-red-500 hover:text-red-700"
                          >
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
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-full border rounded px-3 py-2"
                        min="0"
                        max="50"
                      />
                    </div>
                    <div className="pt-3 border-t">
                      <p><strong>Taxable Income:</strong> ${netProfit.toLocaleString()}</p>
                      <p><strong>Deductible Expenses:</strong> ${deductibleExpenses.toLocaleString()}</p>
                      <p className="text-lg font-bold text-blue-600">
                        <strong>Estimated Tax:</strong> ${estimatedTax.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Quarterly Tax Planning</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Q1 (Due: Apr 15)</span>
                      <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Q2 (Due: Jun 15)</span>
                      <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Q3 (Due: Sep 15)</span>
                      <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Q4 (Due: Jan 15)</span>
                      <span className="font-medium">${(estimatedTax / 4).toFixed(0)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 mt-3">
                    💡 Tip: Set aside ${(estimatedTax / 12).toFixed(0)}/month for taxes
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-3">Income Smoothing Strategy</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded">
                    <h5 className="font-medium text-indigo-800">Set Aside for Taxes</h5>
                    <p className="text-2xl font-bold text-indigo-600">${(totalIncome * 0.3).toFixed(0)}</p>
                    <p className="text-sm text-indigo-600">30% of total income</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h5 className="font-medium text-cyan-800">Emergency Buffer</h5>
                    <p className="text-2xl font-bold text-cyan-600">${(totalIncome * 0.2).toFixed(0)}</p>
                    <p className="text-sm text-cyan-600">20% for irregular months</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <h5 className="font-medium text-green-800">Available to Spend</h5>
                    <p className="text-2xl font-bold text-green-600">${(totalIncome * 0.5).toFixed(0)}</p>
                    <p className="text-sm text-green-600">After taxes & savings</p>
                  </div>
                </div>
                <p className="text-sm text-indigo-700 mt-4">
                  Based on your ${totalIncome.toLocaleString()} total income, this strategy helps smooth out the ups and downs of creator earnings.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <h4 className="font-medium text-yellow-800">Important Tax Reminders</h4>
                <ul className="text-yellow-700 text-sm space-y-1 mt-2">
                  <li>• Keep detailed records of all business expenses</li>
                  <li>• Save receipts for equipment, software, and business meals</li>
                  <li>• Track home office expenses (internet, utilities, rent percentage)</li>
                  <li>• Consider quarterly estimated tax payments to avoid penalties</li>
                  <li>• Consult with a tax professional for personalized advice</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
            <button 
              onClick={() => setSelectedDay(null)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Activity for {selectedDay}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Income</h4>
                {incomeEntries.filter(entry => entry.date === selectedDay).length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {incomeEntries.filter(entry => entry.date === selectedDay).map(entry => (
                      <li key={entry.id} className="flex justify-between p-2 bg-green-50 rounded">
                        <span>{entry.source} — {entry.description}</span>
                        <span className="font-medium text-cyan-600">${entry.amount}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No income recorded.</p>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-2">Expenses</h4>
                {expenses.filter(expense => expense.date === selectedDay).length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {expenses.filter(expense => expense.date === selectedDay).map(expense => (
                      <li key={expense.id} className="flex justify-between p-2 bg-red-50 rounded">
                        <span>{expense.category} — {expense.description}</span>
                        <span className="text-red-700 font-medium">${expense.amount}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No expenses recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export Modal */}
      {showPdfOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowPdfOptions(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold mb-3">Export to PDF</h3>
            <p className="text-sm text-gray-600 mb-4">Choose which sections to include in your export:</p>
            <div className="space-y-2">
              {Object.entries(pdfSections).map(([section, checked]) => (
                <label key={section} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setPdfSections({...pdfSections, [section]: e.target.checked})}
                  />
                  <span className="capitalize">{section === 'brands' ? 'Brand Pipeline' : section}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowPdfOptions(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={exportPdf}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>This tracker helps micro-influencers manage irregular income & maximize tax deductions</p>
      </div>
    </div>
  );
};

export default CreatorFinanceTracker;