import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Settings, 
  Bell, 
  Search, 
  Calendar,
  Download,
  ChevronDown,
  Activity,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { salesData, categoryData, featureImportance, storePredictions } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-slate-800 text-white flex flex-col hidden md:flex py-6">
        <div className="px-6 pb-8 font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded"></div>
          RetailPredict AI
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-0">
            <li>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white border-l-4 border-blue-600' : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard Overview
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('predictions')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${activeTab === 'predictions' ? 'bg-white/10 text-white border-l-4 border-blue-600' : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`}
              >
                <TrendingUp className="h-4 w-4" />
                Predictive Analysis
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${activeTab === 'inventory' ? 'bg-white/10 text-white border-l-4 border-blue-600' : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'}`}
              >
                <Package className="h-4 w-4" />
                Inventory Allocation
              </button>
            </li>
          </ul>

          <div className="mt-auto">
            <ul className="space-y-0">
              <li>
                <button className="w-full flex items-center gap-3 px-6 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Sales Forecast Engine v2.4</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">Last updated: Today, 08:42 AM</div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors">
              Export Report
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* KPI Cards */}
            <div className="col-span-1 lg:col-span-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Projected Revenue (Next 30d)</div>
                <div className="text-[1.75rem] font-bold text-slate-900">$1,420,900</div>
                <div className="text-sm flex items-center gap-1 text-emerald-500">
                  ▲ 12.4% vs last month
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Forecast Confidence</div>
                <div className="text-[1.75rem] font-bold text-slate-900">94.2%</div>
                <div className="text-sm flex items-center gap-1 text-slate-500">
                  High Reliability State
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Peak Demand Category</div>
                <div className="text-[1.75rem] font-bold text-slate-900">Home Office</div>
                <div className="text-sm flex items-center gap-1 text-amber-500">
                  Supply risk: Medium
                </div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[0.95rem] font-semibold text-slate-900">Revenue Trend & Projection</h3>
                  <p className="text-xs text-slate-500 mt-1">Weekly aggregation across all regions</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span className="w-2 h-2 bg-slate-800 rounded-sm"></span> Historical
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <span className="w-2 h-2 bg-blue-600 opacity-80 rounded-sm border border-dashed border-blue-600"></span> Predicted
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dx={-10}
                      tickFormatter={(value) => `$${value}k`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`$${value}k`, '']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      name="Historical" 
                      stroke="#1e293b" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#1e293b' }} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      name="Predicted" 
                      stroke="#2563eb" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#2563eb' }} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights Panel */}
            <div className="col-span-1 bg-white border border-slate-200 rounded-lg p-5">
              <h3 className="text-[0.95rem] font-semibold text-slate-900 mb-4">AI Actionable Insights</h3>
              <div className="flex flex-col">
                <div className="py-3 border-b border-slate-200">
                  <div className="font-semibold text-sm text-slate-900 mb-1">Stock-out Risk: North Region</div>
                  <div className="text-xs text-slate-500 leading-relaxed">Projected demand for Ergonomic Chairs will exceed supply by 22% in Week 46. Reallocate from East.</div>
                </div>
                <div className="py-3 border-b border-slate-200">
                  <div className="font-semibold text-sm text-slate-900 mb-1">Promo Opportunity</div>
                  <div className="text-xs text-slate-500 leading-relaxed">Low engagement predicted for Electronics next week. Recommend 15% flash sale to maintain velocity.</div>
                </div>
                <div className="py-3">
                  <div className="font-semibold text-sm text-slate-900 mb-1">Weather Impact Adjustment</div>
                  <div className="text-xs text-slate-500 leading-relaxed">Cold front in Midwest increased winter apparel forecast by $45k. Margin adjusted +2%.</div>
                </div>
              </div>
            </div>

            {/* Store Predictions Table */}
            <div className="col-span-1 lg:col-span-3 bg-white border border-slate-200 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-[0.95rem] font-semibold text-slate-900">Store-Level Predictions</h3>
                <p className="text-xs text-slate-500 mt-1">Forecasted performance by location for next month</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-md">Store ID</th>
                      <th className="px-4 py-3 font-semibold">Location</th>
                      <th className="px-4 py-3 font-semibold">Predicted Growth</th>
                      <th className="px-4 py-3 font-semibold">Confidence</th>
                      <th className="px-4 py-3 font-semibold rounded-tr-md">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storePredictions.map((store, index) => (
                      <tr key={store.id} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${index === storePredictions.length - 1 ? 'border-0' : ''}`}>
                        <td className="px-4 py-3 font-medium text-slate-900">{store.id}</td>
                        <td className="px-4 py-3 text-slate-600">{store.location}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${store.predictedGrowth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {store.predictedGrowth}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {store.confidence}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {store.status === 'Optimal' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                            {store.status === 'Review' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                            {store.status === 'Action Required' && <AlertCircle className="h-4 w-4 text-rose-500" />}
                            <span className={`text-xs font-medium ${
                              store.status === 'Optimal' ? 'text-emerald-600' : 
                              store.status === 'Review' ? 'text-amber-600' : 'text-rose-600'
                            }`}>
                              {store.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Model Metrics */}
            <div className="col-span-1 lg:col-span-3 bg-slate-800 text-white rounded-lg p-4 sm:p-6 flex flex-wrap justify-around items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">XGBoost v4</span>
                <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">Model Architecture</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">0.042</span>
                <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">RMSE Score</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">4.2M</span>
                <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">Data Points Processed</span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">Real-time</span>
                <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">Latency Mode</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
