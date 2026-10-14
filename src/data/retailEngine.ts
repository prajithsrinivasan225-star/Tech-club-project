import {
  ModelParameters,
  SalesDataPoint,
  StorePrediction,
  InventoryItem,
  FeatureImportanceItem,
  AIInsight,
  ModelExecutionMetrics,
} from '../types/retail';

export const defaultParameters: ModelParameters = {
  horizon: '30d',
  algorithm: 'xgboost',
  scenario: 'baseline',
  promoDiscount: 15,
  adSpendMultiplier: 1.2,
  confidenceLevel: 90,
  includeSeasonality: true,
  weatherAdjustment: true,
};

// Base historical sales
const rawHistorical = [
  { date: 'Oct 2023', actual: 4200 },
  { date: 'Nov 2023', actual: 4800 },
  { date: 'Dec 2023', actual: 6100 },
  { date: 'Jan 2024', actual: 3800 },
  { date: 'Feb 2024', actual: 4100 },
  { date: 'Mar 2024', actual: 4500 },
  { date: 'Apr 2024', actual: 4700 },
];

export function generateForecastData(params: ModelParameters): SalesDataPoint[] {
  // Horizon determines how many future months/weeks we project
  let futureMonths = [
    { date: 'May 2024', base: 5100, seasonalFactor: 1.05 },
    { date: 'Jun 2024', base: 5400, seasonalFactor: 1.08 },
    { date: 'Jul 2024', base: 5800, seasonalFactor: 1.12 },
    { date: 'Aug 2024', base: 5600, seasonalFactor: 1.06 },
    { date: 'Sep 2024', base: 6200, seasonalFactor: 1.15 },
    { date: 'Oct 2024', base: 6450, seasonalFactor: 1.10 },
  ];

  if (params.horizon === '30d') {
    futureMonths = futureMonths.slice(0, 2);
  } else if (params.horizon === '60d') {
    futureMonths = futureMonths.slice(0, 3);
  } else if (params.horizon === '90d') {
    futureMonths = futureMonths.slice(0, 4);
  } else {
    // 180d
    futureMonths = futureMonths.slice(0, 6);
  }

  // Multiplier effects
  let scenarioFactor = 1.0;
  if (params.scenario === 'promo_surge') scenarioFactor = 1.14;
  else if (params.scenario === 'supply_strain') scenarioFactor = 0.91;
  else if (params.scenario === 'inflation_caution') scenarioFactor = 0.94;

  const promoFactor = 1 + (params.promoDiscount / 100) * 0.45;
  const adFactor = 1 + (params.adSpendMultiplier - 1) * 0.15;
  const weatherBonus = params.weatherAdjustment ? 1.02 : 1.0;
  const seasonalityBonus = params.includeSeasonality ? 1.0 : 0.96;

  // Algorithm variance
  const algoMultiplier =
    params.algorithm === 'ensemble'
      ? 1.01
      : params.algorithm === 'lightgbm'
      ? 0.99
      : params.algorithm === 'prophet'
      ? 0.985
      : 1.0;

  const totalMultiplier =
    scenarioFactor * promoFactor * adFactor * weatherBonus * seasonalityBonus * algoMultiplier;

  // Historical points
  const points: SalesDataPoint[] = rawHistorical.map((h, idx) => ({
    date: h.date,
    actual: h.actual,
    predicted: idx === rawHistorical.length - 1 ? Math.round(h.actual * 0.99) : null,
    p10Lower: null,
    p90Upper: null,
    baselineForecast: null,
  }));

  // Confidence margin (95% = wider band, 80% = narrower)
  const confidenceMarginFactor =
    params.confidenceLevel === 95 ? 0.08 : params.confidenceLevel === 90 ? 0.06 : 0.04;

  futureMonths.forEach((m) => {
    const rawPred = Math.round(m.base * totalMultiplier * (params.includeSeasonality ? m.seasonalFactor : 1));
    const spread = Math.round(rawPred * confidenceMarginFactor);
    points.push({
      date: m.date,
      actual: null,
      predicted: rawPred,
      p10Lower: rawPred - spread,
      p90Upper: rawPred + spread,
      baselineForecast: m.base,
    });
  });

  return points;
}

export function generateStorePredictions(params: ModelParameters): StorePrediction[] {
  const baseGrowthShift =
    params.scenario === 'promo_surge'
      ? 4.2
      : params.scenario === 'supply_strain'
      ? -5.5
      : params.scenario === 'inflation_caution'
      ? -2.8
      : 0;

  const promoBonus = (params.promoDiscount - 15) * 0.25;

  const stores = [
    {
      id: 'ST-001',
      name: 'Manhattan Flagship',
      location: 'New York, NY',
      region: 'North' as const,
      baseRev: 480000,
      baseGrowth: 12.5,
      confidence: 'High' as const,
      confidenceScore: 96,
      topCategory: 'Consumer Electronics',
      inventoryHealth: 'At Risk' as const,
    },
    {
      id: 'ST-002',
      name: 'Downtown LA Center',
      location: 'Los Angeles, CA',
      region: 'West' as const,
      baseRev: 395000,
      baseGrowth: 8.2,
      confidence: 'Medium' as const,
      confidenceScore: 88,
      topCategory: 'Apparel & Footwear',
      inventoryHealth: 'Healthy' as const,
    },
    {
      id: 'ST-003',
      name: 'Michigan Ave Store',
      location: 'Chicago, IL',
      region: 'Midwest' as const,
      baseRev: 310000,
      baseGrowth: -2.1,
      confidence: 'High' as const,
      confidenceScore: 92,
      topCategory: 'Home & Kitchen',
      inventoryHealth: 'Surplus' as const,
    },
    {
      id: 'ST-004',
      name: 'Galleria Mall Hub',
      location: 'Houston, TX',
      region: 'South' as const,
      baseRev: 360000,
      baseGrowth: 15.4,
      confidence: 'High' as const,
      confidenceScore: 94,
      topCategory: 'Sports & Outdoors',
      inventoryHealth: 'Healthy' as const,
    },
    {
      id: 'ST-005',
      name: 'Biltmore Fashion Park',
      location: 'Phoenix, AZ',
      region: 'West' as const,
      baseRev: 275000,
      baseGrowth: 5.0,
      confidence: 'Low' as const,
      confidenceScore: 78,
      topCategory: 'Health & Beauty',
      inventoryHealth: 'Healthy' as const,
    },
    {
      id: 'ST-006',
      name: 'Back Bay Urban',
      location: 'Boston, MA',
      region: 'East' as const,
      baseRev: 340000,
      baseGrowth: 9.8,
      confidence: 'High' as const,
      confidenceScore: 91,
      topCategory: 'Home Office',
      inventoryHealth: 'Surplus' as const,
    },
  ];

  return stores.map((s) => {
    const adjustedGrowth = +(s.baseGrowth + baseGrowthShift + promoBonus).toFixed(1);
    const projectedRev = Math.round(s.baseRev * (1 + adjustedGrowth / 100));
    let status: 'Optimal' | 'Review' | 'Action Required' = 'Optimal';

    if (adjustedGrowth < 0 || s.inventoryHealth === 'At Risk') {
      status = adjustedGrowth < -3 ? 'Action Required' : 'Review';
    } else if (adjustedGrowth >= 10) {
      status = 'Optimal';
    } else {
      status = 'Review';
    }

    return {
      id: s.id,
      name: s.name,
      location: s.location,
      region: s.region,
      currentMonthlyRevenue: s.baseRev,
      projectedRevenue: projectedRev,
      growthNum: adjustedGrowth,
      predictedGrowth: `${adjustedGrowth > 0 ? '+' : ''}${adjustedGrowth}%`,
      confidence: s.confidence,
      confidenceScore: s.confidenceScore,
      status,
      topCategory: s.topCategory,
      inventoryHealth: s.inventoryHealth,
    };
  });
}

export const defaultInventoryItems: InventoryItem[] = [
  {
    sku: 'SKU-ERG-902',
    productName: 'Ergonomic Task Chair Elite',
    category: 'Home Office',
    currentStock: 140,
    projectedDemand30d: 480,
    daysOfSupply: 9,
    reorderPoint: 220,
    riskLevel: 'Critical',
    suggestedAction: 'Immediate Stockout Risk! Reallocate 250 units from Boston Depot (ST-006).',
    transferSource: 'ST-006 (Boston)',
    transferTarget: 'ST-001 (New York)',
    unitsToTransfer: 250,
  },
  {
    sku: 'SKU-DISP-4K',
    productName: 'UltraFine 27" 4K Monitor',
    category: 'Consumer Electronics',
    currentStock: 320,
    projectedDemand30d: 390,
    daysOfSupply: 24,
    reorderPoint: 250,
    riskLevel: 'Warning',
    suggestedAction: 'Expedite supplier purchase order PO #8921 to arrive before promotional surge.',
    transferSource: 'Central Logistics Hub',
    transferTarget: 'ST-002 (Los Angeles)',
    unitsToTransfer: 120,
  },
  {
    sku: 'SKU-DSK-ADJ',
    productName: 'Dual-Motor Standing Desk Bamboo',
    category: 'Home Office',
    currentStock: 610,
    projectedDemand30d: 280,
    daysOfSupply: 65,
    reorderPoint: 180,
    riskLevel: 'Optimal',
    suggestedAction: 'Surplus inventory detected. Eligible for 10% bundle discount campaign.',
  },
  {
    sku: 'SKU-NC-HEADSET',
    productName: 'Pro-Acoustic Active ANC Headphones',
    category: 'Consumer Electronics',
    currentStock: 510,
    projectedDemand30d: 550,
    daysOfSupply: 28,
    reorderPoint: 300,
    riskLevel: 'Optimal',
    suggestedAction: 'Stock level balanced across all regional distribution fulfillment centers.',
  },
  {
    sku: 'SKU-THERM-WEAR',
    productName: 'Merino Thermal Layer Jacket',
    category: 'Apparel & Footwear',
    currentStock: 80,
    projectedDemand30d: 290,
    daysOfSupply: 8,
    reorderPoint: 150,
    riskLevel: 'Critical',
    suggestedAction: 'Midwest cold front detected (+34% velocity). Reorder 300 units immediately.',
    transferSource: 'ST-003 (Chicago)',
    transferTarget: 'ST-004 (Houston)',
    unitsToTransfer: 100,
  },
];

export function getFeatureImportance(params: ModelParameters): FeatureImportanceItem[] {
  return [
    {
      feature: 'Historical Sales Seasonality',
      importance: params.includeSeasonality ? 88 : 35,
      category: 'Seasonal',
      impact: 'Positive',
    },
    {
      feature: 'Promotional Depth & Markdown %',
      importance: Math.min(95, Math.round(50 + params.promoDiscount * 1.1)),
      category: 'Marketing',
      impact: 'Positive',
    },
    {
      feature: 'Competitor Price Index (CPI)',
      importance: params.scenario === 'inflation_caution' ? 82 : 64,
      category: 'Macro',
      impact: 'Negative',
    },
    {
      feature: 'Local Weather & Cold Waves',
      importance: params.weatherAdjustment ? 56 : 18,
      category: 'Seasonal',
      impact: 'Positive',
    },
    {
      feature: 'Digital Ad Spend Multiplier',
      importance: Math.round(35 * params.adSpendMultiplier),
      category: 'Marketing',
      impact: 'Positive',
    },
    {
      feature: 'Supply Lead Time Volatility',
      importance: params.scenario === 'supply_strain' ? 84 : 32,
      category: 'Operations',
      impact: 'Volatile',
    },
  ];
}

export function getAIInsights(params: ModelParameters): AIInsight[] {
  const insights: AIInsight[] = [
    {
      id: 'ins-1',
      title: 'Stock-out Risk: North & Metro Hubs',
      category: 'Inventory',
      type: 'critical',
      description:
        'Projected demand for Home Office & Ergonomic Chairs exceeds current supply by 22% in Week 46. Reallocate 250 units from Boston depot.',
      financialImpact: '+$48,500 Protected Revenue',
      status: 'active',
    },
    {
      id: 'ins-2',
      title: 'Promotional Elasticity Sweet Spot',
      category: 'Promotion',
      type: 'opportunity',
      description: `Current promo discount of ${params.promoDiscount}% maximizes sales volume while maintaining a 34.2% gross margin floor. Increasing above 25% degrades net profitability.`,
      financialImpact: '+$31,200 Margin Optimization',
      status: 'active',
    },
    {
      id: 'ins-3',
      title: 'Midwest Regional Weather Spike',
      category: 'Weather',
      type: 'informational',
      description:
        'Temperature forecast in Great Lakes region is 6°F below historical averages. Projected winter apparel demand upgraded by +$45k.',
      financialImpact: '+$45,000 Volume Lift',
      status: 'active',
    },
  ];

  if (params.scenario === 'supply_strain') {
    insights.unshift({
      id: 'ins-supply',
      title: 'Supply Chain Friction Alert',
      category: 'Inventory',
      type: 'critical',
      description:
        'Overseas port congestion has increased average lead time by 12 days. Safety stock levels need immediate +18% buffer.',
      financialImpact: '-$62,000 Potential Backorder Cost',
      status: 'active',
    });
  }

  return insights;
}

export function getExecutionMetrics(
  params: ModelParameters,
  executionCount: number
): ModelExecutionMetrics {
  const algoMap = {
    xgboost: { name: 'XGBoost Regressor v4.2', rmse: 0.042, mape: 3.4, r2: 0.96 },
    lightgbm: { name: 'LightGBM Ensemble v3.1', rmse: 0.045, mape: 3.7, r2: 0.95 },
    prophet: { name: 'Facebook Prophet + Regressors', rmse: 0.051, mape: 4.2, r2: 0.92 },
    ensemble: { name: 'Hybrid Blended Stacking (XGB+LSTM)', rmse: 0.038, mape: 2.8, r2: 0.98 },
  };

  const selected = algoMap[params.algorithm];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    algorithm: selected.name,
    rmse: selected.rmse,
    mape: selected.mape,
    r2: selected.r2,
    dataPointsProcessed: `${(4.2 + (executionCount % 5) * 0.1).toFixed(1)}M`,
    trainingTimeSec: +(1.2 + (params.algorithm === 'ensemble' ? 0.8 : 0.2)).toFixed(1),
    lastExecutedAt: `Today, ${timeStr}`,
    status: 'completed',
  };
}

// Export utilities
export function exportToCSV(
  forecastData: SalesDataPoint[],
  stores: StorePrediction[],
  params: ModelParameters
): void {
  const headers = ['Date', 'Historical Actual ($k)', 'Predicted Sales ($k)', 'P10 Lower Bound ($k)', 'P90 Upper Bound ($k)', 'Baseline Trend ($k)'];
  const rows = forecastData.map((d) => [
    d.date,
    d.actual !== null ? d.actual : '',
    d.predicted !== null ? d.predicted : '',
    d.p10Lower !== null ? d.p10Lower : '',
    d.p90Upper !== null ? d.p90Upper : '',
    d.baselineForecast !== null ? d.baselineForecast : '',
  ]);

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += `# Vanguard Retail Predictive Sales Model - Forecast Report\n`;
  csvContent += `# Generated: ${new Date().toISOString()}\n`;
  csvContent += `# Horizon: ${params.horizon} | Algorithm: ${params.algorithm} | Scenario: ${params.scenario}\n`;
  csvContent += `# Promo Discount: ${params.promoDiscount}% | Ad Spend Multiplier: ${params.adSpendMultiplier}x\n\n`;

  csvContent += '--- TIME SERIES PROJECTIONS ---\n';
  csvContent += headers.join(',') + '\n';
  rows.forEach((r) => {
    csvContent += r.join(',') + '\n';
  });

  csvContent += '\n--- STORE LEVEL FORECAST SUMMARY ---\n';
  csvContent += 'Store ID,Name,Location,Region,Current Revenue ($),Projected Revenue ($),Predicted Growth,Confidence,Status\n';
  stores.forEach((s) => {
    csvContent += `"${s.id}","${s.name}","${s.location}","${s.region}",${s.currentMonthlyRevenue},${s.projectedRevenue},"${s.predictedGrowth}","${s.confidence}","${s.status}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `retail_sales_forecast_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(
  forecastData: SalesDataPoint[],
  stores: StorePrediction[],
  inventory: InventoryItem[],
  params: ModelParameters,
  metrics: ModelExecutionMetrics
): void {
  const exportPayload = {
    metadata: {
      reportTitle: 'RetailPredict AI - Predictive Analysis & Forecast Model Report',
      generatedAt: new Date().toISOString(),
      version: 'v2.4-production',
      parameters: params,
      modelMetrics: metrics,
    },
    salesForecastSeries: forecastData,
    storeLevelForecasts: stores,
    inventoryAllocationRecommendations: inventory,
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `retail_sales_forecast_model_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateTextBriefing(
  forecastData: SalesDataPoint[],
  stores: StorePrediction[],
  params: ModelParameters,
  metrics: ModelExecutionMetrics
): string {
  const futurePoints = forecastData.filter((d) => d.predicted !== null);
  const totalPredictedNextMonth = futurePoints.length > 0 ? futurePoints[0].predicted : 0;
  const topStore = [...stores].sort((a, b) => b.growthNum - a.growthNum)[0];
  const atRiskStores = stores.filter((s) => s.status === 'Action Required' || s.status === 'Review');

  return `=======================================================
RETAILPREDICT AI - EXECUTIVE SALES FORECAST BRIEFING
Date: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
=======================================================

MODEL CONFIGURATION:
- Engine: ${metrics.algorithm}
- Horizon: ${params.horizon.toUpperCase()}
- Scenario Mode: ${params.scenario.toUpperCase().replace('_', ' ')}
- Promotion Depth: ${params.promoDiscount}% | Ad Spend: ${params.adSpendMultiplier}x
- Accuracy Metrics: RMSE: ${metrics.rmse} | MAPE: ${metrics.mape}% | R²: ${metrics.r2}

KEY FINANCIAL PROJECTIONS:
- Next Month Projected Sales: $${((totalPredictedNextMonth || 0) * 1000).toLocaleString()} (Across all chains)
- Model Confidence Index: ${params.confidenceLevel}% Confidence Corridor
- Top Performing Unit: ${topStore ? `${topStore.name} (${topStore.location}) with ${topStore.predictedGrowth} growth` : 'N/A'}
- Locations Needing Action: ${atRiskStores.length} store(s) flagged for inventory/promotional review

CRITICAL RECOMMENDATIONS:
1. Reallocate 250 units of Ergonomic Chairs to North Region before Week 46 stockout.
2. Maintain promotional ceiling at ${params.promoDiscount}% to preserve 34.2% gross margin floor.
3. Capitalize on cold-weather apparel surge (+14% demand lift in Midwest).

Generated by RetailPredict AI Engine v2.4
`;
}
