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

// GET /api/cart
export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
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

    if (!cart) {
      return NextResponse.json({
        cart: null,
        items: [],
      });
    }

    return NextResponse.json({
      cart,
      items: cart.items,
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return NextResponse.json(
      { message: "Unable to load cart." },
      { status: 500 }
    );
  }
}

// POST /api/cart
export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in to add items to your cart." },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { message: "Product ID and valid quantity are required." },
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

    if (product.stock < quantity) {
      return NextResponse.json(
        {
          message: `Only ${product.stock} item(s) are available.`,
        },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            message: `Only ${product.stock} item(s) are available.`,
          },
          { status: 400 }
        );
      }

      cartItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: newQuantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity,
        },
        include: {
          product: true,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Product added to cart!",
        item: cartItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return NextResponse.json(
      { message: "Unable to add product to cart." },
      { status: 500 }
    );
  }
}

// PATCH /api/cart
// Update the quantity of a cart item
export async function PATCH(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { itemId, quantity } = await request.json();

    if (!itemId || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { message: "Valid item ID and quantity are required." },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found." },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        {
          message: `Only ${cartItem.product.stock} item(s) are available.`,
        },
        { status: 400 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      message: "Cart quantity updated!",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update Cart Error:", error);

    return NextResponse.json(
      { message: "Unable to update cart quantity." },
      { status: 500 }
    );
  }
}

// DELETE /api/cart
// Remove an item from the cart
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { message: "Cart item ID is required." },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { message: "Cart not found." },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(itemId),
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return NextResponse.json({
      message: "Product removed from cart.",
    });
  } catch (error) {
    console.error("Delete Cart Error:", error);

    return NextResponse.json(
      { message: "Unable to remove product from cart." },
      { status: 500 }
    );
  }
}