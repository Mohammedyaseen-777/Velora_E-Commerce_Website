import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      pendingOrders,
      processingOrders,
      completedOrders,
      lowStockProducts,
      outOfStockProducts,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.product.count(),

      prisma.order.count(),

      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),

      prisma.order.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.order.count({
        where: {
          status: "PROCESSING",
        },
      }),

      prisma.order.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.product.count({
        where: {
          stock: {
            gt: 0,
            lte: 5,
          },
        },
      }),

      prisma.product.count({
        where: {
          stock: {
            lte: 0,
          },
        },
      }),

      prisma.order.findMany({
        take: 8,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          fullName: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount ?? 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        completedOrders,
        lowStockProducts,
        outOfStockProducts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);

    return NextResponse.json(
      {
        message: "Failed to load admin analytics.",
      },
      {
        status: 500,
      }
    );
  }
}