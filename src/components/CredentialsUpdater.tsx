"use client";
import { useState } from "react";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { signOut } from "next-auth/react";

export default function CredentialsUpdater({ currentUsername }: { currentUsername: string }) {
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername, newPassword })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          signOut({ callbackUrl: "/login" });
        }, 3000);
      } else {
        alert("Failed to update credentials.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl max-w-2xl border-l-4 border-l-warning-500">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-warning-500" />
        <h2 className="text-xl font-bold text-white">Admin Security Settings</h2>
      </div>

      {success ? (
        <div className="p-4 bg-success-500/10 border border-success-500/30 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success-500" />
          <p className="text-success-500 font-medium">Credentials updated successfully! Logging you out to securely re-authenticate...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 block mb-1">New Username</label>
            <input 
              required 
              type="text" 
              className="input-style" 
              value={newUsername} 
              onChange={e => setNewUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 block mb-1">New Password</label>
            <input 
              required 
              type="password" 
              className="input-style" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              placeholder="Enter new strong password"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !newPassword}
            className="btn-primary w-full sm:w-auto mt-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Update Credentials"}
          </button>
          <p className="text-xs text-slate-400 mt-2">
            Warning: Updating your credentials will immediately log you out. You will need to log back in using your new details.
          </p>
        </form>
      )}
    </div>
  );
}
