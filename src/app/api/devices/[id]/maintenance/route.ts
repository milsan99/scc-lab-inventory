import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const adminName = session.user?.name || "Admin";
  const { id } = await params;

  try {
    const { description, cost } = await req.json();

    const maintenance = await prisma.maintenanceLog.create({
      data: {
        deviceId: id,
        description,
        cost
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'MAINTENANCE_ADDED',
        entityId: id,
        details: `Repair added: ${description} (Cost: Rs. ${cost})`,
        userName: adminName
      }
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
