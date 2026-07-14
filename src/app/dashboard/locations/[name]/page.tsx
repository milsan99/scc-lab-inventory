import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function LocationViewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const devices = await prisma.device.findMany({
    where: { currentLocation: decodedName },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/locations" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Location: {decodedName}</h1>
          <p className="text-slate-400 mt-1">Showing {devices.length} items in this location</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/30">
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Tag / Serial</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Item</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Value (Rs.)</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No items found in {decodedName}.
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-primary-400">{device.tagNumber}</div>
                      {device.serialNumber && <div className="text-xs text-slate-500">SN: {device.serialNumber}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{device.deviceType}</div>
                      <div className="text-xs text-slate-400">{device.brand}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-medium">Rs. {device.marketValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        device.status === 'Working' ? 'bg-success-500/10 text-success-500 border-success-500/20' :
                        device.status === 'Broken' || device.status === 'Lost' ? 'bg-danger-500/10 text-red-400 border-danger-500/20' :
                        'bg-warning-500/10 text-warning-500 border-warning-500/20'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
