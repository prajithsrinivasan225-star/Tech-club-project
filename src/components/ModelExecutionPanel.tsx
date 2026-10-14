import React from 'react';
import {
  Play,
  RotateCw,
  Sliders,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  ForecastHorizon,
  ModelAlgorithm,
  MacroScenario,
  ModelParameters,
  ModelExecutionMetrics,
} from '../types/retail';

interface ModelExecutionPanelProps {
  params: ModelParameters;
  onParamsChange: (newParams: ModelParameters) => void;
  onExecute: () => void;
  isExecuting: boolean;
  executionStep: string;
  executionProgress: number;
  metrics: ModelExecutionMetrics;
}

export default function ModelExecutionPanel({
  params,
  onParamsChange,
  onExecute,
  isExecuting,
  executionStep,
  executionProgress,
  metrics,
}: ModelExecutionPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-600" />
              Forecast Execution Engine
            </h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {metrics.algorithm.split(' ')[0]}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate scenario levers, adjust promotional and macro variables, then trigger a model execution run.
          </p>
        </div>

        {/* Execution Trigger Button */}
        <div className="flex items-center gap-3">
          {isExecuting ? (
            <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-md text-xs font-semibold shadow-xs">
              <RotateCw className="w-4 h-4 animate-spin text-blue-400" />
              <div className="flex flex-col">
                <span>Executing Forecast... ({executionProgress}%)</span>
                <span className="text-[10px] text-slate-400 font-normal">{executionStep}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={onExecute}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-bold rounded-md shadow-xs transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Execute Model Run
            </button>
          )}
        </div>
      </div>

      {/* Execution Progress Bar when active */}
      {isExecuting && (
        <div className="mt-4 pt-1">
          <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
              {executionStep}
            </span>
            <span>{executionProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${executionProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Parameter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        {/* Forecast Horizon */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Forecast Horizon
          </label>
          <select
            value={params.horizon}
            onChange={(e) => onParamsChange({ ...params, horizon: e.target.value as ForecastHorizon })}
            disabled={isExecuting}
            aria-label="Forecast Horizon"
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="30d">30 Days (Short-term)</option>
            <option value="60d">60 Days (Mid-term)</option>
            <option value="90d">90 Days (Quarterly)</option>
            <option value="180d">180 Days (Half-year)</option>
          </select>
        </div>

        {/* Algorithm */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            ML Algorithm
          </label>
          <select
            value={params.algorithm}
            onChange={(e) => onParamsChange({ ...params, algorithm: e.target.value as ModelAlgorithm })}
            disabled={isExecuting}
            aria-label="ML Algorithm"
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="xgboost">XGBoost Regressor v4.2</option>
            <option value="lightgbm">LightGBM Fast Trees</option>
            <option value="prophet">Facebook Prophet Seasonality</option>
            <option value="ensemble">Hybrid Blended Ensemble</option>
          </select>
        </div>

        {/* Macro Scenario */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Macro Scenario
          </label>
          <select
            value={params.scenario}
            onChange={(e) => onParamsChange({ ...params, scenario: e.target.value as MacroScenario })}
            disabled={isExecuting}
            aria-label="Macro Scenario"
            className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="baseline">Baseline (Standard)</option>
            <option value="promo_surge">Promotional Surge (+14%)</option>
            <option value="supply_strain">Supply Chain Strain (-9%)</option>
            <option value="inflation_caution">High Inflation Drag (-6%)</option>
          </select>
        </div>

        {/* Promo Markdown Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Promo Discount
            </label>
            <span className="text-xs font-bold text-blue-600">{params.promoDiscount}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={35}
            step={5}
            value={params.promoDiscount}
            onChange={(e) => onParamsChange({ ...params, promoDiscount: Number(e.target.value) })}
            disabled={isExecuting}
            aria-label="Promo Discount"
            className="w-full accent-blue-600 cursor-pointer disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>0%</span>
            <span>15%</span>
            <span>35%</span>
          </div>
        </div>

        {/* Ad Spend Multiplier Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Ad Spend Multiplier
            </label>
            <span className="text-xs font-bold text-blue-600">{params.adSpendMultiplier}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.5}
            step={0.1}
            value={params.adSpendMultiplier}
            onChange={(e) => onParamsChange({ ...params, adSpendMultiplier: Number(e.target.value) })}
            disabled={isExecuting}
            aria-label="Ad Spend Multiplier"
            className="w-full accent-blue-600 cursor-pointer disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>0.5x</span>
            <span>1.2x</span>
            <span>2.5x</span>
          </div>
        </div>

        {/* Confidence Level */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Confidence Interval
          </label>
          <div className="flex gap-1.5">
            {[80, 90, 95].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onParamsChange({ ...params, confidenceLevel: lvl })}
                disabled={isExecuting}
                className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-colors ${
                  params.confidenceLevel === lvl
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {params.confidenceLevel === 95 ? 'Conservative P10-P90' : 'Expected Range'}
          </span>
        </div>
      </div>
    </div>
  );
}
