import { getServerSession } from "next-auth";
import CredentialsUpdater from "@/components/CredentialsUpdater";
import SettingsManager from "@/components/SettingsManager";

export default async function SettingsPage() {
  const session = await getServerSession();
  const currentUsername = session?.user?.name || "admin";

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Manage system configurations and options</p>
      </div>

      <SettingsManager />

      <div className="mt-8 pt-8 border-t border-slate-800">
        <CredentialsUpdater currentUsername={currentUsername} />
      </div>
    </div>
  );
}
