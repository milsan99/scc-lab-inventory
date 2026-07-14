"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { DropdownOption } from "@prisma/client";

export default function SettingsManager() {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [newValue, setNewValue] = useState("");
  const [category, setCategory] = useState("DEVICE_TYPE");

  const fetchOptions = async () => {
    try {
      const res = await fetch("/api/options");
      if (res.ok) {
        const data = await res.json();
        setOptions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    const res = await fetch("/api/options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, value: newValue.trim() }),
    });

    if (res.ok) {
      setNewValue("");
      fetchOptions();
    } else {
      alert("Error adding option. It might already exist.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this option?")) {
      await fetch(`/api/options/${id}`, { method: "DELETE" });
      fetchOptions();
    }
  };

  const renderList = (cat: string) => {
    const list = options.filter((o) => o.category === cat);
    return (
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white mb-4">{cat.replace("_", " ")}</h3>
        {list.length === 0 ? (
          <p className="text-sm text-slate-500">No options added yet.</p>
        ) : (
          <ul className="space-y-2">
            {list.map((o) => (
              <li key={o.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-slate-300">{o.value}</span>
                <button onClick={() => handleDelete(o.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="glass p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm text-slate-300">Category</label>
          <select className="input-style bg-slate-800" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="DEVICE_TYPE">Device Type</option>
            <option value="BRAND">Brand</option>
            <option value="LOCATION">Location</option>
          </select>
        </div>
        <div className="flex-1 w-full space-y-2">
          <label className="text-sm text-slate-300">New Value</label>
          <input required className="input-style" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="e.g. Monitor" />
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto h-[50px] px-6">
          <Plus className="w-5 h-5" /> Add
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderList("DEVICE_TYPE")}
          {renderList("BRAND")}
          {renderList("LOCATION")}
        </div>
      )}
    </div>
  );
}
