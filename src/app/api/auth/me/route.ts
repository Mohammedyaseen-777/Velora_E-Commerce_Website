import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("velora_session")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const session =
      await verifySession(token);

    if (!session) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const userId = Number(session.userId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error(
      "Session Error:",
      error
    );

    return NextResponse.json(
      {
        user: null,
        message:
          "Unable to verify session.",
      },
      { status: 500 }
    );
  }
}