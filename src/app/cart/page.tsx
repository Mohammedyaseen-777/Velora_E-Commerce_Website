"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
};

type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(
    null
  );
  const [removingItemId, setRemovingItemId] = useState<number | null>(
    null
  );

  // Load cart
  const loadCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        cache: "no-store",
      });

      if (!response.ok) {
        setItems([]);
        return;
      }

      const data = await response.json();

      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Update quantity
  const updateQuantity = async (
    itemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      return;
    }

    const item = items.find((current) => current.id === itemId);

    if (!item) {
      return;
    }

    if (newQuantity > item.product.stock) {
      alert(
        `Only ${item.product.stock} item(s) are available.`
      );
      return;
    }

    try {
      setUpdatingItemId(itemId);

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Unable to update cart item:",
          data.message || "Unknown error"
        );

        alert(
          data.message ||
            "Unable to update cart quantity."
        );

        return;
      }

      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === itemId
            ? {
                ...currentItem,
                quantity: data.item.quantity,
              }
            : currentItem
        )
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Update Cart Error:", error);

      alert(
        "Something went wrong while updating the cart."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Remove item
  const removeItem = async (itemId: number) => {
    try {
      setRemovingItemId(itemId);

      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          "Unable to remove cart item:",
          data.message || "Unknown error"
        );

        alert(
          data.message ||
            "Unable to remove product from cart."
        );

        return;
      }

      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) => currentItem.id !== itemId
        )
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Remove Cart Error:", error);

      alert(
        "Something went wrong while removing the product."
      );
    } finally {
      setRemovingItemId(null);
    }
  };

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0
  );

  // Calculate total quantity
  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-slate-900">
            Your Cart
          </h1>

          <p className="mt-4 text-gray-600">
            Loading your cart...
          </p>
        </div>
      </main>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <h1 className="text-4xl font-bold text-slate-900">
            Your Cart
          </h1>

          <div className="mt-12 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

            <div className="text-6xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              Looks like you haven't added anything to
              your cart yet.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block rounded-xl bg-blue-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">

      <div className="mx-auto max-w-7xl">

        {/* Page Header */}

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Your Cart
          </h1>

          <p className="mt-3 text-gray-600">
            Review your products before checkout.
          </p>
        </div>

        {/* Cart Layout */}

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT SIDE */}

          <section className="space-y-5">

            {items.map((item) => {
              const isUpdating =
                updatingItemId === item.id;

              const isRemoving =
                removingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                    {/* Product Image */}

                    <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">

                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain"
                      />

                    </div>

                    {/* Product Information */}

                    <div className="min-w-0 flex-1">

                      <Link
                        href={`/products/${item.product.id}`}
                        className="text-xl font-bold text-slate-900 transition hover:text-blue-900"
                      >
                        {item.product.name}
                      </Link>

                      <p className="mt-2 text-lg font-bold text-blue-900">
                        ₹
                        {item.product.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Stock available:{" "}
                        {item.product.stock}
                      </p>

                    </div>

                    {/* Quantity Controls */}

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={
                          isUpdating ||
                          isRemoving ||
                          item.quantity <= 1
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-xl font-bold text-slate-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 font-semibold text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          isUpdating ||
                          isRemoving ||
                          item.quantity >=
                            item.product.stock
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-xl font-bold text-slate-900 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>

                    </div>

                    {/* Item Total */}

                    <div className="text-right sm:min-w-[120px]">

                      <p className="text-lg font-bold text-slate-900">
                        ₹
                        {(
                          item.product.price *
                          item.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                      {/* Remove */}

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        disabled={
                          isRemoving || isUpdating
                        }
                        className="mt-3 text-sm font-semibold text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isRemoving
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </section>

          {/* RIGHT SIDE */}

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:sticky lg:top-28">

            <h2 className="text-2xl font-bold text-slate-900">
              Order Summary
            </h2>

            {/* Items */}

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>
                  Items
                </span>

                <span className="font-semibold text-slate-900">
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal
                </span>

                <span className="font-semibold text-slate-900">
                  ₹
                  {subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>
                  Shipping
                </span>

                <span className="font-semibold text-green-600">
                  FREE
                </span>
              </div>

            </div>

            {/* Total */}

            <div className="mt-6 border-t border-gray-200 pt-6">

              <div className="flex items-center justify-between">

                <span className="text-lg font-bold text-slate-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-blue-900">
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* Proceed to Checkout */}

            <Link
              href="/checkout"
              className="mt-8 block w-full rounded-xl bg-blue-900 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-800"
            >
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}

            <Link
              href="/"
              className="mt-4 block text-center font-semibold text-blue-900 transition hover:text-blue-700"
            >
              ← Continue Shopping
            </Link>

            {/* Security */}

            <p className="mt-6 text-center text-xs text-gray-500">
              🔒 Your cart and information are securely handled.
            </p>

          </aside>

        </div>

      </div>

    </main>
  );
}