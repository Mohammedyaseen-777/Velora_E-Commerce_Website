import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import prisma from "@/lib/prisma";

const ALLOWED_ROLES = ["USER", "ADMIN"];

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return NextResponse.json({
      users,
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch users.",
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

    const userId = Number(body.userId);
    const role = String(body.role || "").toUpperCase();

    if (!Number.isInteger(userId)) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        {
          message: "Invalid user role.",
        },
        {
          status: 400,
        }
      );
    }

    // Prevent an administrator from accidentally removing
    // their own admin access.
    if (userId === admin.id && role !== "ADMIN") {
      return NextResponse.json(
        {
          message:
            "You cannot remove your own administrator access.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/admin/users error:", error);

    return NextResponse.json(
      {
        message: "Failed to update user role.",
      },
      {
        status: 500,
      }
    );
  }
}