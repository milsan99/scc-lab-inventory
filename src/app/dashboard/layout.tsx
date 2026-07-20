import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardNavigation from "@/components/DashboardNavigation";

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b1120]">
      {/* Responsive Navigation Component */}
      <DashboardNavigation userName={session?.user?.name} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
