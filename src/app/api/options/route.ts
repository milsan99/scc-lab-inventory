import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  try {
    const options = await prisma.dropdownOption.findMany({
      where: category ? { category } : undefined,
      orderBy: { value: 'asc' }
    });
    return NextResponse.json(options);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { category, value } = await req.json();

    const option = await prisma.dropdownOption.create({
      data: { category, value }
    });

    return NextResponse.json(option);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
