"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name?: string;
  fullName?: string;
  email: string;
};

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAccount = async () => {
      try {
        /*
         * Load the logged-in user's orders.
         *
         * Your existing /api/orders endpoint already verifies
         * the user's session and returns only their orders.
         */
        const ordersResponse = await fetch("/api/orders", {
          cache: "no-store",
        });

        const ordersData = await ordersResponse.json();

        if (!ordersResponse.ok) {
          setError(
            ordersData.message || "Unable to load your account."
          );
          return;
        }

        setOrders(ordersData.orders || []);

        /*
         * We use the shipping information from the latest order
         * as a temporary way to display the customer's information.
         *
         * This does NOT change your database.
         */
        if (ordersData.orders?.length > 0) {
          const latestOrder = ordersData.orders[0];

          setUser({
            id: latestOrder.userId || 0,
            fullName: latestOrder.fullName,
            email: latestOrder.email,
          });
        }
      } catch (error) {
        console.error("Account Load Error:", error);
        setError("Something went wrong while loading your account.");
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-slate-900">
            My Account
          </h1>

          <p className="mt-4 text-gray-600">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">⚠️</div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Unable to load account
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-blue-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );

  const latestOrder = orders[0];

  const displayName =
    user?.fullName ||
    user?.name ||
    "Velora Customer";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-900">
            My Account
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Welcome back, {displayName}! 👋
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your orders and account information from one place.
          </p>
        </div>

        {/* Statistics */}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {/* Orders */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalOrders}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                📦
              </div>

            </div>

            <Link
              href="/account/orders"
              className="mt-5 inline-block font-semibold text-blue-900 hover:text-blue-700"
            >
              View Orders →
            </Link>

          </div>

          {/* Total Spent */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Spent
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl">
                💰
              </div>

            </div>

            <p className="mt-5 text-sm text-gray-500">
              Across all your orders
            </p>

          </div>

          {/* Latest Order */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Latest Order
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {latestOrder
                    ? `#${latestOrder.id}`
                    : "—"}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-2xl">
                🧾
              </div>

            </div>

            {latestOrder ? (
              <Link
                href={`/order-success?id=${latestOrder.id}`}
                className="mt-5 inline-block font-semibold text-blue-900 hover:text-blue-700"
              >
                View Latest Order →
              </Link>
            ) : (
              <p className="mt-5 text-sm text-gray-500">
                No orders yet
              </p>
            )}

          </div>

        </div>

        {/* Main Content */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Recent Orders */}

          <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Recent Orders
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your latest purchases
                </p>
              </div>

              {orders.length > 0 && (
                <Link
                  href="/account/orders"
                  className="font-semibold text-blue-900 hover:text-blue-700"
                >
                  View All
                </Link>
              )}

            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center">

                <div className="text-5xl">
                  🛍️
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  No orders yet
                </h3>

                <p className="mt-2 text-gray-600">
                  Start shopping and your orders will appear here.
                </p>

                <Link
                  href="/"
                  className="mt-6 inline-block rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Start Shopping
                </Link>

              </div>
            ) : (
              <div className="mt-6 space-y-4">

                {orders.slice(0, 3).map((order) => (

                  <div
                    key={order.id}
                    className="flex flex-col gap-4 rounded-xl bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <p className="font-bold text-slate-900">
                        Order #{order.id}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
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

                      <span className="font-bold text-slate-900">
                        ₹
                        {order.totalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </section>

          {/* Account Information */}

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Account Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Name
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {displayName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all font-semibold text-slate-900">
                  {user?.email || "Not available"}
                </p>
              </div>

            </div>

            <div className="mt-7 border-t border-gray-200 pt-6">

              <Link
                href="/account/orders"
                className="block w-full rounded-xl bg-blue-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-800"
              >
                📦 My Orders
              </Link>

              <Link
                href="/"
                className="mt-3 block w-full rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-slate-800 transition hover:bg-gray-50"
              >
                🛍️ Continue Shopping
              </Link>

            </div>

          </aside>

        </div>

        {/* Footer */}

        <div className="mt-10 text-center text-sm text-gray-500">
          Thank you for being a part of{" "}
          <span className="font-semibold text-blue-900">
            Velora
          </span>
          . ❤️
        </div>

      </div>
    </main>
  );
}