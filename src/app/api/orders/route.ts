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

// POST /api/orders
// Create a new order from the user's cart
export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to place an order.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
    } = body;

    // Validate shipping information
    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return NextResponse.json(
        {
          message: "All shipping information is required.",
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (paymentMethod !== "COD") {
      return NextResponse.json(
        {
          message: "Please select a valid payment method.",
        },
        { status: 400 }
      );
    }

    // Find user's cart
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          message: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // Check stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            message: `Only ${item.product.stock} item(s) of "${item.product.name}" are available.`,
          },
          { status: 400 }
        );
      }
    }

    // Type used for cart items
    type CartItem = {
      quantity: number;
      product: {
        id: number;
        name: string;
        price: number;
        stock: number;
      };
    };

    // Calculate total
    const totalAmount = cart.items.reduce(
      (total: number, item: CartItem) =>
        total + item.product.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.$transaction(
      async (transaction) => {
        const newOrder = await transaction.order.create({
          data: {
            userId,

            totalAmount: Math.round(totalAmount),

            status: "PENDING",

            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode,

            // Save payment method
            paymentMethod,

            items: {
              create: cart.items.map(
                (item: CartItem) => ({
                  productId: item.product.id,

                  productName: item.product.name,

                  price: Math.round(item.product.price),

                  quantity: item.quantity,
                })
              ),
            },
          },
          include: {
            items: true,
          },
        });

        // Update product stock
        for (const item of cart.items) {
          await transaction.product.update({
            where: {
              id: item.product.id,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Clear cart after successful order
        await transaction.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        });

        return newOrder;
      }
    );

    return NextResponse.json(
      {
        message: "Order placed successfully.",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        message: "Failed to place order.",
      },
      { status: 500 }
    );
  }
}