"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Search, QrCode, ChevronDown, ChevronUp, Calendar, DollarSign, Package, Settings, MapPin } from "lucide-react";
import Link from "next/link";
import { Device, DropdownOption } from "@prisma/client";

export default function InventoryManager() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // UI State
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tagNumber: "",
    itemCategory: "Electronic Appliance",
    serialNumber: "",
    deviceType: "",
    brand: "",
    marketValue: "",
    receivedDate: new Date().toISOString().split('T')[0],
    receivedFrom: "",
    status: "Working",
    currentLocation: "",
    quantity: 1
  });

  const fetchData = async () => {
    try {
      const [devRes, optRes] = await Promise.all([
        fetch("/api/devices"),
        fetch("/api/options")
      ]);
      if (devRes.ok) setDevices(await devRes.json());
      if (optRes.ok) setOptions(await optRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (device?: Device) => {
    if (device) {
      setEditingId(device.id);
      setFormData({
        tagNumber: device.tagNumber,
        itemCategory: device.itemCategory || "Electronic Appliance",
        serialNumber: device.serialNumber || "",
        deviceType: device.deviceType,
        brand: device.brand,
        marketValue: device.marketValue.toString(),
        receivedDate: new Date(device.receivedDate).toISOString().split('T')[0],
        receivedFrom: device.receivedFrom,
        status: device.status,
        currentLocation: device.currentLocation,
        quantity: 1
      });
      setShowAdvancedDetails(false);
    } else {
      setEditingId(null);
      setFormData({
        tagNumber: "",
        itemCategory: "Electronic Appliance",
        serialNumber: "",
        deviceType: "",
        brand: "",
        marketValue: "",
        receivedDate: new Date().toISOString().split('T')[0],
        receivedFrom: "",
        status: "Working",
        currentLocation: "",
        quantity: 1
      });
      setShowAdvancedDetails(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/devices/${editingId}` : "/api/devices";
    const method = editingId ? "PUT" : "POST";

    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity.toString(), 10)
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchData();
    } else {
      alert("Error saving device. If the Tag Number is already used, please use a unique Tag Number.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await fetch(`/api/devices/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const filteredDevices = devices.filter(d => 
    d.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
    d.deviceType.toLowerCase().includes(search.toLowerCase()) ||
    d.brand.toLowerCase().includes(search.toLowerCase()) ||
    (d.serialNumber && d.serialNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const deviceTypes = options.filter(o => o.category === "DEVICE_TYPE");
  const brands = options.filter(o => o.category === "BRAND");
  const locations = options.filter(o => o.category === "LOCATION");

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/50 shadow-inner">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-2.5 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none text-slate-200 transition-all shadow-inner placeholder:text-slate-600"
            placeholder="Search by tag, serial, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary w-full sm:w-auto shadow-primary-500/20 shadow-lg">
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Main Table Section */}
      <div className="glass rounded-2xl overflow-hidden border border-slate-700/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-700/50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tag / ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500 font-medium">
                    No matching items found in the inventory.
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => {
                  const isExpanded = expandedRowId === device.id;
                  
                  return (
                    <React.Fragment key={device.id}>
                      <tr 
                        className={`hover:bg-slate-800/40 transition-all group cursor-pointer ${isExpanded ? 'bg-slate-800/30' : ''}`}
                        onClick={() => setExpandedRowId(isExpanded ? null : device.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary-400' : 'group-hover:text-slate-300'}`}>
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <div>
                              <div className="font-mono text-sm font-semibold text-primary-400">{device.tagNumber}</div>
                              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{device.itemCategory}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-200 font-medium">{device.deviceType}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{device.brand}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {device.currentLocation}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                            device.status === 'Working' ? 'bg-success-500/10 text-success-400 border-success-500/20' :
                            device.status === 'Broken' || device.status === 'Lost' ? 'bg-danger-500/10 text-danger-400 border-danger-500/20' :
                            'bg-warning-500/10 text-warning-400 border-warning-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              device.status === 'Working' ? 'bg-success-400' :
                              device.status === 'Broken' || device.status === 'Lost' ? 'bg-danger-400' : 'bg-warning-400'
                            }`}></span>
                            {device.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <Link href={`/dashboard/inventory/${device.id}`} className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="View QR">
                              <QrCode className="w-4 h-4" />
                            </Link>
                            <button onClick={(e) => { e.stopPropagation(); handleOpenModal(device); }} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/80 rounded-lg transition-all" title="Edit Item">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(device.id); }} className="p-2 text-slate-400 hover:text-danger-400 hover:bg-danger-500/10 rounded-lg transition-all" title="Delete Item">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Progressive Disclosure Row */}
                      {isExpanded && (
                        <tr className="bg-slate-900/30 border-b border-slate-700/50 shadow-inner">
                          <td colSpan={5} className="px-6 py-5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-12 animate-in slide-in-from-top-2 fade-in duration-200">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <DollarSign className="w-3.5 h-3.5"/> Market Value
                                </p>
                                <p className="text-slate-200 font-medium">Rs. {device.marketValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5"/> Received Details
                                </p>
                                <p className="text-slate-200 text-sm">
                                  {new Date(device.receivedDate).toLocaleDateString()} 
                                  <span className="text-slate-500 mx-1">from</span> 
                                  {device.receivedFrom}
                                </p>
                              </div>
                              {device.serialNumber && (
                                <div className="space-y-1">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5"/> Serial Number
                                  </p>
                                  <p className="text-slate-200 font-mono text-sm">{device.serialNumber}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl p-8 shadow-2xl border border-slate-700/50 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {editingId ? "Edit Equipment Details" : "Register New Equipment"}
            </h2>
            <p className="text-sm text-slate-400 mb-6">Enter the primary details for tracking in the lab inventory.</p>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Primary Fields */}
              <div className="md:col-span-2 space-y-2 mb-2 pb-5 border-b border-slate-800">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Asset Category</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600">
                    <input type="radio" className="text-primary-500" name="itemCategory" value="Electronic Appliance" checked={formData.itemCategory === "Electronic Appliance"} onChange={e => setFormData({...formData, itemCategory: e.target.value})} />
                    Electronic Appliance
                  </label>
                  <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 hover:border-slate-600">
                    <input type="radio" className="text-primary-500" name="itemCategory" value="Non-Electronic Item" checked={formData.itemCategory === "Non-Electronic Item"} onChange={e => setFormData({...formData, itemCategory: e.target.value})} />
                    Non-Electronic Item
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tag Number {formData.itemCategory === "Non-Electronic Item" && !editingId && formData.quantity > 1 ? "(Base Prefix)" : ""}
                </label>
                <input required className="input-style" value={formData.tagNumber} onChange={e => setFormData({...formData, tagNumber: e.target.value})} placeholder="e.g. PC-001" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Type</label>
                <select required className="input-style" value={formData.deviceType} onChange={e => setFormData({...formData, deviceType: e.target.value})}>
                  <option value="">Select Type</option>
                  {deviceTypes.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Brand / Manufacturer</label>
                <select required className="input-style" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}>
                  <option value="">Select Brand</option>
                  {brands.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Location</label>
                <select required className="input-style" value={formData.currentLocation} onChange={e => setFormData({...formData, currentLocation: e.target.value})}>
                  <option value="">Select Location</option>
                  {locations.map(opt => <option key={opt.id} value={opt.value}>{opt.value}</option>)}
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asset Status</label>
                <select className="input-style" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Working">Working</option>
                  <option value="Under Repair">Under Repair</option>
                  <option value="Broken">Broken</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Progressive Disclosure: Advanced Settings */}
              <div className="md:col-span-2 mt-4 pt-4 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setShowAdvancedDetails(!showAdvancedDetails)} 
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {showAdvancedDetails ? "Hide Additional Details" : "Show Additional Details (Serial, Value, Dates)"}
                </button>
                
                {showAdvancedDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 p-5 bg-slate-950/50 rounded-xl border border-slate-800 animate-in slide-in-from-top-2 fade-in">
                    
                    {formData.itemCategory === "Electronic Appliance" && (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Serial Number</label>
                        <input className="input-style bg-slate-900" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} placeholder="e.g. SN-123456" />
                      </div>
                    )}

                    {formData.itemCategory === "Non-Electronic Item" && !editingId && (
                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bulk Add Quantity</label>
                        <input required type="number" min="1" className="input-style bg-slate-900" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} placeholder="1" />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Market Value (Rs.)</label>
                      <input required type="number" step="0.01" className="input-style bg-slate-900" value={formData.marketValue} onChange={e => setFormData({...formData, marketValue: e.target.value})} placeholder="0.00" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Received Date</label>
                      <input required type="date" className="input-style bg-slate-900" value={formData.receivedDate} onChange={e => setFormData({...formData, receivedDate: e.target.value})} />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Received From / Supplier</label>
                      <input required className="input-style bg-slate-900" value={formData.receivedFrom} onChange={e => setFormData({...formData, receivedFrom: e.target.value})} placeholder="e.g. Ministry of Education, Donation" />
                    </div>

                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary w-full sm:w-auto">
                  Cancel
                </button>
                <button type="submit" className="btn-primary w-full sm:w-auto shadow-primary-500/20 shadow-lg">
                  {editingId ? "Save Changes" : "Register Item(s)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
