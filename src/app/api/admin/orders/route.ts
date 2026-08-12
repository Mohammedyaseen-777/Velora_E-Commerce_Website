import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import prisma from "@/lib/prisma";

const ALLOWED_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        paymentMethod: true,
        fullName: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch orders.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const orderId = Number(body.orderId);
    const status = String(body.status || "").toUpperCase();

    if (!Number.isInteger(orderId)) {
      return NextResponse.json(
        {
          message: "Invalid order ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          message: "Invalid order status.",
        },
        {
          status: 400,
        }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          message: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders error:", error);

    return NextResponse.json(
      {
        message: "Failed to update order status.",
      },
      {
        status: 500,
      }
    );
  }
}