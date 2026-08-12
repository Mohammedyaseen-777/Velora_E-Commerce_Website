"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

type WishlistItem = {
  id: number;
  productId: number;
  product: Product;
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [cartLoadingId, setCartLoadingId] = useState<number | null>(null);

  // Load wishlist
  const loadWishlist = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/wishlist");

      if (!response.ok) {
        setItems([]);
        return;
      }

      const data = await response.json();

      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdated = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdated
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdated
      );
    };
  }, []);

  // Remove from wishlist
  const handleRemove = async (productId: number) => {
    try {
      setRemovingId(productId);

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
          "Unable to remove wishlist item:",
          data.message || "Unknown error"
        );
        return;
      }

      // Remove immediately from the page
      setItems((current) =>
        current.filter(
          (item) => item.productId !== productId
        )
      );

      // Tell other components
      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error("Remove Wishlist Error:", error);
    } finally {
      setRemovingId(null);
    }
  };

  // Add to cart
  const handleAddToCart = async (productId: number) => {
    try {
      setCartLoadingId(productId);

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

      // Immediately update cart badge
      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error("Add to Cart Error:", error);
    } finally {
      setCartLoadingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-slate-900">
            My Wishlist
          </h1>

          <p className="mt-4 text-gray-600">
            Loading your wishlist...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            My Wishlist ❤️
          </h1>

          <p className="mt-4 text-gray-600">
            Products you've saved for later.
          </p>
        </div>

        {/* Empty Wishlist */}
        {items.length === 0 ? (
          <div className="mt-16 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

            <div className="text-6xl">
              ♡
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              You haven't added any products to your wishlist yet.
              Start exploring Velora and save your favorite products.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block rounded-xl bg-blue-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Count */}
            <p className="mt-12 text-gray-600">
              {items.length}{" "}
              {items.length === 1 ? "product" : "products"} in your wishlist
            </p>

            {/* Products */}
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const product = item.product;

                const removing =
                  removingId === product.id;

                const cartLoading =
                  cartLoadingId === product.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* Product Image */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block"
                    >
                      <div className="flex h-48 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* Product Name */}
                      <h2 className="mt-5 text-xl font-semibold text-slate-900 hover:text-blue-900">
                        {product.name}
                      </h2>

                      {/* Category */}
                      <p className="mt-2 text-sm font-medium uppercase tracking-wide text-blue-900">
                        {product.category}
                      </p>

                      {/* Description */}
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                        {product.description}
                      </p>

                      {/* Price */}
                      <p className="mt-4 text-2xl font-bold text-blue-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>

                      {/* Stock */}
                      {product.stock > 0 ? (
                        <p className="mt-2 text-sm font-medium text-green-600">
                          ✓ {product.stock} items available
                        </p>
                      ) : (
                        <p className="mt-2 text-sm font-medium text-red-600">
                          Out of stock
                        </p>
                      )}
                    </Link>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(product.id)
                        }
                        disabled={removing}
                        className="flex-1 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {removing
                          ? "Removing..."
                          : "Remove"}
                      </button>

                      {/* Add to Cart */}
                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart(product.id)
                        }
                        disabled={
                          product.stock === 0 ||
                          cartLoading
                        }
                        className="flex-1 rounded-xl bg-blue-900 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {cartLoading
                          ? "Adding..."
                          : "Add to Cart"}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}