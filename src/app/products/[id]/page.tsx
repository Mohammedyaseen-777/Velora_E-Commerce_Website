import Link from "next/link";
import AddToCartButton from "@/components/products/AddToCartButton";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(
      "http://localhost:3000/api/products",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const product = data.products.find(
      (item: Product) => item.id === Number(id)
    );

    return product || null;
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return null;
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Product Not Found
          </h1>

          <p className="mt-4 text-gray-600">
            We couldn't find the product you're looking for.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center font-semibold text-blue-900 transition hover:text-blue-700"
        >
          ← Back to Velora
        </Link>

        {/* Product Details */}
        <div className="mt-8 grid gap-12 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-2 md:p-12">
          {/* Product Image */}
          <div className="flex min-h-[450px] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[450px] w-full object-contain"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-900">
              {product.category}
            </p>

            {/* Product Name */}
            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5">
              <span className="text-4xl font-bold text-blue-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Description */}
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-6">
              {product.stock > 0 ? (
                <p className="font-medium text-green-600">
                  ✓ {product.stock} items available
                </p>
              ) : (
                <p className="font-medium text-red-600">
                  Out of stock
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-start gap-4">
              {/* Add To Cart */}
              <AddToCartButton
                productId={product.id}
                stock={product.stock}
              />

              {/* Wishlist */}
              <button
                type="button"
                className="rounded-xl border border-gray-300 px-6 py-4 font-semibold text-slate-900 transition hover:bg-gray-100"
              >
                ♡ Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}