export type ForecastHorizon = '30d' | '60d' | '90d' | '180d';

export type ModelAlgorithm = 'xgboost' | 'lightgbm' | 'prophet' | 'ensemble';

export type MacroScenario = 'baseline' | 'promo_surge' | 'supply_strain' | 'inflation_caution';

export interface ModelParameters {
  horizon: ForecastHorizon;
  algorithm: ModelAlgorithm;
  scenario: MacroScenario;
  promoDiscount: number; // 0 to 40%
  adSpendMultiplier: number; // 0.5 to 2.5
  confidenceLevel: number; // 80, 90, 95
  includeSeasonality: boolean;
  weatherAdjustment: boolean;
}

export interface SalesDataPoint {
  date: string;
  actual: number | null;
  predicted: number | null;
  p10Lower?: number | null;
  p90Upper?: number | null;
  baselineForecast?: number | null;
  notes?: string;
}

export interface StorePrediction {
  id: string;
  name: string;
  location: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Midwest';
  currentMonthlyRevenue: number;
  projectedRevenue: number;
  predictedGrowth: string;
  growthNum: number;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  status: 'Optimal' | 'Review' | 'Action Required';
  topCategory: string;
  inventoryHealth: 'Healthy' | 'At Risk' | 'Surplus';
}

export interface InventoryItem {
  sku: string;
  productName: string;
  category: string;
  currentStock: number;
  projectedDemand30d: number;
  daysOfSupply: number;
  reorderPoint: number;
  riskLevel: 'Critical' | 'Warning' | 'Optimal';
  suggestedAction: string;
  transferSource?: string;
  transferTarget?: string;
  unitsToTransfer?: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  category: 'Macro' | 'Marketing' | 'Operations' | 'Seasonal';
  impact: 'Positive' | 'Negative' | 'Volatile';
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'Inventory' | 'Promotion' | 'Weather' | 'Pricing';
  type: 'critical' | 'opportunity' | 'informational';
  description: string;
  financialImpact: string;
  status: 'active' | 'applied' | 'dismissed';
}

export interface ModelExecutionMetrics {
  algorithm: string;
  rmse: number;
  mape: number;
  r2: number;
  dataPointsProcessed: string;
  trainingTimeSec: number;
  lastExecutedAt: string;
  status: 'idle' | 'running' | 'completed' | 'error';
}
