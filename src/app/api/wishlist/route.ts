import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("velora_session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySession(token);

  if (!session) {
    return null;
  }

  return Number(session.userId);
}

// GET /api/wishlist
export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!wishlist) {
      return NextResponse.json({
        wishlist: null,
        items: [],
      });
    }

    return NextResponse.json({
      wishlist,
      items: wishlist.items,
    });
  } catch (error) {
    console.error("Get Wishlist Error:", error);

    return NextResponse.json(
      { message: "Unable to load wishlist." },
      { status: 500 }
    );
  }
}

// POST /api/wishlist
export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in to add items to your wishlist." },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    const wishlist = await prisma.wishlist.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: product.id,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        {
          message: "Product is already in your wishlist.",
          item: existingItem,
        },
        { status: 200 }
      );
    }

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: product.id,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      {
        message: "Product added to wishlist!",
        item: wishlistItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add To Wishlist Error:", error);

    return NextResponse.json(
      { message: "Unable to add product to wishlist." },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in to remove wishlist items." },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 }
      );
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    });

    if (!wishlist) {
      return NextResponse.json(
        { message: "Wishlist not found." },
        { status: 404 }
      );
    }

    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: Number(productId),
        },
      },
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { message: "Product is not in your wishlist." },
        { status: 404 }
      );
    }

    await prisma.wishlistItem.delete({
      where: {
        id: wishlistItem.id,
      },
    });

    return NextResponse.json({
      message: "Product removed from wishlist.",
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);

    return NextResponse.json(
      { message: "Unable to remove product from wishlist." },
      { status: 500 }
    );
  }
}