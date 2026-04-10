const collections = [
  {
    name: "Chrome Series",
    season: "SS 2025",
    description: "Metallic hardware, reflective finishes, and obsidian silhouettes inspired by the Manhattan skyline at night.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80",
    align: "left",
  },
  {
    name: "Borough Archive",
    season: "FW 2024",
    description: "Five boroughs. Five chapters. A retrospective on the streets that forged the brand.",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&q=80",
    align: "right",
  },
];

export default function Collection() {
  return (
    <section id="collections" className="py-24">
      {/* Section header */}
      <div className="px-6 max-w-7xl mx-auto mb-16">
        <p className="text-vigo-chrome text-xs tracking-[0.4em] uppercase mb-3">— Curated</p>
        <h2 className="text-5xl md:text-6xl font-black uppercase text-white leading-none">
          Collections
        </h2>
      </div>

      {/* Collection cards */}
      <div className="flex flex-col gap-2">
        {collections.map((col, i) => (
          <div key={col.name} className="relative overflow-hidden group cursor-pointer">
            <div className="relative h-[60vh] md:h-[80vh]">
              <img
                src={col.image}
                alt={col.name}
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vigo-black via-vigo-black/20 to-transparent" />
              {i === 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-vigo-black/50 to-transparent" />
              )}

              {/* Content */}
              <div
                className={`absolute bottom-0 ${
                  col.align === "left" ? "left-0 items-start text-left" : "right-0 items-end text-right"
                } p-10 md:p-16 flex flex-col gap-4 max-w-lg`}
              >
                <p className="text-vigo-chrome text-xs tracking-[0.4em] uppercase">
                  {col.season}
                </p>
                <h3 className="text-4xl md:text-6xl font-black uppercase text-white leading-none">
                  {col.name}
                </h3>
                <p className="text-vigo-silver text-sm leading-relaxed max-w-sm">
                  {col.description}
                </p>
                <a
                  href="#shop"
                  className="inline-block mt-2 px-8 py-3 border border-white/40 text-white text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-vigo-black transition-all duration-300"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}