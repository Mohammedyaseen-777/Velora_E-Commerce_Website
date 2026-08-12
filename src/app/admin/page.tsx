"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardStats = {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  lowStockProducts: number;
  outOfStockProducts: number;
};

type RecentOrder = {
  id: number;
  totalAmount: number;
  status: string;
  fullName: string;
  email: string;
  createdAt: string;
};

type AnalyticsResponse = {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/analytics", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message || "Unable to load dashboard data."
        );
        return;
      }

      setData(result);
    } catch (error) {
      console.error("Admin Analytics Error:", error);

      setError(
        "Something went wrong while loading the dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700";

      case "PROCESSING":
        return "bg-blue-100 text-blue-700";

      case "SHIPPED":
        return "bg-purple-100 text-purple-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading && !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-5xl">⏳</div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Loading Velora Admin...
          </h1>

          <p className="mt-2 text-gray-500">
            Preparing your dashboard.
          </p>
        </div>
      </main>
    );
  }

  if (error && !data) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-red-800">
            Dashboard Error
          </h1>

          <p className="mt-2 text-red-700">{error}</p>

          <button
            onClick={loadAnalytics}
            className="mt-6 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const stats = data?.stats;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-900">
              Velora Administration
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Monitor your store, orders, customers and inventory.
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh Dashboard"}
          </button>

        </div>

        {/* ERROR BANNER */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
            {error}
          </div>
        )}

        {/* MAIN STATISTICS */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* REVENUE */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div className="text-3xl">💰</div>

              <span className="text-xs font-bold uppercase tracking-wide text-emerald-600">
                Revenue
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Revenue
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {formatCurrency(stats?.totalRevenue ?? 0)}
            </p>

          </div>

          {/* ORDERS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div className="text-3xl">📦</div>

              <span className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Orders
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {stats?.totalOrders ?? 0}
            </p>

          </div>

          {/* USERS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div className="text-3xl">👤</div>

              <span className="text-xs font-bold uppercase tracking-wide text-purple-600">
                Customers
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Registered Users
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {stats?.totalUsers ?? 0}
            </p>

          </div>

          {/* PRODUCTS */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div className="text-3xl">🛍️</div>

              <span className="text-xs font-bold uppercase tracking-wide text-orange-600">
                Catalogue
              </span>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              Total Products
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {stats?.totalProducts ?? 0}
            </p>

          </div>

        </section>

        {/* ORDER STATUS */}

        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Order Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current order status across your store.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6">

              <p className="text-sm font-semibold text-yellow-700">
                Pending Orders
              </p>

              <p className="mt-2 text-4xl font-bold text-yellow-800">
                {stats?.pendingOrders ?? 0}
              </p>

              <Link
                href="/admin/orders"
                className="mt-4 inline-block text-sm font-bold text-yellow-800 hover:underline"
              >
                View Orders →
              </Link>

            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

              <p className="text-sm font-semibold text-blue-700">
                Processing Orders
              </p>

              <p className="mt-2 text-4xl font-bold text-blue-800">
                {stats?.processingOrders ?? 0}
              </p>

              <Link
                href="/admin/orders"
                className="mt-4 inline-block text-sm font-bold text-blue-800 hover:underline"
              >
                Manage Orders →
              </Link>

            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">

              <p className="text-sm font-semibold text-emerald-700">
                Completed Orders
              </p>

              <p className="mt-2 text-4xl font-bold text-emerald-800">
                {stats?.completedOrders ?? 0}
              </p>

              <Link
                href="/admin/orders"
                className="mt-4 inline-block text-sm font-bold text-emerald-800 hover:underline"
              >
                View Completed →
              </Link>

            </div>

          </div>

        </section>

        {/* INVENTORY ALERTS */}

        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Inventory Alerts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products that may require your attention.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl border border-yellow-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Low Stock
                  </p>

                  <p className="mt-1 text-4xl font-bold text-yellow-600">
                    {stats?.lowStockProducts ?? 0}
                  </p>
                </div>

                <div className="text-4xl">
                  ⚠️
                </div>

              </div>

              <Link
                href="/admin/products"
                className="mt-5 inline-block font-semibold text-yellow-700 hover:underline"
              >
                Manage Inventory →
              </Link>

            </div>

            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Out of Stock
                  </p>

                  <p className="mt-1 text-4xl font-bold text-red-600">
                    {stats?.outOfStockProducts ?? 0}
                  </p>
                </div>

                <div className="text-4xl">
                  🚨
                </div>

              </div>

              <Link
                href="/admin/products"
                className="mt-5 inline-block font-semibold text-red-700 hover:underline"
              >
                Update Products →
              </Link>

            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <Link
              href="/admin/products"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="text-3xl">🛍️</div>

              <h3 className="mt-4 font-bold text-slate-900">
                Manage Products
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add, edit and manage your product catalogue.
              </p>
            </Link>

            <Link
              href="/admin/orders"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="text-3xl">📦</div>

              <h3 className="mt-4 font-bold text-slate-900">
                Manage Orders
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage customer orders.
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <div className="text-3xl">👤</div>

              <h3 className="mt-4 font-bold text-slate-900">
                Manage Users
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View customers and manage user roles.
              </p>
            </Link>

          </div>

        </section>

        {/* RECENT ORDERS */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex flex-col gap-3 border-b border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest activity from your store.
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="font-semibold text-blue-900 hover:underline"
            >
              View All Orders →
            </Link>

          </div>

          {data?.recentOrders &&
          data.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="bg-slate-50">

                  <tr className="text-left text-sm text-gray-500">

                    <th className="px-6 py-4 font-semibold">
                      Order
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Customer
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {data.recentOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-5 font-bold text-slate-900">
                        #{order.id}
                      </td>

                      <td className="px-6 py-5">

                        <p className="font-semibold text-slate-900">
                          {order.fullName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.email}
                        </p>

                      </td>

                      <td className="px-6 py-5 font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="p-12 text-center">

              <div className="text-5xl">
                📦
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                No orders yet
              </h3>

              <p className="mt-2 text-gray-500">
                Orders will appear here once customers start purchasing.
              </p>

            </div>
          )}

        </section>

        {/* FOOTER */}

        <div className="mt-10 pb-8 text-center text-sm text-gray-500">
          Velora Admin Dashboard
        </div>

      </div>
    </main>
  );
}