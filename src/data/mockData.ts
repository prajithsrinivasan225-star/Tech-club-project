export const salesData = [
  { date: '2023-10', actual: 4200, predicted: null },
  { date: '2023-11', actual: 4800, predicted: null },
  { date: '2023-12', actual: 6100, predicted: null },
  { date: '2024-01', actual: 3800, predicted: null },
  { date: '2024-02', actual: 4100, predicted: null },
  { date: '2024-03', actual: 4500, predicted: null },
  { date: '2024-04', actual: 4700, predicted: 4650 },
  { date: '2024-05', actual: null, predicted: 5100 },
  { date: '2024-06', actual: null, predicted: 5400 },
  { date: '2024-07', actual: null, predicted: 5800 },
  { date: '2024-08', actual: null, predicted: 5600 },
  { date: '2024-09', actual: null, predicted: 6200 },
];

export const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Apparel', value: 25 },
  { name: 'Home & Garden', value: 20 },
  { name: 'Grocery', value: 15 },
  { name: 'Other', value: 5 },
];

export const featureImportance = [
  { feature: 'Seasonality', importance: 85 },
  { feature: 'Promotions', importance: 72 },
  { feature: 'Competitor Pricing', importance: 64 },
  { feature: 'Weather', importance: 45 },
  { feature: 'Local Events', importance: 30 },
];

export const storePredictions = [
  { id: 'ST-001', location: 'New York, NY', predictedGrowth: '+12.5%', confidence: 'High', status: 'Optimal' },
  { id: 'ST-002', location: 'Los Angeles, CA', predictedGrowth: '+8.2%', confidence: 'Medium', status: 'Review' },
  { id: 'ST-003', location: 'Chicago, IL', predictedGrowth: '-2.1%', confidence: 'High', status: 'Action Required' },
  { id: 'ST-004', location: 'Houston, TX', predictedGrowth: '+15.4%', confidence: 'High', status: 'Optimal' },
  { id: 'ST-005', location: 'Phoenix, AZ', predictedGrowth: '+5.0%', confidence: 'Low', status: 'Review' },
];
