import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BorrowManager from "@/components/BorrowManager";
import MaintenanceManager from "@/components/MaintenanceManager";
import QRCodeBlock from "@/components/QRCodeBlock";

export default async function DeviceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const device = await prisma.device.findUnique({
    where: { id },
    include: {
      borrows: { orderBy: { createdAt: 'desc' } },
      maintenance: { orderBy: { date: 'desc' } }
    }
  });

  if (!device) notFound();

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{device.tagNumber}</h1>
          <p className="text-slate-400 mt-1">{device.deviceType} - {device.brand} ({device.itemCategory})</p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-slate-800 text-sm border border-slate-700">Status: {device.status}</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-sm border border-slate-700">Location: {device.currentLocation}</span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-sm border border-slate-700">Value: Rs. {device.marketValue}</span>
          </div>
        </div>
        
        <QRCodeBlock id={device.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BorrowManager deviceId={device.id} initialBorrows={device.borrows} />
        <MaintenanceManager deviceId={device.id} initialLogs={device.maintenance} />
      </div>
    </div>
  );
}
