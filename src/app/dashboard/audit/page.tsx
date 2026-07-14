import { prisma } from "@/lib/prisma";
import { History } from "lucide-react";

export default async function AuditLogPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center">
          <History className="w-6 h-6 text-primary-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Activity Logs</h1>
          <p className="text-slate-400 mt-1">Recent system changes and audit trails (Last 100 actions)</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No activity logs found.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">
                  {log.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm"><span className="font-semibold text-primary-400">{log.userName}</span> {log.details}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">{log.action}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
