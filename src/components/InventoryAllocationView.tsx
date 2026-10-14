import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  TrendingDown,
  Truck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { InventoryItem, StorePrediction } from '../types/retail';

interface InventoryAllocationViewProps {
  inventory: InventoryItem[];
  stores: StorePrediction[];
  onApproveTransfer: (sku: string) => void;
}

export default function InventoryAllocationView({
  inventory,
  stores,
  onApproveTransfer,
}: InventoryAllocationViewProps) {
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [transferredSkus, setTransferredSkus] = useState<Record<string, boolean>>({});

  const handleTransfer = (sku: string) => {
    setTransferredSkus((prev) => ({ ...prev, [sku]: true }));
    onApproveTransfer(sku);
  };

  const filteredItems = inventory.filter((item) => {
    const matchesRisk = filterRisk === 'all' || item.riskLevel.toLowerCase() === filterRisk.toLowerCase();
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const criticalCount = inventory.filter((i) => i.riskLevel === 'Critical').length;
  const warningCount = inventory.filter((i) => i.riskLevel === 'Warning').length;

  return (
    <div className="space-y-6">
      {/* Risk Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded text-amber-700 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">
              Supply Vulnerability Detected: {criticalCount} SKU(s) Face Imminent Stockout
            </h4>
            <p className="text-xs text-amber-800 mt-0.5">
              Predicted demand exceeds safety stock threshold. Immediate inventory transfer or emergency reorder is required to avoid an estimated $48.5k in lost sales.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 bg-amber-200/60 text-amber-900 rounded">
            {warningCount} Moderate Risk SKUs
          </span>
        </div>
      </div>

      {/* Recommended Inter-Store Reallocations */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Automated Inter-Store Inventory Rebalancing
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Machine learning algorithms pair surplus stores with stockout-threatened regions to optimize freight routing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventory
            .filter((item) => item.transferSource && item.transferTarget)
            .map((item) => {
              const isTransferred = transferredSkus[item.sku];
              return (
                <div
                  key={item.sku}
                  className={`p-4 rounded-lg border transition-all ${
                    isTransferred
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50/60 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-mono text-slate-500">{item.sku}</span>
                      <h4 className="text-sm font-semibold text-slate-900">{item.productName}</h4>
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isTransferred
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isTransferred ? 'Reallocation Dispatched' : 'Urgent Transfer'}
                    </span>
                  </div>

                  <div className="my-3 py-2 px-3 bg-white rounded border border-slate-200 flex items-center justify-between text-xs">
                    <div className="text-slate-600">
                      <span className="text-[10px] text-slate-400 block uppercase">Source (Surplus)</span>
                      <strong className="text-slate-800">{item.transferSource}</strong>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-bold">
                      <ArrowRight className="w-4 h-4" />
                      <span>{item.unitsToTransfer} units</span>
                    </div>
                    <div className="text-slate-600 text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Destination (Deficit)</span>
                      <strong className="text-slate-800">{item.transferTarget}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      ETA: 2 business days via Regional Ground
                    </span>
                    <button
                      onClick={() => handleTransfer(item.sku)}
                      disabled={isTransferred}
                      className={`text-xs font-semibold px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                        isTransferred
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isTransferred ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Queued
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="w-3.5 h-3.5" /> Approve Transfer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Full SKU Inventory Health Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">SKU-Level Demand & Supply Balance</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              30-day forecast consumption vs available warehouse and store shelf inventory
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search SKU or Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-3 py-1.5 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-44"
            />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              aria-label="Filter risk level"
              className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical (&lt;10d)</option>
              <option value="warning">Warning (10-25d)</option>
              <option value="optimal">Optimal (&gt;25d)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">SKU / Item</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold text-right">On-Hand Stock</th>
                <th className="px-4 py-3 font-semibold text-right">30d Forecast Demand</th>
                <th className="px-4 py-3 font-semibold text-center">Days of Supply</th>
                <th className="px-4 py-3 font-semibold">Health Status</th>
                <th className="px-4 py-3 font-semibold">AI Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.productName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 font-semibold text-right text-slate-800">
                    {item.currentStock.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-right text-blue-600">
                    {item.projectedDemand30d.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold font-mono text-[11px] ${
                        item.daysOfSupply < 12
                          ? 'bg-rose-100 text-rose-800'
                          : item.daysOfSupply < 25
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.daysOfSupply}d
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        item.riskLevel === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.riskLevel === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-[11px] max-w-xs">
                    {item.suggestedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
