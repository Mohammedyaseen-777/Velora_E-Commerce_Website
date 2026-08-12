import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

async function getUserId() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("velora_session")?.value;

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
          message:
            "You must be logged in to place an order.",
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
          message:
            "All shipping information is required.",
        },
        { status: 400 }
      );
    }

    // Validate payment method
    if (paymentMethod !== "COD") {
      return NextResponse.json(
        {
          message:
            "Please select a valid payment method.",
        },
        { status: 400 }
      );
    }

    // Find user's cart
    const cart =
      await prisma.cart.findUnique({
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
      if (
        item.quantity >
        item.product.stock
      ) {
        return NextResponse.json(
          {
            message: `Only ${item.product.stock} item(s) of "${item.product.name}" are available.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const totalAmount =
      cart.items.reduce(
        (total, item) =>
          total +
          item.product.price *
            item.quantity,
        0
      );

    // Create order
    const order =
      await prisma.$transaction(
        async (transaction) => {
          const newOrder =
            await transaction.order.create(
              {
                data: {
                  userId,

                  totalAmount:
                    Math.round(
                      totalAmount
                    ),

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
                    create:
                      cart.items.map(
                        (item) => ({
                          productId:
                            item.product.id,

                          productName:
                            item.product
                              .name,

                          price:
                            Math.round(
                              item.product
                                .price
                            ),

                          quantity:
                            item.quantity,
                        })
                      ),
                  },
                },

                include: {
                  items: true,
                },
              }
            );

          // Reduce stock
          for (const item of cart.items) {
            await transaction.product.update(
              {
                where: {
                  id: item.product.id,
                },

                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              }
            );
          }

          // Clear cart
          await transaction.cartItem.deleteMany(
            {
              where: {
                cartId: cart.id,
              },
            }
          );

          return newOrder;
        }
      );

    return NextResponse.json(
      {
        message:
          "Order placed successfully!",

        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create Order Error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to place order.",
      },
      { status: 500 }
    );
  }
}

// GET /api/orders
// Get all orders OR one specific order
export async function GET(
  request: Request
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const { searchParams } =
      new URL(request.url);

    const orderId =
      searchParams.get("id");

    // -----------------------------------------
    // GET ONE ORDER
    // /api/orders?id=1
    // -----------------------------------------

    if (orderId) {
      const numericOrderId =
        Number(orderId);

      if (
        !Number.isInteger(
          numericOrderId
        ) ||
        numericOrderId < 1
      ) {
        return NextResponse.json(
          {
            message:
              "Invalid order ID.",
          },
          { status: 400 }
        );
      }

      const order =
        await prisma.order.findFirst(
          {
            where: {
              id: numericOrderId,
              userId,
            },

            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          }
        );

      if (!order) {
        return NextResponse.json(
          {
            message:
              "Order not found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        order,
      });
    }

    // -----------------------------------------
    // GET ALL ORDERS
    // /api/orders
    // -----------------------------------------

    const orders =
      await prisma.order.findMany({
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

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json({
      orders,
    });
  } catch (error) {
    console.error(
      "Get Orders Error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load orders.",
      },
      { status: 500 }
    );
  }
}