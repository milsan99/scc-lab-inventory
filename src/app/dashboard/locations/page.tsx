import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export default async function LocationsPage() {
  const locations = await prisma.dropdownOption.findMany({
    where: { category: "LOCATION" },
    orderBy: { value: 'asc' }
  });

  const devices = await prisma.device.findMany();
  
  const getCount = (loc: string) => devices.filter(d => d.currentLocation === loc).length;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Locations</h1>
        <p className="text-slate-400 mt-1">Select a location to view its inventory</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(loc => (
          <Link key={loc.id} href={`/dashboard/locations/${encodeURIComponent(loc.value)}`}>
            <div className="glass p-6 rounded-2xl hover:bg-slate-800/50 transition-colors group cursor-pointer border border-slate-700/50 hover:border-primary-500/50">
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-500" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-white">{loc.value}</h3>
              <p className="text-slate-400 mt-1">{getCount(loc.value)} items recorded</p>
            </div>
          </Link>
        ))}
        {locations.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400 glass rounded-2xl">
            No locations have been added in the Settings yet.
          </div>
        )}
      </div>
    </div>
  );
}
