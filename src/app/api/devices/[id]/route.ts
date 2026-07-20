import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const adminName = session.user?.name || "Admin";
  const { id } = await params;

  try {
    const body = await req.json();
    const { 
      tagNumber, itemCategory, serialNumber, deviceType, brand, marketValue, 
      receivedDate, receivedFrom, status, currentLocation 
    } = body;

    if (deviceType) {
      const existingType = await prisma.dropdownOption.findFirst({
        where: { category: "DEVICE_TYPE", value: deviceType }
      });
      if (!existingType) {
        await prisma.dropdownOption.create({
          data: { category: "DEVICE_TYPE", value: deviceType }
        });
      }
    }

    if (brand) {
      const existingBrand = await prisma.dropdownOption.findFirst({
        where: { category: "BRAND", value: brand }
      });
      if (!existingBrand) {
        await prisma.dropdownOption.create({
          data: { category: "BRAND", value: brand }
        });
      }
    }

    const device = await prisma.device.update({
      where: { id },
      data: {
        tagNumber, itemCategory,
        serialNumber: itemCategory === "Electronic Appliance" ? serialNumber : null,
        deviceType, brand,
        marketValue: parseFloat(marketValue),
        receivedDate: new Date(receivedDate),
        receivedFrom, status, currentLocation
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'UPDATED_DEVICE',
        entityId: device.id,
        details: `Updated item: ${tagNumber}`,
        userName: adminName
      }
    });

    return NextResponse.json(device);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });
  const adminName = session.user?.name || "Admin";
  const { id } = await params;

  try {
    const device = await prisma.device.findUnique({ where: { id } });
    if (device) {
      await prisma.device.delete({ where: { id } });
      
      await prisma.auditLog.create({
        data: {
          action: 'DELETED_DEVICE',
          entityId: id,
          details: `Deleted item: ${device.tagNumber}`,
          userName: adminName
        }
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
