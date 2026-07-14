import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { newUsername, newPassword } = await req.json();

    const admin = await prisma.admin.findFirst();
    if (!admin) return new NextResponse("Admin not found", { status: 404 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        username: newUsername,
        password: hashedPassword
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATED_CREDENTIALS',
        details: 'Admin updated their login credentials',
        userName: newUsername
      }
    });

    return new NextResponse("Credentials updated successfully", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
