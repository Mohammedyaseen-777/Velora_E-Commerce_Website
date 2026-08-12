"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
};

const ROLE_OPTIONS = ["ALL", "USER", "ADMIN"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load users.");
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("Load Admin Users Error:", error);
      setError("Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUserRole = async (
    userId: number,
    newRole: string
  ) => {
    try {
      setUpdatingId(userId);

      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update user role.");
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );
    } catch (error) {
      console.error("Update User Role Error:", error);
      alert("Something went wrong while updating the user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      const matchesSearch =
        !searchTerm ||
        user.id.toString().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const getRoleClass = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700";

      case "USER":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
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
              className="text-sm font-semibold text-blue-900 transition hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Manage Users
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage registered Velora users.
            </p>
          </div>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "↻ Refresh Users"}
          </button>

        </div>

        {/* Statistics */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Users
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Customers
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                users.filter(
                  (user) => user.role === "USER"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Administrators
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {
                users.filter(
                  (user) => user.role === "ADMIN"
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
                htmlFor="user-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search Users
              </label>

              <input
                id="user-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, email or user ID..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Role Filter */}

            <div>
              <label
                htmlFor="role-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Filter by Role
              </label>

              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role === "ALL"
                      ? "All Users"
                      : role}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {users.length}
            </span>{" "}
            users
          </div>

        </section>

        {/* Error */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">

            <h2 className="font-bold text-red-800">
              Unable to load users
            </h2>

            <p className="mt-2 text-red-700">
              {error}
            </p>

            <button
              onClick={loadUsers}
              className="mt-4 rounded-xl bg-red-700 px-5 py-2.5 font-semibold text-white transition hover:bg-red-800"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Loading */}

        {loading &&
          users.length === 0 &&
          !error && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

              <div className="text-5xl">
                ⏳
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Loading users...
              </h2>

              <p className="mt-2 text-gray-500">
                Please wait while we retrieve user accounts.
              </p>

            </div>
          )}

        {/* No Results */}

        {!loading &&
          !error &&
          filteredUsers.length === 0 && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

              <div className="text-6xl">
                👤
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No users found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                {users.length === 0
                  ? "Registered users will appear here."
                  : "Try changing your search or role filter."}
              </p>

            </div>
          )}

        {/* Users Table */}

        {filteredUsers.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-6">

              <h2 className="text-xl font-bold text-slate-900">
                Registered Users
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage user accounts and administrator roles.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead className="bg-slate-50">

                  <tr className="text-left text-sm text-gray-500">

                    <th className="px-6 py-4 font-semibold">
                      User
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Email
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Joined
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Orders
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Role
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* User */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-900">
                            {user.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {user.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ID #{user.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}

                      <td className="px-6 py-5 text-sm text-gray-700">
                        {user.email}
                      </td>

                      {/* Joined */}

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Orders */}

                      <td className="px-6 py-5">

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                          {user._count.orders}
                        </span>

                      </td>

                      {/* Role */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-block rounded-full px-3 py-1.5 text-xs font-bold ${getRoleClass(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-6 py-5 text-right">

                        <select
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(event) =>
                            updateUserRole(
                              user.id,
                              event.target.value
                            )
                          }
                          className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="USER">
                            USER
                          </option>

                          <option value="ADMIN">
                            ADMIN
                          </option>
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
            className="font-semibold text-blue-900 transition hover:text-blue-700"
          >
            ← Back to Admin Dashboard
          </Link>

        </div>

      </div>
    </main>
  );
}