import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">

        {/* Small Badge */}

        <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-900">
          🚀 Trusted by Thousands of Happy Customers
        </span>

        {/* Main Heading */}

        <h1 className="mt-8 text-5xl font-extrabold leading-tight text-slate-900 md:text-7xl">
          Shop Smarter with{" "}
          <span className="text-blue-900">
            Velora
          </span>
        </h1>

        {/* Description */}

        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-600">
          Discover premium electronics, fashion, accessories,
          home essentials, beauty products and much more —
          all in one trusted marketplace with secure payments
          and fast delivery.
        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <Button>
            🛍 Explore Products
          </Button>

          <button
            className="rounded-xl border border-blue-900 px-7 py-3 font-semibold text-blue-900 transition hover:bg-blue-900 hover:text-white"
          >
            Learn More
          </button>

        </div>

        {/* Statistics */}

        <div className="mt-20 grid grid-cols-3 gap-12">

          <div>
            <h2 className="text-4xl font-bold text-blue-900">
              10K+
            </h2>

            <p className="mt-2 text-gray-600">
              Happy Customers
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-blue-900">
              500+
            </h2>

            <p className="mt-2 text-gray-600">
              Premium Products
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-blue-900">
              99%
            </h2>

            <p className="mt-2 text-gray-600">
              Positive Reviews
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}