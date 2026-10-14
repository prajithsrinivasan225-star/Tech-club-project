import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Package,
  Settings,
  Download,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCw,
  Search,
  Filter,
  Check,
  ChevronRight,
  Menu,
  X,
  FileSpreadsheet,
  FileText,
  Sparkles,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

import {
  ModelParameters,
  SalesDataPoint,
  StorePrediction,
  InventoryItem,
  AIInsight,
  ModelExecutionMetrics,
} from './types/retail';
import {
  defaultParameters,
  generateForecastData,
  generateStorePredictions,
  defaultInventoryItems,
  getAIInsights,
  getExecutionMetrics,
  exportToCSV,
} from './data/retailEngine';
import ModelExecutionPanel from './components/ModelExecutionPanel';
import PredictiveAnalysisView from './components/PredictiveAnalysisView';
import InventoryAllocationView from './components/InventoryAllocationView';
import SettingsView from './components/SettingsView';
import ExportModal from './components/ExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'inventory' | 'settings'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Model parameters state
  const [params, setParams] = useState<ModelParameters>(defaultParameters);

  // Execution state
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState('');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionCount, setExecutionCount] = useState(1);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Data states
  const [forecastData, setForecastData] = useState<SalesDataPoint[]>(() => generateForecastData(defaultParameters));
  const [stores, setStores] = useState<StorePrediction[]>(() => generateStorePredictions(defaultParameters));
  const [inventory, setInventory] = useState<InventoryItem[]>(defaultInventoryItems);
  const [insights, setInsights] = useState<AIInsight[]>(() => getAIInsights(defaultParameters));
  const [metrics, setMetrics] = useState<ModelExecutionMetrics>(() => getExecutionMetrics(defaultParameters, 1));

  // Visual toggles
  const [showConfidenceBands, setShowConfidenceBands] = useState(true);
  const [storeSearch, setStoreSearch] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Execute forecast simulation pipeline
  const handleExecuteModel = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setExecutionProgress(10);
    setExecutionStep('Ingesting 4.2M POS transaction records and historical logs...');

    setTimeout(() => {
      setExecutionProgress(35);
      setExecutionStep('Generating lag features, promotional elasticity & moving averages...');
    }, 400);

    setTimeout(() => {
      setExecutionProgress(65);
      setExecutionStep(`Training ${params.algorithm.toUpperCase()} decision trees & cross-validation...`);
    }, 850);

    setTimeout(() => {
      setExecutionProgress(88);
      setExecutionStep('Computing Monte Carlo confidence intervals (P10 & P90)...');
    }, 1300);

    setTimeout(() => {
      // Recalculate everything
      const newForecast = generateForecastData(params);
      const newStores = generateStorePredictions(params);
      const newInsights = getAIInsights(params);
      const newMetrics = getExecutionMetrics(params, executionCount + 1);

      setForecastData(newForecast);
      setStores(newStores);
      setInsights(newInsights);
      setMetrics(newMetrics);
      setExecutionCount((c) => c + 1);

      setExecutionProgress(100);
      setExecutionStep('Convergence achieved! Projections and allocations updated.');
      setIsExecuting(false);

      setLastNotification('Forecast model executed successfully with updated scenario data.');
      setTimeout(() => setLastNotification(null), 4000);
    }, 1800);
  };

  // Instant parameter update (e.g. from sliders or dropdowns)
  const handleParamsChange = (newParams: ModelParameters) => {
    setParams(newParams);
    // Real-time reactive updates
    const updatedForecast = generateForecastData(newParams);
    const updatedStores = generateStorePredictions(newParams);
    const updatedInsights = getAIInsights(newParams);
    setForecastData(updatedForecast);
    setStores(updatedStores);
    setInsights(updatedInsights);
  };

  // Interactive insight actions
  const handleInsightAction = (id: string, action: 'applied' | 'dismissed') => {
    setInsights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  // Inventory transfer handler
  const handleApproveTransfer = (sku: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          const added = item.unitsToTransfer || 150;
          const newStock = item.currentStock + added;
          const newDays = Math.round((newStock / item.projectedDemand30d) * 30);
          return {
            ...item,
            currentStock: newStock,
            daysOfSupply: newDays,
            riskLevel: newDays < 15 ? 'Warning' : 'Optimal',
            suggestedAction: `Transfer of ${added} units dispatched. Target safety stock restored.`,
          };
        }
        return item;
      })
    );
    setLastNotification(`Transfer order dispatched for SKU ${sku}. Regional stock balanced.`);
    setTimeout(() => setLastNotification(null), 4000);
  };

  // Filter stores
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.location.toLowerCase().includes(storeSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(storeSearch.toLowerCase())
  );

  // Compute summary numbers
  const futurePoints = forecastData.filter((d) => d.predicted !== null);
  const nextMonthForecast = futurePoints.length > 0 ? futurePoints[0].predicted || 0 : 5100;
  const projectedRevenueFormatted = `$${((nextMonthForecast * 278.6)).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;

  const growthPercentage =
    params.scenario === 'promo_surge'
      ? '+16.8%'
      : params.scenario === 'supply_strain'
      ? '+2.4%'
      : params.scenario === 'inflation_caution'
      ? '+5.1%'
      : '+12.4%';

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] bg-slate-800 text-white flex flex-col hidden md:flex py-6 shrink-0 z-20">
        <div className="px-6 pb-8 font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-black shadow-xs">
            V
          </div>
          Vanguard Retail
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-0">
            <li>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-left ${
                  activeTab === 'overview'
                    ? 'bg-white/10 text-white border-l-4 border-blue-600 font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('predictions')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-left ${
                  activeTab === 'predictions'
                    ? 'bg-white/10 text-white border-l-4 border-blue-600 font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Predictive Analysis
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors text-left ${
                  activeTab === 'inventory'
                    ? 'bg-white/10 text-white border-l-4 border-blue-600 font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <Package className="h-4 w-4" />
                Inventory Allocation
              </button>
            </li>
          </ul>

          <div className="mt-auto pt-6 border-t border-white/10">
            <ul className="space-y-0">
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-sm text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-white/10 text-white border-l-4 border-blue-600 font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Model Tuning & Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
                Sales Forecast Engine v2.4
              </h2>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Real-Time Predictive Architecture & Supply Balancer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs text-slate-500">Last execution:</span>
              <span className="text-xs font-semibold text-slate-700">{metrics.lastExecutedAt}</span>
            </div>

            {/* Quick CSV Direct Export */}
            <button
              onClick={() => exportToCSV(forecastData, stores, params)}
              title="Download CSV immediately"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quick CSV</span>
            </button>

            {/* Primary Export Report Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold rounded shadow-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 text-white px-4 py-3 border-b border-slate-700 space-y-1 z-30">
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                activeTab === 'overview' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300'
              }`}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => {
                setActiveTab('predictions');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                activeTab === 'predictions' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300'
              }`}
            >
              Predictive Analysis
            </button>
            <button
              onClick={() => {
                setActiveTab('inventory');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                activeTab === 'inventory' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300'
              }`}
            >
              Inventory Allocation
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                activeTab === 'settings' ? 'bg-blue-600 text-white font-medium' : 'text-slate-300'
              }`}
            >
              Settings
            </button>
          </div>
        )}

        {/* Floating Notification Toast */}
        {lastNotification && (
          <div className="absolute top-20 right-6 z-40 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lastNotification}</span>
          </div>
        )}

        {/* Scrollable Main Viewport */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Model Execution Controller (Always accessible across tabs) */}
            <ModelExecutionPanel
              params={params}
              onParamsChange={handleParamsChange}
              onExecute={handleExecuteModel}
              isExecuting={isExecuting}
              executionStep={executionStep}
              executionProgress={executionProgress}
              metrics={metrics}
            />

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* KPI Cards */}
                <div className="col-span-1 lg:col-span-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-2 shadow-xs">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Projected Revenue ({params.horizon.toUpperCase()})
                    </div>
                    <div className="text-[1.75rem] font-bold text-slate-900">
                      {projectedRevenueFormatted}
                    </div>
                    <div className="text-sm flex items-center gap-1 text-emerald-500 font-medium">
                      ▲ {growthPercentage} vs last period
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-2 shadow-xs">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Forecast Confidence
                    </div>
                    <div className="text-[1.75rem] font-bold text-slate-900">
                      {params.confidenceLevel === 95 ? '96.4%' : params.confidenceLevel === 90 ? '94.2%' : '88.5%'}
                    </div>
                    <div className="text-sm flex items-center gap-1 text-slate-500">
                      {params.algorithm === 'ensemble' ? 'High Precision Blended Ensemble' : 'Standard Calibrated State'}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-2 shadow-xs">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Peak Demand Category
                    </div>
                    <div className="text-[1.75rem] font-bold text-slate-900">
                      {params.scenario === 'promo_surge' ? 'Electronics & Gear' : 'Home Office'}
                    </div>
                    <div className="text-sm flex items-center gap-1 text-amber-500 font-medium">
                      Supply Risk: {params.scenario === 'supply_strain' ? 'High' : 'Medium'}
                    </div>
                  </div>
                </div>

                {/* Main Forecast Chart */}
                <div className="col-span-1 lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 flex flex-col shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h3 className="text-[0.95rem] font-semibold text-slate-900">
                        Revenue Trend & Projection
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Monthly aggregation across all retail regions ($ thousands)
                      </p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={showConfidenceBands}
                          onChange={(e) => setShowConfidenceBands(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <span>P10-P90 Corridor</span>
                      </label>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="w-2.5 h-2.5 bg-slate-800 rounded-xs"></span> Historical
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <span className="w-2.5 h-2.5 bg-blue-600 opacity-80 rounded-xs border border-dashed border-blue-600"></span>
                          Predicted
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={forecastData}
                        margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 11 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#64748b', fontSize: 11 }}
                          dx={-10}
                          tickFormatter={(value) => `$${value}k`}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                          }}
                          formatter={(value: any, name: any) => [`$${value}k`, name]}
                        />

                        {/* Confidence interval band */}
                        {showConfidenceBands && (
                          <Area
                            type="monotone"
                            dataKey="p90Upper"
                            stroke="none"
                            fill="#93c5fd"
                            fillOpacity={0.25}
                            name="Upper Confidence (P90)"
                          />
                        )}

                        <Line
                          type="monotone"
                          dataKey="actual"
                          name="Historical Actual"
                          stroke="#1e293b"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#1e293b' }}
                          activeDot={{ r: 6 }}
                        />

                        <Line
                          type="monotone"
                          dataKey="predicted"
                          name="Predicted Forecast"
                          stroke="#2563eb"
                          strokeWidth={2.5}
                          strokeDasharray="5 5"
                          dot={{ r: 4, fill: '#2563eb' }}
                          activeDot={{ r: 6 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Actionable Insights Panel */}
                <div className="col-span-1 bg-white border border-slate-200 rounded-lg p-5 flex flex-col shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[0.95rem] font-semibold text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      AI Actionable Insights
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500">
                      {insights.filter((i) => i.status === 'active').length} Pending
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col divide-y divide-slate-100 overflow-y-auto">
                    {insights.map((insight) => (
                      <div key={insight.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-slate-900">{insight.title}</span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              insight.type === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : insight.type === 'opportunity'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {insight.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>

                        <div className="mt-2 flex items-center justify-between pt-1">
                          <span className="text-[11px] font-semibold text-slate-700">
                            {insight.financialImpact}
                          </span>

                          {insight.status === 'active' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleInsightAction(insight.id, 'applied')}
                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Apply Directive
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => handleInsightAction(insight.id, 'dismissed')}
                                className="text-[11px] text-slate-400 hover:text-slate-600"
                              >
                                Dismiss
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Directive Applied
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Store Predictions Table */}
                <div className="col-span-1 lg:col-span-3 bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-[0.95rem] font-semibold text-slate-900">
                        Store-Level Predictions & Velocity
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Forecasted performance by retail location for the selected horizon
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search store or city..."
                          value={storeSearch}
                          onChange={(e) => setStoreSearch(e.target.value)}
                          className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-48"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold rounded-tl-md">Store ID</th>
                          <th className="px-4 py-3 font-semibold">Location</th>
                          <th className="px-4 py-3 font-semibold">Top Category</th>
                          <th className="px-4 py-3 font-semibold text-right">Projected Revenue</th>
                          <th className="px-4 py-3 font-semibold text-right">Predicted Growth</th>
                          <th className="px-4 py-3 font-semibold text-center">Confidence</th>
                          <th className="px-4 py-3 font-semibold rounded-tr-md">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStores.map((store, index) => (
                          <tr
                            key={store.id}
                            className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                              index === filteredStores.length - 1 ? 'border-0' : ''
                            }`}
                          >
                            <td className="px-4 py-3 font-mono font-medium text-slate-900">{store.id}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-slate-900">{store.name}</div>
                              <div className="text-xs text-slate-500">{store.location}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600">{store.topCategory}</td>
                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                              ${store.projectedRevenue.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`font-semibold text-xs ${
                                  store.predictedGrowth.startsWith('+')
                                    ? 'text-emerald-500'
                                    : 'text-rose-500'
                                }`}
                              >
                                {store.predictedGrowth}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                                {store.confidence} ({store.confidenceScore}%)
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {store.status === 'Optimal' && (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                )}
                                {store.status === 'Review' && (
                                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                                )}
                                {store.status === 'Action Required' && (
                                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                                )}
                                <span
                                  className={`text-xs font-medium ${
                                    store.status === 'Optimal'
                                      ? 'text-emerald-600'
                                      : store.status === 'Review'
                                      ? 'text-amber-600'
                                      : 'text-rose-600'
                                  }`}
                                >
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

                {/* Model Metrics Bottom Banner */}
                <div className="col-span-1 lg:col-span-3 bg-slate-800 text-white rounded-lg p-4 sm:p-6 flex flex-wrap justify-around items-center gap-4 shadow-xs">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{metrics.algorithm.split(' ')[0]} v4.2</span>
                    <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">
                      Model Architecture
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-emerald-400">{metrics.rmse}</span>
                    <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">
                      RMSE Score
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-blue-400">{metrics.mape}%</span>
                    <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">
                      Mean Absolute % Error
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">{metrics.dataPointsProcessed}</span>
                    <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">
                      Data Points Processed
                    </span>
                  </div>
                  <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-emerald-400">Online & Live</span>
                    <span className="text-[0.7rem] opacity-60 uppercase mt-1 tracking-wider">
                      Latency Mode
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Predictive Analysis Deep Dive */}
            {activeTab === 'predictions' && (
              <PredictiveAnalysisView
                params={params}
                forecastData={forecastData}
                metrics={metrics}
                onRunOptimization={handleExecuteModel}
              />
            )}

            {/* Tab 3: Inventory Allocation */}
            {activeTab === 'inventory' && (
              <InventoryAllocationView
                inventory={inventory}
                stores={stores}
                onApproveTransfer={handleApproveTransfer}
              />
            )}

            {/* Tab 4: Settings & Hyperparameters */}
            {activeTab === 'settings' && <SettingsView />}

          </div>
        </div>
      </main>

      {/* Export Report Suite Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        forecastData={forecastData}
        stores={stores}
        inventory={inventory}
        params={params}
        metrics={metrics}
      />
    </div>
  );
}
