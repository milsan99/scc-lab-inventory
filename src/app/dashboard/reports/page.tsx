import ReportGenerator from "@/components/ReportGenerator";

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Report Generator</h1>
        <p className="text-slate-400 mt-1">Export customized inventory reports to PDF or CSV</p>
      </div>
      <ReportGenerator />
    </div>
  );
}
