import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        {
          message:
            "Name must be between 2 and 100 characters.",
        },
        { status: 400 }
      );
    }

    if (
      !email.includes("@") ||
      email.length > 254
    ) {
      return NextResponse.json(
        {
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        {
          message:
            "Password must not exceed 128 characters.",
        },
        { status: 400 }
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message:
          "User registered successfully!",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Registration Error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to create your account.",
      },
      { status: 500 }
    );
  }
}