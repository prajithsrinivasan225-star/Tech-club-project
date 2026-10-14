import React, { useState } from 'react';
import {
  Settings,
  Database,
  Sliders,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  Cloud,
  FileCheck,
} from 'lucide-react';

export default function SettingsView() {
  const [learningRate, setLearningRate] = useState('0.05');
  const [nEstimators, setNEstimators] = useState('450');
  const [maxDepth, setMaxDepth] = useState('6');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Model hyperparameters and pipeline configuration saved successfully.</span>
        </div>
      )}

      {/* Model Hyperparameters */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          Model Tuning & Hyperparameters
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Fine-tune the gradient boosting regressors and cross-validation partition strategies.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Learning Rate (Eta)
            </label>
            <select
              value={learningRate}
              onChange={(e) => setLearningRate(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-2 bg-slate-50 text-slate-800"
            >
              <option value="0.01">0.01 (Conservative / Slower)</option>
              <option value="0.05">0.05 (Optimal Balance)</option>
              <option value="0.10">0.10 (Fast Convergence)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              N_Estimators (Trees)
            </label>
            <select
              value={nEstimators}
              onChange={(e) => setNEstimators(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-2 bg-slate-50 text-slate-800"
            >
              <option value="250">250 Trees</option>
              <option value="450">450 Trees (Default)</option>
              <option value="800">800 Trees (Deep)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Max Tree Depth
            </label>
            <select
              value={maxDepth}
              onChange={(e) => setMaxDepth(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-md p-2 bg-slate-50 text-slate-800"
            >
              <option value="4">Depth 4 (Constrained)</option>
              <option value="6">Depth 6 (Default)</option>
              <option value="8">Depth 8 (High Interaction)</option>
            </select>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            Apply & Retrain Model
          </button>
        </div>
      </div>

      {/* Data Connectors */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          Enterprise Data Pipeline Connectors
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Status of telemetry streams feeding the predictive sales model
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <div>
                <span className="font-semibold text-slate-900 block">Omnichannel POS Transactions</span>
                <span className="text-slate-500 text-[11px]">4.2M records ingested | Frequency: Real-time via Apache Kafka</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Stream
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-4 h-4 text-slate-500" />
              <div>
                <span className="font-semibold text-slate-900 block">NOAA Meteorological Weather Feed</span>
                <span className="text-slate-500 text-[11px]">Next 14-day temperature & precipitation indices for store regions</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Synchronized
            </span>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="w-4 h-4 text-slate-500" />
              <div>
                <span className="font-semibold text-slate-900 block">ERP ERP/SAP Inventory Snapshot</span>
                <span className="text-slate-500 text-[11px]">Warehouse SKU availability updated today at 08:30 AM</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Up to date
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
