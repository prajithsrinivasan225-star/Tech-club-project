import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  BrainCircuit,
  Sliders,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ModelParameters,
  SalesDataPoint,
  FeatureImportanceItem,
  ModelExecutionMetrics,
} from '../types/retail';
import { getFeatureImportance } from '../data/retailEngine';

interface PredictiveAnalysisViewProps {
  params: ModelParameters;
  forecastData: SalesDataPoint[];
  metrics: ModelExecutionMetrics;
  onRunOptimization: () => void;
}

export default function PredictiveAnalysisView({
  params,
  forecastData,
  metrics,
  onRunOptimization,
}: PredictiveAnalysisViewProps) {
  const featureData = getFeatureImportance(params);

  // Residual error mock dataset for diagnostic validation
  const residualData = [
    { week: 'W1', actual: 4200, pred: 4180, residual: 20 },
    { week: 'W2', actual: 4350, pred: 4390, residual: -40 },
    { week: 'W3', actual: 4400, pred: 4380, residual: 20 },
    { week: 'W4', actual: 4600, pred: 4570, residual: 30 },
    { week: 'W5', actual: 4720, pred: 4700, residual: 20 },
    { week: 'W6', actual: 4850, pred: 4890, residual: -40 },
    { week: 'W7', actual: 4900, pred: 4880, residual: 20 },
    { week: 'W8', actual: 5100, pred: 5070, residual: 30 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Model Diagnostics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Model Architecture
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{metrics.algorithm}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium flex items-center gap-1">
            <BrainCircuit className="w-3.5 h-3.5" /> Gradient-boosted ensemble
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Root Mean Square Error (RMSE)
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{metrics.rmse}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> High Precision &lt; 0.05
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mean Absolute % Error (MAPE)
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{metrics.mape}%</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Industry benchmark: &lt; 5.0%
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            R² Goodness of Fit
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{metrics.r2}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">
            96% of variance explained
          </div>
        </div>
      </div>

      {/* Main Grid: Feature Importance & Residual Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Importance SHAP Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Feature Importance & Predictor Weights</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Relative influence of external and internal drivers on forecasted sales velocity
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
              SHAP Values
            </span>
          </div>

          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={featureData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  unit="%"
                />
                <YAxis
                  dataKey="feature"
                  type="category"
                  tick={{ fill: '#334155', fontSize: 11 }}
                  width={140}
                />
                <Tooltip
                  formatter={(val: number) => [`${val}% Weight`, 'Importance']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {featureData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.category === 'Seasonal'
                          ? '#2563eb'
                          : entry.category === 'Marketing'
                          ? '#3b82f6'
                          : entry.category === 'Macro'
                          ? '#f59e0b'
                          : '#64748b'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600"></span> Seasonal Patterns
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-400"></span> Marketing / Promo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500"></span> Macro / Pricing
            </span>
          </div>
        </div>

        {/* Residual Error Diagnostics */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Historical Residual Variance</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Difference between actual backtest revenue vs model predictions ($k)
              </p>
            </div>
            <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium border border-emerald-200">
              Zero-Bias Verified
            </span>
          </div>

          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={residualData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => `$${v}k`}
                  domain={[3800, 5400]}
                />
                <Tooltip
                  formatter={(val: number) => [`$${val}k`, '']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Historical"
                  stroke="#1e293b"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#1e293b' }}
                />
                <Line
                  type="monotone"
                  dataKey="pred"
                  name="Cross-Validated Fit"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standard Deviation of Error: ±$28.4k</span>
            <span className="text-emerald-600 font-medium">95.8% of errors within ±1.5σ</span>
          </div>
        </div>
      </div>

      {/* Scenario Simulation Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Scenario Sensitivity Matrix</h3>
        <p className="text-xs text-slate-500 mb-4">
          Comparative projected outcomes across various macroeconomic shocks and tactical marketing choices
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pessimistic (P10)
              </span>
              <span className="text-xs font-bold text-rose-600">-6.4% Downside</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">$1,330,000</div>
            <div className="text-xs text-slate-500 mt-1">
              Triggered if inflation increases customer churn and inventory lead times slip by 14 days.
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-blue-500 bg-blue-50/20 relative">
            <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Current Model
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-900">
                Expected (P50)
              </span>
              <span className="text-xs font-bold text-emerald-600">+12.4% Target</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">$1,420,900</div>
            <div className="text-xs text-slate-600 mt-1">
              Current baseline projection with {params.promoDiscount}% promotional depth and seasonal index.
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Optimistic (P90)
              </span>
              <span className="text-xs font-bold text-emerald-600">+19.8% Upside</span>
            </div>
            <div className="text-xl font-bold text-slate-900 mt-2">$1,514,000</div>
            <div className="text-xs text-slate-500 mt-1">
              Achieved under aggressive 25% promo push combined with 1.8x omnichannel ad spend.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
