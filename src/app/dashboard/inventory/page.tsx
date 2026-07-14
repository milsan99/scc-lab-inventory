import InventoryManager from "@/components/InventoryManager";

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Inventory Management</h1>
        <p className="text-slate-400 mt-1">Manage, add, and update lab equipment</p>
      </div>
      
      <InventoryManager />
    </div>
  );
}
