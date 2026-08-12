"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  image: string;
};

type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  product: Product | null;
};

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("/api/orders", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to load your orders."
          );
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Load Orders Error:", error);

        setError(
          "Something went wrong while loading your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-slate-900">
            My Orders
          </h1>

          <p className="mt-4 text-gray-600">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-slate-900">
            My Orders
          </h1>

          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-800">
              Unable to load orders
            </h2>

            <p className="mt-2 text-red-700">
              {error}
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // No orders
  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-slate-900">
            My Orders
          </h1>

          <p className="mt-3 text-gray-600">
            View and manage your previous orders.
          </p>

          <div className="mt-12 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-6xl">📦</div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              You haven't placed any orders yet. Start
              shopping and your orders will appear here.
            </p>

            <Link
              href="/"
              className="mt-8 inline-block rounded-xl bg-blue-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            My Orders
          </h1>

          <p className="mt-3 text-gray-600">
            View your order history and order details.
          </p>
        </div>

        {/* Orders */}
        <div className="mt-10 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >

              {/* Order Header */}
              <div className="flex flex-col gap-5 border-b border-gray-200 p-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Order Number
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    #{order.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Order Date
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total
                  </p>

                  <p className="mt-1 text-xl font-bold text-blue-900">
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

              </div>

              {/* Products */}
              <div className="p-6">

                <h2 className="text-lg font-bold text-slate-900">
                  Ordered Products
                </h2>

                <div className="mt-5 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-xl bg-gray-50 p-4"
                    >

                      {/* Product Image */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                        {item.product?.image ? (
                          <img
                            src={item.product.image}
                            alt={item.productName}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-2xl">
                            📦
                          </span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {item.productName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}{" "}
                          × {item.quantity}
                        </p>
                      </div>

                      {/* Item Total */}
                      <p className="font-bold text-slate-900">
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-sm text-gray-500">
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "product"
                      : "products"}{" "}
                    in this order
                  </p>

                  <Link
                    href={`/order-success?id=${order.id}`}
                    className="rounded-xl bg-blue-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-800"
                  >
                    View Order Details
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="font-semibold text-blue-900 transition hover:text-blue-700"
          >
            ← Continue Shopping
          </Link>
        </div>

      </div>
    </main>
  );
}