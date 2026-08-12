const categories = [
  { icon: "📱", name: "Electronics" },
  { icon: "👕", name: "Fashion" },
  { icon: "🏠", name: "Home & Kitchen" },
  { icon: "💄", name: "Beauty" },
  { icon: "🎮", name: "Gaming" },
  { icon: "📚", name: "Books" },
  { icon: "⚽", name: "Sports" },
  { icon: "🛒", name: "Grocery" },
];

export default function Categories() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-4xl font-bold text-slate-900">
          Shop by Categories
        </h2>

        <p className="mt-4 text-center text-gray-600">
          Browse thousands of products from your favorite categories.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">

          {categories.map((category) => (
            <div
              key={category.name}
              className="
                cursor-pointer
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-8
                text-center
                shadow-sm
                transition
                duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >
              <div className="text-5xl">
                {category.icon}
              </div>

              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                {category.name}
              </h3>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}