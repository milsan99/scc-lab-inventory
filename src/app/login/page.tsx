import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-[#0b1120] shadow-xl border border-primary-500/20 mb-4 overflow-hidden relative">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" priority />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">ICT Inventory</h1>
          <p className="text-slate-400 mt-2">Sign in to manage lab equipment</p>
        </div>

        <div className="glass p-8 rounded-2xl">
          <LoginForm />
        </div>
        <p className="text-center text-xs text-slate-500 mt-8 font-semibold tracking-wider">
          DEVELOPED BY M SANDARUWAN
        </p>
      </div>
    </main>
  );
}
