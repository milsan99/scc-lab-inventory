import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string, borrowId: string }> }) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const adminName = session.user?.name || "Admin";
  const { id, borrowId } = await params;

  try {
    const { status } = await req.json();

    const borrow = await prisma.borrowRecord.update({
      where: { id: borrowId },
      data: { status, actualReturnDate: new Date() }
    });

    await prisma.auditLog.create({
      data: {
        action: 'RETURNED_DEVICE',
        entityId: id,
        details: `Item returned by ${borrow.borrowerName}`,
        userName: adminName
      }
    });

    return NextResponse.json(borrow);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
