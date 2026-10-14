import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  FileCode,
  Printer,
  Copy,
  Check,
  Download,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import {
  SalesDataPoint,
  StorePrediction,
  InventoryItem,
  ModelParameters,
  ModelExecutionMetrics,
} from '../types/retail';
import {
  exportToCSV,
  exportToJSON,
  generateTextBriefing,
} from '../data/retailEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  forecastData: SalesDataPoint[];
  stores: StorePrediction[];
  inventory: InventoryItem[];
  params: ModelParameters;
  metrics: ModelExecutionMetrics;
}

export default function ExportModal({
  isOpen,
  onClose,
  forecastData,
  stores,
  inventory,
  params,
  metrics,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activePreviewTab, setActivePreviewTab] = useState<'summary' | 'table' | 'raw'>('summary');
  const [includeConfidenceBands, setIncludeConfidenceBands] = useState(true);
  const [includeStoreBreakdown, setIncludeStoreBreakdown] = useState(true);
  const [includeInventoryRisks, setIncludeInventoryRisks] = useState(true);

  if (!isOpen) return null;

  const handleCopyBriefing = () => {
    const text = generateTextBriefing(forecastData, stores, params, metrics);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCSV = () => {
    exportToCSV(forecastData, stores, params);
    setDownloadSuccess('CSV Export downloaded successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportJSON = () => {
    exportToJSON(forecastData, stores, inventory, params, metrics);
    setDownloadSuccess('JSON Model data downloaded successfully');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const nextMonthPoints = forecastData.filter((d) => d.predicted !== null);
  const nextMonthVal = nextMonthPoints.length > 0 ? nextMonthPoints[0].predicted : 0;
  const totalStoresRev = stores.reduce((acc, s) => acc + s.projectedRevenue, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white">Export Forecast & Model Report</h2>
              <p className="text-xs text-slate-400">
                Generate executive-ready deliverables, CSV spreadsheets, and machine-readable model payloads
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success notification banner */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs px-6 py-2.5 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{downloadSuccess}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Action Export Buttons */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Select Export Format
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* CSV Button */}
              <button
                onClick={handleExportCSV}
                className="flex flex-col items-start p-4 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-all group"
              >
                <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  CSV Spreadsheet
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Full forecast series & store performance for Excel, Tableau, or PowerBI.
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  Download .csv <Download className="w-3 h-3" />
                </div>
              </button>

              {/* PDF / Print Button */}
              <button
                onClick={handlePrint}
                className="flex flex-col items-start p-4 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-all group"
              >
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Printer className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  Printable / PDF
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Executive presentation report optimized for printing or saving as PDF.
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  Open Print View <Printer className="w-3 h-3" />
                </div>
              </button>

              {/* JSON Model Export */}
              <button
                onClick={handleExportJSON}
                className="flex flex-col items-start p-4 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-all group"
              >
                <div className="w-8 h-8 rounded bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  JSON Model Payload
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Machine-readable parameters, raw predictions, and metadata for pipeline integration.
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  Download .json <Download className="w-3 h-3" />
                </div>
              </button>

              {/* Copy Briefing */}
              <button
                onClick={handleCopyBriefing}
                className="flex flex-col items-start p-4 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg text-left transition-all group"
              >
                <div className="w-8 h-8 rounded bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </div>
                <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                  Copy Briefing
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Formatted executive summary text ready for email or Slack update.
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                  {copied ? 'Copied to clipboard!' : 'Copy to Clipboard'}
                </div>
              </button>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Report Content Scope
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeConfidenceBands}
                  onChange={(e) => setIncludeConfidenceBands(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Include Confidence Bands (P10 & P90)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeStoreBreakdown}
                  onChange={(e) => setIncludeStoreBreakdown(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Include Store-by-Store Breakdown</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeInventoryRisks}
                  onChange={(e) => setIncludeInventoryRisks(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Include Inventory Allocation Risks</span>
              </label>
            </div>
          </div>

          {/* Report Live Preview */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Report Preview
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200 text-xs">
                <button
                  onClick={() => setActivePreviewTab('summary')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activePreviewTab === 'summary'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Executive Brief
                </button>
                <button
                  onClick={() => setActivePreviewTab('table')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activePreviewTab === 'table'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Data Grid
                </button>
                <button
                  onClick={() => setActivePreviewTab('raw')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activePreviewTab === 'raw'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  JSON Payload
                </button>
              </div>
            </div>

            <div className="p-4 bg-white max-h-72 overflow-y-auto">
              {activePreviewTab === 'summary' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <div className="text-slate-500">Forecast Horizon</div>
                      <div className="font-bold text-slate-900 text-sm">{params.horizon.toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Projected Next Month</div>
                      <div className="font-bold text-slate-900 text-sm">
                        ${((nextMonthVal || 0) * 1000).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Confidence Band</div>
                      <div className="font-bold text-slate-900 text-sm">{params.confidenceLevel}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500">RMSE Score</div>
                      <div className="font-bold text-emerald-600 text-sm">{metrics.rmse}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-1">Model Parameters Executed:</h4>
                    <p className="text-slate-600">
                      Algorithm: <strong className="text-slate-800">{metrics.algorithm}</strong> | Scenario: <strong className="text-slate-800">{params.scenario.replace('_', ' ')}</strong> | Promo Markdown: <strong className="text-slate-800">{params.promoDiscount}%</strong> | Ad Multiplier: <strong className="text-slate-800">{params.adSpendMultiplier}x</strong>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 text-xs mb-1">Key Action Directives:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Maintain promo discount ceiling at {params.promoDiscount}% to preserve operating margins.</li>
                      <li>Critical stockout risk identified for Ergonomic Chairs in North stores (ST-001). Reallocation recommended.</li>
                      <li>Cold weather anomaly adjustment added $45k projected lift to Midwestern retail locations.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activePreviewTab === 'table' && (
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-2">Store ID</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Current Rev</th>
                        <th className="p-2">Projected Rev</th>
                        <th className="p-2">Predicted Growth</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stores.map((s) => (
                        <tr key={s.id}>
                          <td className="p-2 font-mono font-medium text-slate-900">{s.id}</td>
                          <td className="p-2 text-slate-700">{s.location}</td>
                          <td className="p-2 text-slate-600">${s.currentMonthlyRevenue.toLocaleString()}</td>
                          <td className="p-2 font-semibold text-slate-900">${s.projectedRevenue.toLocaleString()}</td>
                          <td className="p-2">
                            <span className={s.growthNum >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                              {s.predictedGrowth}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              s.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700' :
                              s.status === 'Review' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activePreviewTab === 'raw' && (
                <pre className="font-mono text-[11px] text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 overflow-x-auto">
                  {JSON.stringify(
                    {
                      report: 'RetailPredict AI Sales Forecast Engine',
                      executedAt: metrics.lastExecutedAt,
                      algorithm: metrics.algorithm,
                      metrics: { rmse: metrics.rmse, mape: metrics.mape, r2: metrics.r2 },
                      forecastSample: forecastData.slice(-3),
                    },
                    null,
                    2
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Enterprise verified model output (v2.4)
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-md transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4" /> Export CSV Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
