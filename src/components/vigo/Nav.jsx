import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";

const links = ["Shop", "Collections", "About", "Contact"];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-vigo-black/95 backdrop-blur-sm border-b border-vigo-silver/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex flex-col leading-none group">
          <span className="text-2xl font-black tracking-[0.25em] text-vigo-chrome uppercase group-hover:text-white transition-colors">
            VIGO
          </span>
          <span className="text-[9px] tracking-[0.5em] text-vigo-silver uppercase -mt-1">
            NEW YORK CITY
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-10 items-center">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="text-xs tracking-[0.25em] uppercase text-vigo-silver hover:text-white transition-colors duration-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="relative text-vigo-silver hover:text-white transition-colors">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-vigo-chrome text-vigo-black text-[9px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          <button
            className="md:hidden text-vigo-silver hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-vigo-black/98 border-t border-vigo-silver/10 px-6 py-6 flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-sm tracking-[0.3em] uppercase text-vigo-silver hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}