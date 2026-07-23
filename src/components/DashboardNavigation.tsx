"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, Database, MapPin, Settings, FileText, History, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardNavigation({ userName }: { userName: string | null | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/inventory", icon: Database, label: "Inventory" },
    { href: "/dashboard/reports", icon: FileText, label: "Reports" },
    { href: "/dashboard/audit", icon: History, label: "Activity Logs" },
    { href: "/dashboard/locations", icon: MapPin, label: "Locations" },
    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0b1120] border-b border-slate-800/50 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center relative overflow-hidden">
            <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" priority />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight leading-tight">Computer Lab Inventory</span>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">Rathnapura Sivali Central College</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar (Desktop static, Mobile drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass border-r border-slate-800/50 flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="min-h-[4rem] py-4 flex items-center justify-between px-6 border-b border-slate-800/50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center mr-3 overflow-hidden relative">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight leading-tight">Computer Lab Inventory</span>
              <span className="text-[11px] text-slate-400 font-medium leading-tight">Rathnapura Sivali Central College</span>
            </div>
          </div>
          <button onClick={closeMenu} className="md:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50 bg-[#0b1120]/50">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
              {userName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <LogoutButton />
          <div className="mt-4 pt-4 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              DEVELOPED BY M SANDARUWAN
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
