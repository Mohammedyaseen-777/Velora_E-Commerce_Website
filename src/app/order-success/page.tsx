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
  paymentMethod: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  items: OrderItem[];
};

const orderStages = [
  {
    key: "PENDING",
    label: "Order Placed",
    icon: "✓",
  },
  {
    key: "CONFIRMED",
    label: "Order Confirmed",
    icon: "✓",
  },
  {
    key: "PROCESSING",
    label: "Processing",
    icon: "⚙",
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    icon: "🚚",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: "✓",
  },
];

const getStageIndex = (status: string) => {
  const normalizedStatus = status.toUpperCase();

  const index = orderStages.findIndex(
    (stage) => stage.key === normalizedStatus
  );

  return index === -1 ? 0 : index;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const orderId = params.get("id");

        if (!orderId) {
          setError("Order ID is missing.");
          return;
        }

        const response = await fetch(
          `/api/orders?id=${orderId}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to load order."
          );
          return;
        }

        if (!data.order) {
          setError("Order not found.");
          return;
        }

        setOrder(data.order);
      } catch (error) {
        console.error(
          "Load Order Error:",
          error
        );

        setError(
          "Unable to load your order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-5xl">
            ⏳
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Loading your order...
          </h1>

          <p className="mt-3 text-gray-600">
            Please wait while we retrieve your order details.
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="text-6xl">
            ⚠️
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Unable to load order
          </h1>

          <p className="mt-3 text-gray-600">
            {error ||
              "Something went wrong while loading your order."}
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-blue-900 px-7 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate =
    new Date(order.createdAt).toLocaleString(
      "en-IN",
      {
        dateStyle: "long",
        timeStyle: "short",
      }
    );

  const paymentLabel =
    order.paymentMethod === "COD"
      ? "Cash on Delivery"
      : order.paymentMethod;

  const currentStageIndex =
    getStageIndex(order.status);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* ================================
            SUCCESS HEADER
        ================================= */}

        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
            ✓
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            Order Placed Successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Thank you for shopping with Velora.
            Your order has been successfully placed.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 font-semibold text-blue-900">
            Order #{order.id}
          </div>

        </div>

        {/* ================================
            ORDER STATUS TIMELINE
        ================================= */}

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">

            <h2 className="text-2xl font-bold text-slate-900">
              Order Status
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Track the progress of your order.
            </p>

          </div>

          {/* Desktop Timeline */}

          <div className="mt-10 hidden md:block">

            <div className="relative">

              {/* Background Line */}

              <div className="absolute left-0 right-0 top-6 h-1 rounded-full bg-gray-200" />

              {/* Completed Line */}

              <div
                className="absolute left-0 top-6 h-1 rounded-full bg-blue-900 transition-all duration-500"
                style={{
                  width:
                    currentStageIndex === 0
                      ? "0%"
                      : `${(
                          currentStageIndex /
                          (orderStages.length - 1)
                        ) *
                        100}%`,
                }}
              />

              <div className="relative grid grid-cols-5">

                {orderStages.map(
                  (stage, index) => {

                    const isCompleted =
                      index <
                      currentStageIndex;

                    const isCurrent =
                      index ===
                      currentStageIndex;

                    return (
                      <div
                        key={stage.key}
                        className="flex flex-col items-center"
                      >

                        {/* Circle */}

                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full border-4 text-lg font-bold transition-all duration-300 ${
                            isCompleted
                              ? "border-blue-900 bg-blue-900 text-white"
                              : isCurrent
                              ? "border-blue-900 bg-white text-blue-900 ring-4 ring-blue-100"
                              : "border-gray-200 bg-white text-gray-400"
                          }`}
                        >
                          {isCompleted ||
                          isCurrent
                            ? stage.icon
                            : index + 1}
                        </div>

                        {/* Label */}

                        <p
                          className={`mt-4 text-center text-sm font-semibold ${
                            isCompleted ||
                            isCurrent
                              ? "text-blue-900"
                              : "text-gray-400"
                          }`}
                        >
                          {stage.label}
                        </p>

                        {/* Current Badge */}

                        {isCurrent && (
                          <span className="mt-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
                            CURRENT
                          </span>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </div>

          {/* Mobile Timeline */}

          <div className="mt-8 md:hidden">

            <div className="space-y-0">

              {orderStages.map(
                (stage, index) => {

                  const isCompleted =
                    index <
                    currentStageIndex;

                  const isCurrent =
                    index ===
                    currentStageIndex;

                  const isLast =
                    index ===
                    orderStages.length - 1;

                  return (
                    <div
                      key={stage.key}
                      className="relative flex gap-4"
                    >

                      {/* Vertical Line */}

                      {!isLast && (
                        <div
                          className={`absolute left-5 top-11 h-full w-1 ${
                            index <
                            currentStageIndex
                              ? "bg-blue-900"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* Circle */}

                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-sm font-bold ${
                          isCompleted
                            ? "border-blue-900 bg-blue-900 text-white"
                            : isCurrent
                            ? "border-blue-900 bg-white text-blue-900 ring-4 ring-blue-100"
                            : "border-gray-200 bg-white text-gray-400"
                        }`}
                      >
                        {isCompleted ||
                        isCurrent
                          ? stage.icon
                          : index + 1}
                      </div>

                      {/* Text */}

                      <div className="pb-8">

                        <p
                          className={`font-semibold ${
                            isCompleted ||
                            isCurrent
                              ? "text-blue-900"
                              : "text-gray-400"
                          }`}
                        >
                          {stage.label}
                        </p>

                        {isCurrent && (
                          <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-900">
                            CURRENT
                          </span>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* ================================
            ORDER DETAILS
        ================================= */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* LEFT SIDE */}

          <div className="space-y-8">

            {/* Ordered Products */}

            <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

              <h2 className="text-2xl font-bold text-slate-900">
                Ordered Products
              </h2>

              <div className="mt-6 space-y-5">

                {order.items.map(
                  (item) => (

                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                    >

                      {/* Product Image */}

                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                        {item.product?.image ? (
                          <img
                            src={
                              item.product.image
                            }
                            alt={
                              item.productName
                            }
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-2xl">
                            📦
                          </span>
                        )}

                      </div>

                      {/* Product Info */}

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-slate-900">
                          {item.productName}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity:{" "}
                          {item.quantity}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹
                          {item.price.toLocaleString(
                            "en-IN"
                          )}{" "}
                          ×{" "}
                          {item.quantity}
                        </p>

                      </div>

                      {/* Item Total */}

                      <div className="text-right">

                        <p className="font-bold text-slate-900">
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

            {/* Shipping Information */}

            <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

              <h2 className="text-2xl font-bold text-slate-900">
                Shipping Information
              </h2>

              <div className="mt-6 space-y-3 text-gray-700">

                <p>
                  <span className="font-semibold text-slate-900">
                    Name:
                  </span>{" "}
                  {order.fullName}
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    Email:
                  </span>{" "}
                  {order.email}
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    Phone:
                  </span>{" "}
                  {order.phone}
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    Address:
                  </span>{" "}
                  {order.address}
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    City:
                  </span>{" "}
                  {order.city}
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    State:
                  </span>{" "}
                  {order.state}
                </p>

                <p>
                  <span className="font-semibold text-slate-900">
                    PIN Code:
                  </span>{" "}
                  {order.pincode}
                </p>

              </div>

            </section>

          </div>

          {/* RIGHT SIDE */}

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:sticky lg:top-28">

            <h2 className="text-2xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {/* Order Number */}

              <div className="flex justify-between text-gray-600">

                <span>
                  Order Number
                </span>

                <span className="font-semibold text-slate-900">
                  #{order.id}
                </span>

              </div>

              {/* Status */}

              <div className="flex justify-between gap-4 text-gray-600">

                <span>
                  Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    order.status ===
                    "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : order.status ===
                        "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>

              </div>

              {/* Payment Method */}

              <div className="flex justify-between gap-4 text-gray-600">

                <span>
                  Payment
                </span>

                <span className="text-right font-semibold text-slate-900">
                  {paymentLabel}
                </span>

              </div>

              {/* Order Date */}

              <div className="flex justify-between gap-4 text-gray-600">

                <span>
                  Order Date
                </span>

                <span className="text-right font-semibold text-slate-900">
                  {formattedDate}
                </span>

              </div>

            </div>

            {/* Total */}

            <div className="mt-7 border-t border-gray-200 pt-6">

              <div className="flex items-center justify-between">

                <span className="text-lg font-bold text-slate-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-blue-900">
                  ₹
                  {order.totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

            </div>

            {/* Payment Information */}

            <div className="mt-6 rounded-xl bg-blue-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl">
                  {order.paymentMethod ===
                  "COD"
                    ? "💵"
                    : "💳"}
                </div>

                <div>

                  <p className="font-semibold text-blue-900">
                    {paymentLabel}
                  </p>

                  {order.paymentMethod ===
                  "COD" ? (
                    <p className="mt-1 text-sm text-blue-700">
                      Payment will be collected
                      when your order is delivered.
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-blue-700">
                      Your selected payment method
                      has been recorded.
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* Confirmation */}

            <div className="mt-4 rounded-xl bg-green-50 p-4 text-center">

              <p className="font-semibold text-green-700">
                ✓ Order confirmed
              </p>

              <p className="mt-1 text-sm text-green-600">
                Your order has been received successfully.
              </p>

            </div>

            {/* Continue Shopping */}

            <Link
              href="/"
              className="mt-7 block w-full rounded-xl bg-blue-900 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-800"
            >
              Continue Shopping
            </Link>

            {/* Account */}

            <Link
              href="/account"
              className="mt-4 block text-center font-semibold text-blue-900 transition hover:text-blue-700"
            >
              View My Account
            </Link>

          </aside>

        </div>

        {/* Footer */}

        <div className="mt-10 text-center text-sm text-gray-500">

          Thank you for choosing{" "}

          <span className="font-semibold text-blue-900">
            Velora
          </span>

          . ❤️

        </div>

      </div>
    </main>
  );
}