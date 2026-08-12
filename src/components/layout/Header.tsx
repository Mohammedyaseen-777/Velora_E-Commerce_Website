"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

type User = {
  id: number;
  name: string;
  email: string;
};

type CartItem = {
  id: number;
  quantity: number;
};

type AuthMode = "login" | "signup";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Get current user
  const getCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser(data.user || null);
    } catch (error) {
      console.error("Failed to get current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Get cart count
  const getCartCount = async () => {
    try {
      const response = await fetch("/api/cart");

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();

      const items: CartItem[] = data.items || [];

      const totalQuantity = items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Failed to get cart count:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    getCartCount();

    const handleCartUpdated = () => {
      getCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  // Authentication success
  const handleAuthSuccess = async () => {
    setAuthMode(null);
    await getCurrentUser();
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      setUser(null);
      setUserMenuOpen(false);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <header
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "82px",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {/* Velora Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              minWidth: "180px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#2850a7",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
                fontWeight: 700,
              }}
            >
              V
            </div>

            <span
              style={{
                fontSize: "27px",
                fontWeight: 700,
                color: "#23458f",
                letterSpacing: "-0.5px",
              }}
            >
              Velora
            </span>
          </Link>

          {/* Search */}
          <div
            style={{
              flex: 1,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              style={{
                width: "100%",
                height: "54px",
                padding: "0 22px",
                border: "1px solid #d7dce5",
                borderRadius: "15px",
                outline: "none",
                fontSize: "16px",
                color: "#1f2937",
                backgroundColor: "#ffffff",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Right Side */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              minWidth: "250px",
              justifyContent: "flex-end",
            }}
          >
            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.84 4.61C20.3292 4.0992 19.7227 3.694 19.0552 3.41754C18.3877 3.14108 17.6723 2.99877 16.95 2.99877C16.2277 2.99877 15.5123 3.14108 14.8448 3.41754C14.1773 3.694 13.5708 4.0992 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50818 2.99871 7.04851 2.99871C5.58883 2.99871 4.18871 3.5783 3.15701 4.61C2.1253 5.6417 1.54572 7.04182 1.54572 8.50149C1.54572 9.96117 2.1253 11.3613 3.15701 12.393L12 21.23L20.843 12.393C21.354 11.8823 21.7594 11.276 22.0361 10.6086C22.3127 9.9412 22.4551 8.2251 22.0361 6.3984C21.7594 5.731 21.354 5.1247 20.843 4.614L20.84 4.61Z"
                  stroke="#111111"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#ff2d3d"
                />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Shopping Cart${
                cartCount > 0 ? `, ${cartCount} items` : ""
              }`}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <svg
                width="31"
                height="31"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H5L7.4 14.5C7.5 15.05 7.99 15.45 8.55 15.45H18.5C19.02 15.45 19.48 15.11 19.63 14.61L21 9H6"
                  stroke="#111111"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="20" r="1.5" fill="#111111" />
                <circle cx="18" cy="20" r="1.5" fill="#111111" />
              </svg>

              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-9px",
                    right: "-11px",
                    minWidth: "20px",
                    height: "20px",
                    padding: "0 5px",
                    borderRadius: "999px",
                    backgroundColor: "#23469a",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1,
                    border: "2px solid #ffffff",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {loading ? (
              <div
                style={{
                  height: "48px",
                  width: "92px",
                  borderRadius: "14px",
                  backgroundColor: "#e5e7eb",
                }}
              />
            ) : user ? (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((current) => !current)}
                  style={{
                    height: "48px",
                    padding: "0 20px",
                    border: "none",
                    borderRadius: "14px",
                    backgroundColor: "#23469a",
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {user.name}
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "58px",
                      right: 0,
                      width: "190px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      padding: "8px",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                    }}
                  >
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "block",
                        padding: "11px 12px",
                        borderRadius: "9px",
                        textDecoration: "none",
                        color: "#1f2937",
                        fontWeight: 500,
                      }}
                    >
                      My Account
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "block",
                        padding: "11px 12px",
                        borderRadius: "9px",
                        textDecoration: "none",
                        color: "#1f2937",
                        fontWeight: 500,
                      }}
                    >
                      My Orders
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                        padding: "11px 12px",
                        borderRadius: "9px",
                        color: "#dc2626",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                style={{
                  height: "48px",
                  padding: "0 24px",
                  border: "none",
                  borderRadius: "14px",
                  backgroundColor: "#23469a",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}