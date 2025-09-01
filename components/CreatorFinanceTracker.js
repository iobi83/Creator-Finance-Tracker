import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Calculator, PlusCircle, Trash2 } from 'lucide-react';

const CreatorFinanceTracker = () => {
  const [activeTab, setActiveTab] = useState('income');
  const [incomeEntries, setIncomeEntries] = useState([
    { id: 1, date: '2025-08-15', source: 'TikTok Shop', platform: 'TikTok', description: 'Commission from skincare promo', amount: 450, category: 'Affiliate' },
    { id: 2, date: '2025-08-20', source: 'Brand Deal', platform: 'Instagram', description: 'Fitness brand partnership', amount: 800, category: 'Sponsorship' }
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2025-08-10', category: 'Equipment', description: 'Ring light for content', amount: 120, taxDeductible: true },
    { id: 2, date: '2025-08-12', category: 'Software', description: 'Canva Pro subscription', amount: 15, taxDeductible: true }
  ]);
  const [brandDeals, setBrandDeals] = useState([
    { id: 1, brand: 'FitTech Co', campaign: 'Summer Wellness', stage: 'Negotiation', dueDate: '2025-09-15', paymentStatus: 'Pending', amount: 1200, notes: 'Need to submit content draft' },
    { id: 2, brand: 'StyleBox', campaign: 'Fall Fashion', stage: 'Signed', dueDate: '2025-09-30', paymentStatus: 'Not Due', amount: 800, notes: 'Contract signed, content due Sep 30' }
  ]);
  const [taxRate, setTaxRate] = useState(25);
  const [emergencyGoal, setEmergencyGoal] = useState(5000);

  const [newIncome, setNewIncome] = useState({ date: '', source: '', platform: '', description: '', amount: '', category: 'Affiliate' });
  const [newExpense, setNewExpense] = useState({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
  const [newBrandDeal, setNewBrandDeal] = useState({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const deductibleExpenses = expenses.filter(e => e.taxDeductible).reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const estimatedTax = (netProfit * taxRate) / 100;
  const emergencyFundProgress = (netProfit / emergencyGoal) * 100;

  const addIncome = () => {
    if (newIncome.date && newIncome.source && newIncome.amount) {
      setIncomeEntries([...incomeEntries, { 
        ...newIncome, 
        id: Date.now(), 
        amount: parseFloat(newIncome.amount) 
      }]);
      setNewIncome({ date: '', source: '', platform: '', description: '', amount: '', category: 'Affiliate' });
    }
  };

  const addExpense = () => {
    if (newExpense.date && newExpense.description && newExpense.amount) {
      setExpenses([...expenses, { 
        ...newExpense, 
        id: Date.now(), 
        amount: parseFloat(newExpense.amount) 
      }]);
      setNewExpense({ date: '', category: 'Equipment', description: '', amount: '', taxDeductible: true });
    }
  };

  const addBrandDeal = () => {
    if (newBrandDeal.brand && newBrandDeal.campaign && newBrandDeal.amount) {
      setBrandDeals([...brandDeals, { 
        ...newBrandDeal, 
        id: Date.now(), 
        amount: parseFloat(newBrandDeal.amount) 
      }]);
      setNewBrandDeal({ brand: '', campaign: '', stage: 'Outreach', dueDate: '', paymentStatus: 'Pending', amount: '', notes: '' });
    }
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Creator Finance Tracker</h1>
        <p className="text-gray-600">Manage irregular income, track deductibles, and plan for taxes</p>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Income</p>
              <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Total Expenses</p>
              <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-200" />
          </div>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Net Profit</p>
              <p className="text-2xl font-bold">${netProfit.toLocaleString()}</p>
            </div>
            <Calculator className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Est. Tax Owed</p>
              <p className="text-2xl font-bold">${estimatedTax.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Emergency Fund Progress */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Emergency Fund Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(emergencyFundProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          ${netProfit.toLocaleString()} of ${emergencyGoal.toLocaleString()} goal ({Math.round(emergencyFundProgress)}%)
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          {[
            { id: 'income', label: 'Income Tracker', icon: TrendingUp },
            { id: 'expenses', label: 'Expenses & Deductibles', icon: DollarSign },
            { id: 'brands', label: 'Brand Pipeline', icon: Calendar },
            { id: 'tax', label: 'Tax Planning', icon: Calculator }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 font-medium transition-colors ${
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
          {activeTab === 'income' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Income Sources</h3>
              
              {/* Add Income Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Add New Income</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="date"
                    value={newIncome.date}
                    onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Income source"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                    className="border rounded px-3 py-2"
                  />
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
                    placeholder="Description"
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
                      className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Income List */}
              <div className="space-y-3">
                {incomeEntries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{entry.source}</span>
                        <span className="text-sm bg-green-200 px-2 py-1 rounded">{entry.category}</span>
                        <span className="text-sm text-gray-600">{entry.platform}</span>
                      </div>
                      <p className="text-sm text-gray-600">{entry.description}</p>
                      <p className="text-xs text-gray-500">{entry.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-green-600">${entry.amount}</span>
                      <button
                        onClick={() => deleteIncome(entry.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Expenses & Tax Deductibles</h3>
              
              {/* Add Expense Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Add New Expense</h4>
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
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount ($)"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      className="border rounded px-3 py-2 flex-1"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newExpense.taxDeductible}
                        onChange={(e) => setNewExpense({...newExpense, taxDeductible: e.target.checked})}
                      />
                      <span className="text-sm">Tax Deductible</span>
                    </label>
                    <button
                      onClick={addExpense}
                      className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tax Deductible Summary */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <h4 className="font-medium text-yellow-800">Tax Deductible Summary</h4>
                <p className="text-yellow-700">Total deductible expenses: <span className="font-bold">${deductibleExpenses}</span></p>
                <p className="text-sm text-yellow-600">This could save you approximately ${(deductibleExpenses * taxRate / 100).toFixed(0)} in taxes</p>
              </div>

              {/* Expenses List */}
              <div className="space-y-3">
                {expenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
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
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Brand Deal Pipeline</h3>
              
              {/* Add Brand Deal Form */}
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
                    placeholder="Due date"
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
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 flex items-center gap-2 md:col-span-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Brand Deal
                  </button>
                </div>
              </div>

              {/* Pipeline Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                <div className="bg-red-100 p-3 rounded-lg">
                  <h5 className="font-medium text-red-800">Overdue</h5>
                  <p className="text-2xl font-bold text-red-600">
                    {brandDeals.filter(deal => deal.paymentStatus === 'Overdue').length}
                  </p>
                </div>
              </div>

              {/* Brand Deals List */}
              <div className="space-y-3">
                {brandDeals.map(deal => (
                  <div key={deal.id} className="bg-white border rounded-lg p-4">
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
                          onClick={() => deleteBrandDeal(deal.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Tax Planning & Estimates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tax Calculator */}
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

                {/* Quarterly Planning */}
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

              {/* Income Smoothing Recommendation */}
              <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                <h4 className="font-medium mb-2">Income Smoothing Strategy</h4>
                <p className="text-sm text-indigo-700">
                  Based on your ${totalIncome.toLocaleString()} income, consider setting aside ${(totalIncome * 0.3).toFixed(0)} (30%) 
                  for taxes and ${(totalIncome * 0.2).toFixed(0)} (20%) for irregular months.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>💡 This tracker helps micro-influencers manage irregular income & maximize tax deductions</p>
      </div>
    </div>
  );
};

export default CreatorFinanceTracker;