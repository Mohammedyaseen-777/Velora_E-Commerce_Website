import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/products
// Supports:
// /api/products
// /api/products?search=watch
// /api/products?category=Electronics
// /api/products?search=watch&category=Electronics

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();

    const products = await prisma.product.findMany({
      where: {
        ...(category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {}),

        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch products.",
      },
      { status: 500 }
    );
  }
}

// POST /api/products
// Creates a new product

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      price,
      image,
      category,
      stock,
    } = body;

    // Validate required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      !image ||
      !category
    ) {
      return NextResponse.json(
        {
          message: "All required fields are needed.",
        },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    const numericStock =
      stock !== undefined ? Number(stock) : 0;

    if (Number.isNaN(numericPrice)) {
      return NextResponse.json(
        {
          message: "Price must be a valid number.",
        },
        { status: 400 }
      );
    }

    if (Number.isNaN(numericStock)) {
      return NextResponse.json(
        {
          message: "Stock must be a valid number.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: numericPrice,
        image,
        category,
        stock: numericStock,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully!",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Product Error:", error);

    return NextResponse.json(
      {
        message: "Failed to create product.",
      },
      { status: 500 }
    );
  }
}