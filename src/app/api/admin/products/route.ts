import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized. Admin access required.",
        },
        {
          status: 401,
        }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch products.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized. Admin access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const description = String(
      body.description || ""
    ).trim();
    const category = String(body.category || "").trim();
    const image = String(body.image || "").trim();

    const price = Number(body.price);
    const stock = Number(body.stock);

    if (!name) {
      return NextResponse.json(
        {
          message: "Product name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          message: "Product description is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          message: "Product category is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          message: "Invalid product price.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        {
          message: "Stock must be a whole number greater than or equal to 0.",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        category,
        stock,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);

    return NextResponse.json(
      {
        message: "Failed to create product.",
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
        {
          message: "Unauthorized. Admin access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const id = Number(body.id);

    const name = String(body.name || "").trim();
    const description = String(
      body.description || ""
    ).trim();
    const category = String(body.category || "").trim();
    const image = String(body.image || "").trim();

    const price = Number(body.price);
    const stock = Number(body.stock);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (!name || !description || !category) {
      return NextResponse.json(
        {
          message:
            "Product name, description and category are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          message: "Invalid product price.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        {
          message:
            "Stock must be a whole number greater than or equal to 0.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        image,
        category,
        stock,
      },
    });

    return NextResponse.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products error:", error);

    return NextResponse.json(
      {
        message: "Failed to update product.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized. Admin access required.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Do not delete a product if it is already referenced
     * by an order. This protects historical order data.
     */
    const orderItemCount = await prisma.orderItem.count({
      where: {
        productId: id,
      },
    });

    if (orderItemCount > 0) {
      return NextResponse.json(
        {
          message:
            "This product cannot be deleted because it is already part of an order. Edit it or set its stock to 0 instead.",
        },
        {
          status: 409,
        }
      );
    }

    await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: {
          productId: id,
        },
      }),

      prisma.wishlistItem.deleteMany({
        where: {
          productId: id,
        },
      }),

      prisma.product.delete({
        where: {
          id,
        },
      }),
    ]);

    return NextResponse.json({
      message: "Product deleted successfully.",
      productId: id,
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/products error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete product.",
      },
      {
        status: 500,
      }
    );
  }
}