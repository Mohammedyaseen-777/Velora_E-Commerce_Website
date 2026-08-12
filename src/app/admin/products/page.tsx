"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: string;
};

const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: "0",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load products.");
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Load Products Error:", error);
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category.trim())
          .filter(Boolean)
      )
    );

    return uniqueCategories.sort((a, b) =>
      a.localeCompare(b)
    );
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category === categoryFilter;

      const matchesSearch =
        !searchTerm ||
        product.id.toString().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, categoryFilter]);

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock <= 0
  ).length;

  const openAddForm = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
    });

    setShowForm(true);
    setError("");
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
  };

  const updateForm = (
    field: keyof ProductForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!form.description.trim()) {
      alert("Product description is required.");
      return;
    }

    if (!form.category.trim()) {
      alert("Product category is required.");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!Number.isFinite(price) || price < 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be a whole number greater than or equal to 0.");
      return;
    }

    try {
      setSaving(true);

      const method = editingProduct ? "PATCH" : "POST";

      const body = editingProduct
        ? {
            id: editingProduct.id,
            name: form.name.trim(),
            description: form.description.trim(),
            price,
            image: form.image.trim(),
            category: form.category.trim(),
            stock,
          }
        : {
            name: form.name.trim(),
            description: form.description.trim(),
            price,
            image: form.image.trim(),
            category: form.category.trim(),
            stock,
          };

      const response = await fetch("/api/admin/products", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to save product.");
        return;
      }

      if (editingProduct) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === data.product.id
              ? data.product
              : product
          )
        );
      } else {
        setProducts((currentProducts) => [
          data.product,
          ...currentProducts,
        ]);
      }

      closeForm();
    } catch (error) {
      console.error("Save Product Error:", error);
      alert("Something went wrong while saving the product.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product.id);

      const response = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete product.");
        return;
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (error) {
      console.error("Delete Product Error:", error);
      alert("Something went wrong while deleting the product.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getStockClass = (stock: number) => {
    if (stock <= 0) {
      return "bg-red-100 text-red-700";
    }

    if (stock <= 5) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-emerald-100 text-emerald-700";
  };

  const getStockLabel = (stock: number) => {
    if (stock <= 0) return "OUT OF STOCK";
    if (stock <= 5) return "LOW STOCK";
    return "IN STOCK";
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <Link
              href="/admin"
              className="text-sm font-semibold text-blue-900 hover:text-blue-700"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              Manage Products
            </h1>

            <p className="mt-2 text-gray-600">
              Add, edit, delete and manage your Velora products.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={loadProducts}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>

            <button
              onClick={openAddForm}
              className="rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            >
              + Add Product
            </button>

          </div>

        </div>

        {/* STATISTICS */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Products
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {totalStock}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Low Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {lowStockCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Out of Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {outOfStockCount}
            </p>
          </div>

        </div>

        {/* FILTERS */}

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">

            <div>
              <label
                htmlFor="product-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search Products
              </label>

              <input
                id="product-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by product name, category or ID..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category
              </label>

              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
              >
                <option value="ALL">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {products.length}
            </span>{" "}
            products
          </p>

        </section>

        {/* ERROR */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">

            <h2 className="font-bold text-red-800">
              Unable to load products
            </h2>

            <p className="mt-2 text-red-700">
              {error}
            </p>

            <button
              onClick={loadProducts}
              className="mt-4 rounded-xl bg-red-700 px-5 py-2.5 font-semibold text-white hover:bg-red-800"
            >
              Try Again
            </button>

          </div>
        )}

        {/* PRODUCT FORM */}

        {showForm && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingProduct
                    ? "Update the product information below."
                    : "Enter the information for your new product."}
                </p>
              </div>

              <button
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={saveProduct}
              className="mt-6 space-y-5"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product Name *
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateForm("name", event.target.value)
                    }
                    placeholder="Example: Premium Hoodie"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>

                  <input
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        "category",
                        event.target.value
                      )
                    }
                    placeholder="Example: Clothing"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the product..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Price (₹) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateForm("price", event.target.value)
                    }
                    placeholder="999"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Stock *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      updateForm("stock", event.target.value)
                    }
                    placeholder="50"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Image URL
                  </label>

                  <input
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      updateForm("image", event.target.value)
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {form.image && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Image Preview
                  </p>

                  <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                    <img
                      src={form.image}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-900 px-7 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Create Product"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* LOADING */}

        {loading &&
          products.length === 0 &&
          !error && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

              <div className="text-5xl">
                ⏳
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Loading products...
              </h2>

            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 &&
          !showForm && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-sm">

              <div className="text-6xl">
                🛍️
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No products found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-gray-500">
                {products.length === 0
                  ? "Add your first product to start building your Velora catalogue."
                  : "Try changing your search or category filter."}
              </p>

              {products.length === 0 && (
                <button
                  onClick={openAddForm}
                  className="mt-5 rounded-xl bg-blue-900 px-6 py-3 font-semibold text-white hover:bg-blue-800"
                >
                  + Add Your First Product
                </button>
              )}

            </div>
          )}

        {/* PRODUCTS TABLE */}

        {filteredProducts.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 p-6">

              <h2 className="text-xl font-bold text-slate-900">
                Product Catalogue
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your store inventory from one place.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-50">

                  <tr className="text-left text-sm text-gray-500">

                    <th className="px-6 py-4 font-semibold">
                      Product
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Price
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Stock
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* PRODUCT */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">
                                🛍️
                              </span>
                            )}

                          </div>

                          <div className="max-w-sm">

                            <p className="font-semibold text-slate-900">
                              {product.name}
                            </p>

                            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                              {product.description}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              ID #{product.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-5">

                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {product.category}
                        </span>

                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-5 font-bold text-slate-900">
                        {formatCurrency(product.price)}
                      </td>

                      {/* STOCK */}

                      <td className="px-6 py-5 font-semibold text-slate-800">
                        {product.stock}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        <span
                          className={`inline-block rounded-full px-3 py-1.5 text-xs font-bold ${getStockClass(
                            product.stock
                          )}`}
                        >
                          {getStockLabel(product.stock)}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-5 text-right">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              openEditForm(product)
                            }
                            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteProduct(product)
                            }
                            disabled={
                              deletingId === product.id
                            }
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === product.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {/* FOOTER */}

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