import { Instagram, Twitter, Youtube } from "lucide-react";

const links = {
  Shop: ["New Arrivals", "Hoodies", "Pants", "Jackets", "Accessories"],
  Company: ["About", "Careers", "Press", "Sustainability"],
  Support: ["Size Guide", "Shipping", "Returns", "FAQ", "Contact"],
};

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-vigo-silver/10 bg-vigo-black">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p className="text-3xl font-black tracking-[0.25em] text-white uppercase">VIGO</p>
              <p className="text-[9px] tracking-[0.5em] text-vigo-silver uppercase">New York City</p>
            </div>
            <p className="text-vigo-silver/60 text-sm leading-relaxed max-w-xs mb-6">
              Luxury streetwear forged in the five boroughs. Built for those who move with purpose.
            </p>
            {/* Newsletter */}
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-vigo-gray border border-vigo-silver/20 text-white text-xs px-4 py-3 placeholder:text-vigo-silver/40 focus:outline-none focus:border-vigo-chrome"
              />
              <button className="bg-white text-vigo-black text-xs tracking-[0.2em] uppercase font-bold px-5 py-3 hover:bg-vigo-chrome transition-colors">
                Join
              </button>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white text-xs tracking-[0.3em] uppercase font-bold mb-6">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-vigo-silver/60 text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="border-t border-vigo-silver/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-vigo-silver/40 text-xs tracking-wide">
            © 2024 VIGO NYC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-vigo-silver/40 hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-vigo-silver/40 hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-vigo-silver/40 hover:text-white transition-colors">
              <Youtube size={18} />
            </a>
          </div>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms", "Cookies"].map((t) => (
              <a key={t} href="#" className="text-vigo-silver/40 text-xs hover:text-white transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}