import { useState } from "react";
import { ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Chrome Series Hoodie",
    price: "$245",
    tag: "New Drop",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
    color: "Obsidian",
  },
  {
    id: 2,
    name: "Borough Cargo Pant",
    price: "$195",
    tag: "Best Seller",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    color: "Graphite",
  },
  {
    id: 3,
    name: "VIGO Crewneck",
    price: "$175",
    tag: null,
    image: "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800&q=80",
    color: "Chrome White",
  },
  {
    id: 4,
    name: "Skyline Bomber Jacket",
    price: "$395",
    tag: "Limited",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    color: "Midnight",
  },
  {
    id: 5,
    name: "Five Borough Tee",
    price: "$85",
    tag: null,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    color: "Ash",
  },
  {
    id: 6,
    name: "Steel Track Set",
    price: "$320",
    tag: "New Drop",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    color: "Silver",
  },
];

export default function Shop() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="shop" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="text-vigo-chrome text-xs tracking-[0.4em] uppercase mb-3">
            — Latest Drops
          </p>
          <h2 className="text-5xl md:text-6xl font-black uppercase text-white leading-none">
            Shop
          </h2>
        </div>
        <a
          href="#shop"
          className="hidden md:block text-xs tracking-[0.3em] uppercase text-vigo-silver hover:text-white transition-colors border-b border-vigo-silver/30 hover:border-white pb-1"
        >
          View All
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative cursor-pointer"
            onMouseEnter={() => setHovered(product.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Image container */}
            <div className="relative overflow-hidden bg-vigo-gray aspect-[3/4]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-vigo-black/0 group-hover:bg-vigo-black/30 transition-all duration-300" />

              {/* Tag */}
              {product.tag && (
                <span className="absolute top-4 left-4 bg-vigo-chrome text-vigo-black text-[9px] tracking-[0.2em] uppercase font-bold px-3 py-1">
                  {product.tag}
                </span>
              )}

              {/* Add to bag button */}
              <button
                className={`absolute bottom-4 left-4 right-4 bg-white text-vigo-black text-xs tracking-[0.25em] uppercase font-bold py-3 flex items-center justify-center gap-2 transition-all duration-300 ${
                  hovered === product.id
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <ShoppingBag size={14} />
                Add to Bag
              </button>
            </div>

            {/* Info */}
            <div className="pt-4 flex items-start justify-between">
              <div>
                <h3 className="text-white text-sm font-medium tracking-wide">
                  {product.name}
                </h3>
                <p className="text-vigo-silver text-xs tracking-widest uppercase mt-1">
                  {product.color}
                </p>
              </div>
              <span className="text-white font-bold text-sm">{product.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}