const features = [
  {
    icon: "🚚",
    title: "Fast Delivery",
    description: "Quick and reliable delivery across the country.",
  },
  {
    icon: "🔒",
    title: "Secure Payment",
    description: "Safe and encrypted payment methods.",
  },
  {
    icon: "↩️",
    title: "Easy Returns",
    description: "Simple and hassle-free return policy.",
  },
  {
    icon: "🎧",
    title: "24/7 Support",
    description: "Friendly customer support anytime you need help.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-center text-4xl font-bold text-slate-900">
          Why Shop With Velora?
        </h2>

        <p className="mt-4 text-center text-gray-600">
          We make online shopping safe, simple, and enjoyable.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 bg-slate-50 p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-6xl">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}