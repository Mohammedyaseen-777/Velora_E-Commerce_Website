"use client";

import { useState } from "react";

type AddToCartButtonProps = {
  productId: number;
  stock: number;
};

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addToCart = async () => {
    setLoading(true);
    setMessage("");

    try {
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
        setMessage(data.message || "Unable to add product.");
        return;
      }

      setMessage("✓ Product added to cart!");
    } catch (error) {
      console.error("Add To Cart Error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={addToCart}
        disabled={stock === 0 || loading}
        className="rounded-xl bg-blue-900 px-8 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {message && (
        <p
          className={`mt-4 font-medium ${
            message.startsWith("✓")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}