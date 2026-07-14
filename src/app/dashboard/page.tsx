import { prisma } from "@/lib/prisma";
import { Monitor, AlertTriangle, CheckCircle, Package } from "lucide-react";
import DashboardCharts from "@/components/DashboardCharts";
import CategoryBreakdown from "@/components/CategoryBreakdown";

export default async function DashboardOverview() {
  const devices = await prisma.device.findMany();
  
  const totalValue = devices.reduce((sum, d) => sum + d.marketValue, 0);
  const working = devices.filter(d => d.status === "Working").length;
  const issues = devices.filter(d => d.status === "Under Repair" || d.status === "Broken").length;


  // Group by device type
  const typeCounts = devices.reduce((acc, device) => {
    acc[device.deviceType] = (acc[device.deviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-slate-400 mt-1">Summary of the ICT Lab Inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-l-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Items</p>
              <h3 className="text-3xl font-bold text-white">{devices.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-l-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Value</p>
              <h3 className="text-3xl font-bold text-white">Rs. {totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-500/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-success-500" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-l-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Working</p>
              <h3 className="text-3xl font-bold text-white">{working}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-500" />
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-l-4 border-l-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Needs Attention</p>
              <h3 className="text-3xl font-bold text-white">{issues}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning-500" />
            </div>
          </div>
        </div>
      </div>
      
      <CategoryBreakdown devices={devices} />

      <DashboardCharts working={working} broken={issues} typeCounts={typeCounts} />
    </div>
  );
}
