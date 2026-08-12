"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Order = {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  createdAt: string;
};

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load orders.");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Load Admin Orders Error:", error);
      setError("Something went wrong while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: number,
    newStatus: string
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update order status.");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error("Update Order Status Error:", error);
      alert("Something went wrong while updating the order.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      const matchesSearch =
        !searchTerm ||
        order.id.toString().includes(searchTerm) ||
        order.fullName.toLowerCase().includes(searchTerm) ||
        order.email.toLowerCase().includes(searchTerm) ||
        order.phone.toLowerCase().includes(searchTerm);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-green-100 text-green-700";

      case "PROCESSING":
        return "bg-purple-100 text-purple-700";

      case "SHIPPED":
        return "bg-blue-100 text-blue-700";

      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold text-blue-900 hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Manage Orders
            </h1>

            <p className="mt-2 text-gray-600">
              View, search and manage customer orders.
            </p>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh Orders"}
          </button>

        </div>

        {/* Statistics */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                orders.filter(
                  (order) => order.status === "PENDING"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Shipped
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                orders.filter(
                  (order) => order.status === "SHIPPED"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {
                orders.filter(
                  (order) => order.status === "DELIVERED"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Filters */}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">

            {/* Search */}

            <div>
              <label
                htmlFor="order-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search Orders
              </label>

              <input
                id="order-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by order number, customer, email or phone..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Status Filter */}

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Filter by Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "All Orders" : status}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {orders.length}
            </span>{" "}
            orders
          </div>

        </section>

        {/* Error */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">

            <h2 className="font-bold text-red-800">
              Unable to load orders
            </h2>

            <p className="mt-2 text-red-700">
              {error}
            </p>

            <button
              onClick={loadOrders}
              className="mt-4 rounded-xl bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Loading */}

        {loading && orders.length === 0 && !error && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

            <div className="text-5xl">
              ⏳
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Loading orders...
            </h2>

            <p className="mt-2 text-gray-500">
              Please wait while we retrieve customer orders.
            </p>

          </div>
        )}

        {/* No Results */}

        {!loading &&
          !error &&
          filteredOrders.length === 0 && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

              <div className="text-6xl">
                📦
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No orders found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                {orders.length === 0
                  ? "Customer orders will appear here when they place an order."
                  : "Try changing your search or status filter."}
              </p>

            </div>
          )}

        {/* Orders Table */}

        {filteredOrders.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Customer Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update order status directly from this table.
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-50">

                  <tr className="text-left text-sm text-gray-500">

                    <th className="px-6 py-4 font-semibold">
                      Order
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Customer
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Payment
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Total
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Order */}

                      <td className="px-6 py-5">

                        <Link
                          href={`/order-success?id=${order.id}`}
                          className="font-bold text-blue-900 hover:text-blue-700"
                        >
                          #{order.id}
                        </Link>

                      </td>

                      {/* Customer */}

                      <td className="px-6 py-5">

                        <p className="font-semibold text-slate-900">
                          {order.fullName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.email}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.phone}
                        </p>

                      </td>

                      {/* Date */}

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Payment */}

                      <td className="px-6 py-5 text-sm font-medium text-gray-700">
                        {order.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </td>

                      {/* Total */}

                      <td className="px-6 py-5 font-bold text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-block rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-6 py-5 text-right">

                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(event) =>
                            updateOrderStatus(
                              order.id,
                              event.target.value
                            )
                          }
                          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {STATUS_OPTIONS.filter(
                            (status) => status !== "ALL"
                          ).map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* Footer */}

        <div className="mt-10 pb-8 text-center">

          <Link
            href="/admin"
            className="font-semibold text-blue-900 hover:text-blue-700"
          >
            ← Back to Admin Dashboard
          </Link>

        </div>

      </div>
    </main>
  );
}