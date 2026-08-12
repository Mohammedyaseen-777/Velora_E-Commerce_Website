import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

type CartItem = {
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
  };
};

async function getUserId(): Promise<number | null> {
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
    // -----------------------------------------
    // 1. Get logged-in user
    // -----------------------------------------
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          message: "You must be logged in to place an order.",
        },
        { status: 401 }
      );
    }

    // -----------------------------------------
    // 2. Read request body
    // -----------------------------------------
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

    // -----------------------------------------
    // 3. Validate shipping information
    // -----------------------------------------
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

    // -----------------------------------------
    // 4. Validate payment method
    // -----------------------------------------
    if (paymentMethod !== "COD") {
      return NextResponse.json(
        {
          message: "Please select a valid payment method.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 5. Find user's cart
    // -----------------------------------------
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

    // -----------------------------------------
    // 6. Treat cart items as typed data
    // -----------------------------------------
    const cartItems = cart.items as unknown as CartItem[];

    // -----------------------------------------
    // 7. Check product stock
    // -----------------------------------------
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            message: `Only ${item.product.stock} item(s) of "${item.product.name}" are available.`,
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------------------
    // 8. Calculate total amount
    // -----------------------------------------
    const totalAmount = cartItems.reduce(
      (total: number, item: CartItem) =>
        total + item.product.price * item.quantity,
      0
    );

    // -----------------------------------------
    // 9. Prepare order items
    // -----------------------------------------
    const orderItems = cartItems.map((item: CartItem) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: Math.round(item.product.price),
      quantity: item.quantity,
    }));

    // -----------------------------------------
    // 10. Build transaction operations
    // -----------------------------------------
    const transactionOperations = [
      // Create order
      prisma.order.create({
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

          paymentMethod,

          items: {
            create: orderItems,
          },
        },
      }),

      // Remove all cart items after order creation
      prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: {
            deleteMany: {},
          },
        },
      }),

      // Update stock for every purchased product
      ...cartItems.map((item: CartItem) =>
        prisma.product.update({
          where: {
            id: item.product.id,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      ),
    ];

    // -----------------------------------------
    // 11. Execute everything atomically
    // -----------------------------------------
    const [newOrder] = await prisma.$transaction(
      transactionOperations
    );

    // -----------------------------------------
    // 12. Return successful response
    // -----------------------------------------
    return NextResponse.json(
      {
        message: "Order placed successfully.",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    // -----------------------------------------
    // 13. Handle unexpected errors
    // -----------------------------------------
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong while placing your order.",
      },
      { status: 500 }
    );
  }
}