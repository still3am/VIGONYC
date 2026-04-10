import { useEffect, useRef } from "react";

export default function Hero() {
  const videoRef = useRef(null);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80"
          alt="VIGO NYC Hero"
          className="w-full h-full object-cover object-center opacity-40"
        />
        {/* Chrome gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-vigo-black/60 via-transparent to-vigo-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-vigo-black/40 via-transparent to-vigo-black/40" />
      </div>

      {/* Decorative chrome line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vigo-chrome/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p className="text-vigo-chrome text-xs tracking-[0.6em] uppercase mb-6 animate-fade-in">
          New York City — Est. 2024
        </p>

        <h1 className="text-7xl md:text-[10rem] font-black tracking-[-0.02em] uppercase leading-none mb-6">
          <span className="block text-white">VIGO</span>
          <span
            className="block text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(192,192,192,0.6)",
            }}
          >
            NYC
          </span>
        </h1>

        <p className="text-vigo-silver text-sm md:text-base tracking-[0.25em] uppercase max-w-md mx-auto mb-10">
          Luxury Streetwear · Forged in the Five Boroughs
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#shop"
            className="px-10 py-4 bg-white text-vigo-black text-xs tracking-[0.3em] uppercase font-bold hover:bg-vigo-chrome transition-all duration-300 hover:scale-105"
          >
            Shop Now
          </a>
          <a
            href="#collections"
            className="px-10 py-4 border border-vigo-silver/40 text-vigo-silver text-xs tracking-[0.3em] uppercase font-medium hover:border-white hover:text-white transition-all duration-300"
          >
            Explore
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-vigo-silver/50">
        <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-vigo-silver/50 to-transparent" />
      </div>
    </section>
  );
}