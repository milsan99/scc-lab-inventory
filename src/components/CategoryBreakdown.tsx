"use client";
import { useState } from "react";
import { Cpu, Archive, X } from "lucide-react";
import { Device } from "@prisma/client";

export default function CategoryBreakdown({ devices }: { devices: Device[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const electronics = devices.filter(d => d.itemCategory === "Electronic Appliance");
  const nonElectronics = devices.filter(d => d.itemCategory === "Non-Electronic Item");

  const getCountsByType = (items: Device[]) => {
    return items.reduce((acc, device) => {
      acc[device.deviceType] = (acc[device.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const selectedItems = selectedCategory === "Electronic Appliance" ? electronics : nonElectronics;
  const breakdown = selectedCategory ? getCountsByType(selectedItems) : {};

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setSelectedCategory("Electronic Appliance")}
          className="glass p-6 rounded-2xl flex items-center gap-4 text-left hover:bg-slate-800/80 transition-colors border border-transparent hover:border-primary-500/30"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{electronics.length}</h3>
            <p className="text-slate-400 text-sm">Electronic Appliances</p>
          </div>
        </button>
        <button 
          onClick={() => setSelectedCategory("Non-Electronic Item")}
          className="glass p-6 rounded-2xl flex items-center gap-4 text-left hover:bg-slate-800/80 transition-colors border border-transparent hover:border-primary-500/30"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <Archive className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{nonElectronics.length}</h3>
            <p className="text-slate-400 text-sm">Non-Electronic Items</p>
          </div>
        </button>
      </div>

      {selectedCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{selectedCategory} Breakdown</h2>
              <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {Object.keys(breakdown).length === 0 ? (
                <p className="text-slate-400 text-center py-4">No items found in this category.</p>
              ) : (
                Object.entries(breakdown).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <span className="text-white font-medium">{type}</span>
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg font-bold">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
