"use client";

import { FormEvent, useState } from "react";
import styles from "./signup.module.css";

export default function SignupPage() {
  const [name, setName] = useState("");
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || "Registration failed.");
        return;
      }

      setIsError(false);
      setMessage("Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error);

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
            Create your Velora account
          </h1>

          <p className={styles.subtitle}>
            Join Velora and discover something made for you.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="name"
            >
              Full Name
            </label>

            <input
              className={styles.input}
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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
          Your information is securely stored with Velora.
        </p>
      </section>
    </main>
  );
}