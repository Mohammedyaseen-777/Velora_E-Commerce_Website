"use client";

import { useState } from "react";

export default function TestProductPage() {
  const [message, setMessage] = useState("");

  const createProduct = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Velora Premium Headphones",
          description:
            "Premium wireless headphones with immersive sound and a comfortable design.",
          price: 4999,
          image: "/products/headphones.jpg",
          category: "Electronics",
          stock: 25,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create product.");
        return;
      }

      setMessage("Product created successfully!");
      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
      }}
    >
      <button
        onClick={createProduct}
        style={{
          height: "52px",
          padding: "0 28px",
          border: "none",
          borderRadius: "14px",
          backgroundColor: "#23469a",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Create Test Product
      </button>

      {message && (
        <p
          style={{
            position: "absolute",
            marginTop: "140px",
            fontSize: "16px",
            color: "#111827",
          }}
        >
          {message}
        </p>
      )}
    </main>
  );
}