"use client";
import { useState } from "react";
import { MaintenanceLog } from "@prisma/client";

export default function MaintenanceManager({ deviceId, initialLogs }: { deviceId: string, initialLogs: MaintenanceLog[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/devices/${deviceId}/maintenance`, {
      method: "POST",
      body: JSON.stringify({ description, cost: parseFloat(cost) })
    });
    if (res.ok) {
      const newLog = await res.json();
      setLogs([newLog, ...logs]);
      setDescription("");
      setCost("");
    }
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Maintenance Logs</h2>
      <form onSubmit={handleAddLog} className="space-y-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700">
        <div>
          <label className="text-sm text-slate-300">Repair Description</label>
          <input required type="text" className="input-style mt-1" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-slate-300">Cost (Rs.)</label>
          <input required type="number" step="0.01" className="input-style mt-1" value={cost} onChange={e => setCost(e.target.value)} />
        </div>
        <button type="submit" className="btn-secondary w-full py-2 border border-slate-600">Add Log</button>
      </form>
      
      <div className="space-y-2 mt-4">
        {logs.map(l => (
          <div key={l.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex justify-between items-center">
            <div>
              <p className="text-white font-medium text-sm">{l.description}</p>
              <p className="text-xs text-slate-400">{new Date(l.date).toLocaleDateString()}</p>
            </div>
            <span className="font-bold text-red-400">Rs. {l.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
