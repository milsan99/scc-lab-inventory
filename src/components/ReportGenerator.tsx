"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Table, Loader2 } from "lucide-react";
import { Device, DropdownOption } from "@prisma/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportGenerator() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [reportType, setReportType] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Electronic Appliance");
  const [selectedDeviceType, setSelectedDeviceType] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devRes, optRes] = await Promise.all([
          fetch("/api/devices"),
          fetch("/api/options?category=LOCATION")
        ]);
        if (devRes.ok) setDevices(await devRes.json());
        if (optRes.ok) {
          const locs = await optRes.json();
          setLocations(locs.map((l: any) => l.value));
          if (locs.length > 0) setSelectedLocation(locs[0].value);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredDevices = () => {
    if (reportType === "ALL") return devices;
    if (reportType === "MAINTENANCE") return devices.filter(d => d.status === "Broken" || d.status === "Under Repair");
    if (reportType === "LOCATION") return devices.filter(d => d.currentLocation === selectedLocation);
    if (reportType === "CATEGORY") {
      let filtered = devices.filter(d => d.itemCategory === selectedCategory);
      if (selectedDeviceType !== "ALL") {
        filtered = filtered.filter(d => d.deviceType === selectedDeviceType);
      }
      return filtered;
    }
    return devices;
  };

  const generatePDF = () => {
    const data = getFilteredDevices();
    if (data.length === 0) return alert("No data available for this report.");

    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(20);
    doc.text("ICT Lab Inventory Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    let subtitle = "Full Master Inventory";
    if (reportType === "MAINTENANCE") subtitle = "Maintenance Report (Broken/Repair)";
    if (reportType === "LOCATION") subtitle = `Location Audit: ${selectedLocation}`;
    if (reportType === "CATEGORY") {
      subtitle = `Category Report: ${selectedCategory}`;
      if (selectedDeviceType !== "ALL") subtitle += ` - ${selectedDeviceType}`;
    }
    
    doc.text(`${subtitle} - Generated on ${new Date().toLocaleDateString()}`, 14, 30);

    const totalValue = data.reduce((sum, d) => sum + d.marketValue, 0);
    doc.text(`Total Items: ${data.length} | Total Value: Rs. ${totalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`, 14, 36);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Developed by M SANDARUWAN", 14, doc.internal.pageSize.getHeight() - 10);

    const tableColumn = ["Tag Number", "Serial Number", "Item & Brand", "Category", "Location", "Status", "Value (Rs.)"];
    const tableRows = data.map(d => [
      d.tagNumber,
      d.serialNumber || "N/A",
      `${d.deviceType} (${d.brand})`,
      d.itemCategory,
      d.currentLocation,
      d.status,
      d.marketValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 42,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`ict-lab-report-${new Date().getTime()}.pdf`);
  };

  const generateCSV = () => {
    const data = getFilteredDevices();
    if (data.length === 0) return alert("No data available for this report.");

    const headers = ["Tag Number", "Serial Number", "Item Type", "Brand", "Category", "Location", "Status", "Received Date", "Received From", "Value (Rs.)"];
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const d of data) {
      const row = [
        `"${d.tagNumber}"`,
        `"${d.serialNumber || ""}"`,
        `"${d.deviceType}"`,
        `"${d.brand}"`,
        `"${d.itemCategory}"`,
        `"${d.currentLocation}"`,
        `"${d.status}"`,
        `"${new Date(d.receivedDate).toLocaleDateString()}"`,
        `"${d.receivedFrom}"`,
        d.marketValue
      ];
      csvRows.push(row.join(","));
    }

    const csvString = csvRows.join("\n");
    // Add BOM for Excel
    const blob = new Blob(["\uFEFF" + csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ict-lab-report-${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const filtered = getFilteredDevices();
  const totalValue = filtered.reduce((sum, d) => sum + d.marketValue, 0);

  const availableDeviceTypes = Array.from(new Set(devices.filter(d => d.itemCategory === selectedCategory).map(d => d.deviceType))).sort();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div className="lg:col-span-1 space-y-6">
        <div className="glass p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Report Configuration</h2>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Report Type</label>
            <select className="input-style bg-slate-800" value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="ALL">Full Master Inventory</option>
              <option value="MAINTENANCE">Maintenance Needs</option>
              <option value="LOCATION">By Location</option>
              <option value="CATEGORY">By Category</option>
            </select>
          </div>

          {reportType === "LOCATION" && (
            <div className="space-y-2 animate-in fade-in">
              <label className="text-sm text-slate-300">Select Location</label>
              <select className="input-style bg-slate-800" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
          )}

          {reportType === "CATEGORY" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Select Category</label>
                <select className="input-style bg-slate-800" value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setSelectedDeviceType("ALL"); }}>
                  <option value="Electronic Appliance">Electronic Appliance</option>
                  <option value="Non-Electronic Item">Non-Electronic Item</option>
                </select>
              </div>

              {availableDeviceTypes.length > 0 && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm text-slate-300">Filter by Specific Item (Optional)</label>
                  <select className="input-style bg-slate-800" value={selectedDeviceType} onChange={e => setSelectedDeviceType(e.target.value)}>
                    <option value="ALL">All Items in Category</option>
                    {availableDeviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="glass p-8 rounded-2xl flex flex-col justify-center items-center text-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Preview Summary</h2>
          <p className="text-slate-400 mb-6 max-w-md">
            This report currently includes <strong className="text-white">{filtered.length} items</strong> with a total estimated market value of <strong className="text-white">Rs. {totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button onClick={generatePDF} className="btn-primary flex items-center justify-center gap-2 px-8">
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button onClick={generateCSV} className="btn-secondary flex items-center justify-center gap-2 px-8">
              <Table className="w-5 h-5" />
              Download CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
