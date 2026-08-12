"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [loadingProductId, setLoadingProductId] = useState<number | null>(
    null
  );

  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<number | null>(
    null
  );

  // Load products from PostgreSQL
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();

        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Load existing wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist");

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const items = data.items || [];

        const ids = items
          .map((item: { productId: number }) => item.productId)
          .filter((id: number) => typeof id === "number");

        setWishlistIds(ids);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    loadWishlist();
  }, []);

  // Add product to cart
  const handleAddToCart = async (productId: number) => {
    try {
      setLoadingProductId(productId);

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Unable to add product to cart:",
          data.message || "Unknown error"
        );
        return;
      }

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Add to Cart Error:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  // Add / Remove Wishlist
  const handleWishlist = async (productId: number) => {
    if (wishlistLoadingId !== null) {
      return;
    }

    const isWishlisted = wishlistIds.includes(productId);

    try {
      setWishlistLoadingId(productId);

      // Remove from wishlist
      if (isWishlisted) {
        const response = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error(
            "Unable to remove from wishlist:",
            data.message || "Unknown error"
          );
          return;
        }

        setWishlistIds((current) =>
          current.filter((id) => id !== productId)
        );

        window.dispatchEvent(new Event("wishlistUpdated"));

        return;
      }

      // Add to wishlist
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Unable to add to wishlist:",
          data.message || "Unknown error"
        );
        return;
      }

      setWishlistIds((current) => {
        if (current.includes(productId)) {
          return current;
        }

        return [...current, productId];
      });

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.error("Wishlist Error:", error);
    } finally {
      setWishlistLoadingId(null);
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Heading */}
        <h2 className="text-center text-4xl font-bold text-slate-900">
          Featured Products
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Hand-picked products loved by our customers.
        </p>

        {/* Loading State */}
        {productsLoading && (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="h-40 rounded-xl bg-gray-200" />

                <div className="mt-6 h-6 rounded bg-gray-200" />

                <div className="mt-3 h-4 w-2/3 rounded bg-gray-200" />

                <div className="mt-4 h-6 w-1/2 rounded bg-gray-200" />

                <div className="mt-6 h-12 rounded-xl bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!productsLoading && products.length === 0 && (
          <div className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              No products available
            </h3>

            <p className="mt-2 text-gray-600">
              Products will appear here once they are added to Velora.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!productsLoading && products.length > 0 && (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const wishlistLoading =
                wishlistLoadingId === product.id;
              const cartLoading = loadingProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Product Details */}
                  <Link
                    href={`/products/${product.id}`}
                    className="block"
                  >
                    {/* Product Image */}
                    <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* Category */}
                    <p className="mt-5 text-sm font-medium text-blue-900">
                      {product.category}
                    </p>

                    {/* Product Name */}
                    <h3 className="mt-2 text-xl font-semibold text-slate-900 transition hover:text-blue-900">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mt-4">
                      <span className="text-xl font-bold text-slate-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Stock */}
                    <p
                      className={`mt-2 text-sm font-medium ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </p>
                  </Link>

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-3">
                    {/* Wishlist */}
                    <button
                      type="button"
                      onClick={() => handleWishlist(product.id)}
                      disabled={wishlistLoading}
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-2xl transition duration-200 ${
                        isWishlisted
                          ? "border-red-200 bg-red-50 text-red-500"
                          : "border-gray-200 bg-white text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      } ${
                        wishlistLoading
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                    >
                      {isWishlisted ? "♥" : "♡"}
                    </button>

                    {/* Add to Cart */}
                    <div className="flex-1">
                      <Button
                        onClick={() =>
                          handleAddToCart(product.id)
                        }
                        disabled={
                          cartLoading || product.stock <= 0
                        }
                      >
                        {product.stock <= 0
                          ? "Out of Stock"
                          : cartLoading
                            ? "Adding..."
                            : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}