"use client";

import { FormEvent, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Login failed.");
        return;
      }

      setIsError(false);
      setMessage("Login successful!");

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);

      setIsError(true);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>V</div>

          <h1 className={styles.title}>
            Welcome back
          </h1>

          <p className={styles.subtitle}>
            Sign in to continue to Velora.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="email"
            >
              Email Address
            </label>

            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="password"
            >
              Password
            </label>

            <input
              className={styles.input}
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p
            className={
              isError
                ? styles.error
                : styles.success
            }
          >
            {message}
          </p>
        )}

        <p className={styles.footer}>
          Welcome back to Velora.
        </p>
      </section>
    </main>
  );
}