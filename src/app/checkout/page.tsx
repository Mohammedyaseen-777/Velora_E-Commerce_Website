"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

type PaymentMethod = "COD";

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | "">("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load cart
  useEffect(() => {
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
        console.error(
          "Failed to load checkout cart:",
          error
        );

        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // Handle shipping form changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  // Calculate total items
  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // Place order
  const handlePlaceOrder = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    try {
      setPlacingOrder(true);

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to place your order. Please try again."
        );

        return;
      }

      // Tell Header that cart has changed
      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // Redirect to order success page
      if (data.order?.id) {
        router.push(
          `/order-success?id=${data.order.id}`
        );

        return;
      }

      alert(
        "Order placed successfully! 🎉"
      );
    } catch (error) {
      console.error(
        "Checkout Error:",
        error
      );

      alert(
        "Something went wrong while placing your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <h1 className="text-4xl font-bold text-slate-900">
            Checkout
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
            Checkout
          </h1>

          <div className="mt-12 rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

            <div className="text-6xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-600">
              Add some products to your cart before
              proceeding to checkout.
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

        {/* Header */}

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Checkout
          </h1>

          <p className="mt-3 text-gray-600">
            Complete your details to place your order.
          </p>
        </div>

        {/* Checkout Layout */}

        <form
          onSubmit={handlePlaceOrder}
          className="mt-12 grid gap-8 lg:grid-cols-[1fr_400px]"
        >

          {/* LEFT SIDE */}

          <div className="space-y-8">

            {/* Shipping Information */}

            <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

              <h2 className="text-2xl font-bold text-slate-900">
                Shipping Information
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter the address where you want your order
                delivered.
              </p>

              <div className="mt-7 grid gap-5">

                {/* Full Name */}

                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Email + Phone */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                </div>

                {/* Address */}

                <div>
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Address
                  </label>

                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House no., street, area"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* City + State */}

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ahmedabad"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      State
                    </label>

                    <input
                      id="state"
                      name="state"
                      type="text"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Gujarat"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                </div>

                {/* Pincode */}

                <div className="sm:w-1/2">

                  <label
                    htmlFor="pincode"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    PIN Code
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="380001"
                    maxLength={6}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </section>

            {/* Payment Method */}

            <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Payment Method
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Choose how you would like to pay for your order.
                </p>
              </div>

              <div className="mt-6 space-y-4">

                {/* Cash on Delivery */}

                <label
                  className={`block cursor-pointer rounded-2xl border-2 p-5 transition ${
                    paymentMethod === "COD"
                      ? "border-blue-900 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >

                  <div className="flex items-start gap-4">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={
                        paymentMethod === "COD"
                      }
                      onChange={() =>
                        setPaymentMethod("COD")
                      }
                      className="mt-1 h-5 w-5 accent-blue-900"
                    />

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl">
                      💵
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <p className="font-bold text-slate-900">
                          Cash on Delivery
                        </p>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          AVAILABLE
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-gray-600">
                        Pay when your order is delivered to you.
                      </p>

                    </div>

                  </div>

                </label>

                {/* UPI */}

                <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 opacity-75">

                  <div className="flex items-start gap-4">

                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-gray-300" />

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl">
                      📱
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <p className="font-bold text-slate-900">
                          UPI
                        </p>

                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                          COMING SOON
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Google Pay, PhonePe, Paytm and other UPI apps.
                      </p>

                    </div>

                  </div>

                </div>

                {/* Credit / Debit Card */}

                <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 opacity-75">

                  <div className="flex items-start gap-4">

                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-gray-300" />

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl">
                      💳
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <p className="font-bold text-slate-900">
                          Credit / Debit Card
                        </p>

                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                          COMING SOON
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Visa, Mastercard, RuPay and other cards.
                      </p>

                    </div>

                  </div>

                </div>

                {/* Net Banking */}

                <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 opacity-75">

                  <div className="flex items-start gap-4">

                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-gray-300" />

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-2xl">
                      🏦
                    </div>

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <p className="font-bold text-slate-900">
                          Net Banking
                        </p>

                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-bold text-gray-600">
                          COMING SOON
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Pay securely through your bank account.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* Selection Notice */}

              {!paymentMethod && (
                <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

                  <p className="text-sm font-semibold text-yellow-800">
                    Please select a payment method before placing your order.
                  </p>

                </div>
              )}

            </section>

          </div>

          {/* RIGHT SIDE */}

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:sticky lg:top-28">

            <h2 className="text-2xl font-bold text-slate-900">
              Order Summary
            </h2>

            {/* Products */}

            <div className="mt-6 space-y-5">

              {items.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4"
                >

                  {/* Image */}

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">

                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-contain"
                    />

                  </div>

                  {/* Product */}

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-semibold text-slate-900">
                      {item.product.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                  </div>

                  {/* Price */}

                  <p className="font-semibold text-slate-900">
                    ₹
                    {(
                      item.product.price *
                      item.quantity
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

              ))}

            </div>

            {/* Summary */}

            <div className="mt-7 space-y-4 border-t border-gray-200 pt-6">

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

              {/* Selected Payment */}

              <div className="flex justify-between border-t border-gray-200 pt-4 text-gray-600">

                <span>
                  Payment
                </span>

                <span className="font-semibold text-slate-900">
                  {paymentMethod === "COD"
                    ? "Cash on Delivery"
                    : "Not selected"}
                </span>

              </div>

              {/* Total */}

              <div className="border-t border-gray-200 pt-5">

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

            </div>

            {/* Place Order */}

            <button
              type="submit"
              disabled={
                placingOrder ||
                !paymentMethod
              }
              className="mt-8 w-full rounded-xl bg-blue-900 px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {placingOrder
                ? "Processing..."
                : "Place Order"}
            </button>

            <Link
              href="/cart"
              className="mt-4 block text-center font-semibold text-blue-900 hover:text-blue-700"
            >
              ← Back to Cart
            </Link>

            <p className="mt-5 text-center text-xs text-gray-500">
              🔒 Your information is securely handled.
            </p>

          </aside>

        </form>

      </div>

    </main>
  );
}