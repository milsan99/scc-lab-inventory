import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, Database, MapPin, Settings, FileText, History } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-[#0b1120]">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-800/50 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
          <div className="w-10 h-10 rounded-xl bg-[#0b1120] border border-primary-500/30 flex items-center justify-center mr-3 overflow-hidden relative">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" priority />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">ICT Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          <Link href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
            <Database className="w-5 h-5" />
            <span className="font-medium">Inventory</span>
          </Link>
          <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Reports</span>
          </Link>
          <Link href="/dashboard/audit" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
            <History className="w-5 h-5" />
            <span className="font-medium">Activity Logs</span>
          </Link>
          <Link href="/dashboard/locations" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Locations</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
              {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{session?.user?.name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <LogoutButton />
          <div className="mt-4 pt-4 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Developed by M SANDARUWAN
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
