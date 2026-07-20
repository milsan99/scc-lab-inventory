import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const devices = await prisma.device.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(devices);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const adminName = session.user?.name || "Admin";

  try {
    const body = await req.json();
    const { 
      tagNumber, 
      itemCategory, 
      serialNumber, 
      deviceType, 
      brand, 
      marketValue, 
      receivedDate,
      receivedFrom, 
      status, 
      currentLocation,
      quantity = 1
    } = body;

    const baseData = {
      itemCategory,
      serialNumber: itemCategory === "Electronic Appliance" ? (serialNumber || null) : null,
      deviceType,
      brand,
      marketValue: marketValue ? parseFloat(marketValue) : 0,
      receivedDate: receivedDate ? new Date(receivedDate) : new Date(),
      receivedFrom: receivedFrom || "Not Specified",
      status,
      currentLocation
    };

    if (itemCategory === "Non-Electronic Item" && quantity > 1) {
      // Bulk insert
      const recordsToCreate = [];
      for (let i = 0; i < quantity; i++) {
        recordsToCreate.push({
          ...baseData,
          tagNumber: `${tagNumber}-${i + 1}`
        });
      }
      
      await prisma.device.createMany({
        data: recordsToCreate
      });

      await prisma.auditLog.create({
        data: {
          action: 'CREATED_DEVICE',
          details: `Bulk created ${quantity} items of type ${deviceType}`,
          userName: adminName
        }
      });

      return NextResponse.json({ success: true, count: quantity });
    } else {
      // Single insert
      const device = await prisma.device.create({
        data: {
          ...baseData,
          tagNumber
        }
      });

      await prisma.auditLog.create({
        data: {
          action: 'CREATED_DEVICE',
          entityId: device.id,
          details: `Created single item: ${tagNumber} (${deviceType})`,
          userName: adminName
        }
      });

      return NextResponse.json(device);
    }
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
