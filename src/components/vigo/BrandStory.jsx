const stats = [
  { value: "NYC", label: "Born & Bred" },
  { value: "2024", label: "Founded" },
  { value: "5", label: "Boroughs" },
  { value: "∞", label: "Ambition" },
];

export default function BrandStory() {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=900&q=80"
                alt="VIGO NYC Brand"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Chrome accent */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-vigo-chrome/30 pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border border-vigo-silver/20 pointer-events-none" />
          </div>

          {/* Right — Text */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-vigo-chrome text-xs tracking-[0.4em] uppercase mb-4">
                — Our Story
              </p>
              <h2 className="text-5xl md:text-6xl font-black uppercase text-white leading-tight mb-6">
                Born From
                <br />
                The City
              </h2>
              <div className="w-12 h-px bg-vigo-chrome mb-8" />
            </div>

            <p className="text-vigo-silver text-base leading-relaxed">
              VIGO NYC is more than a brand — it's a statement. Forged in the energy of New York City's five boroughs, every piece we create carries the weight of the streets and the ambition of the skyline.
            </p>
            <p className="text-vigo-silver/70 text-sm leading-relaxed">
              We craft luxury streetwear for those who move through the world with intention. Precision-cut silhouettes, premium fabrication, and an aesthetic rooted in the chrome and concrete of New York.
            </p>

            <a
              href="#shop"
              className="self-start px-10 py-4 bg-white text-vigo-black text-xs tracking-[0.3em] uppercase font-bold hover:bg-vigo-chrome transition-all duration-300"
            >
              Our Collection
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-24 border-t border-vigo-silver/10 pt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-white mb-2">{s.value}</p>
              <p className="text-vigo-silver text-xs tracking-[0.3em] uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}