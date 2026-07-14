import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const adminName = session.user?.name || "Admin";
  const { id } = await params;

  try {
    const { borrowerName, expectedReturnDate } = await req.json();

    const borrow = await prisma.borrowRecord.create({
      data: {
        deviceId: id,
        borrowerName,
        expectedReturnDate: new Date(expectedReturnDate)
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'BORROWED_DEVICE',
        entityId: id,
        details: `Item issued to ${borrowerName}`,
        userName: adminName
      }
    });

    return NextResponse.json(borrow);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
