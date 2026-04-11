import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Package, RotateCcw, Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [{ name: "Black", hex: "#111" }, { name: "Silver", hex: "#C0C0C0" }, { name: "Graphite", hex: "#555" }];

const accordionData = [
  { title: "Fabric & Care", content: "350gsm 100% Premium Cotton. Machine wash cold. Do not bleach. Tumble dry low. Iron inside out." },
  { title: "Sizing & Fit", content: "Model is 6'1\" wearing size L. This style runs oversized — size down for a slimmer fit." },
  { title: "Shipping & Returns", content: "Free standard shipping on orders over $150. Returns accepted within 30 days." },
];

const related = [
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", opacity: 0.4 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", tag2: "hot", opacity: 0.6 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", opacity: 0.45 },
  { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear", price: 245, tag: "ltd", opacity: 0.5 },
];

export default function VigoProduct() {
  const { productImg, wishlist, toggleWishlist, addToCart, setSizeGuideOpen } = useOutletContext();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState("Black");
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [added, setAdded] = useState(false);
  const wishlisted = wishlist.includes(1);

  const thumbOpacities = [1, 0.6, 0.4, 0.8];

  const handleAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({ id: 1, name: "Chrome V Tee", meta: `Size: ${selectedSize} · Color: ${selectedColor}`, price: 68 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: G1 }}>
      {/* Header with back button */}
      <div style={{ padding: "clamp(16px,3vw,24px) clamp(16px,4vw,32px)", borderBottom: `.5px solid ${G3}`, background: G1, position: "sticky", top: 60, zIndex: 40 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "inherit" }}>← Back</button>
      </div>

      {/* Main content */}
      <div style={{ padding: "clamp(20px,4vw,32px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          
          {/* Two column layout: images left, info right */}
          <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px,5vw,48px)", marginBottom: "clamp(40px,6vw,60px)" }}>
            
            {/* Images section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,2vw,16px)" }}>
              {/* Main image */}
              <div style={{ background: G2, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                <img src={productImg} alt="Chrome V Tee" style={{ width: "75%", objectFit: "contain", opacity: thumbOpacities[activeThumb], filter: "drop-shadow(0 0 40px rgba(192,192,192,.1))" }} />
              </div>
              
              {/* Thumbnail strip */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
                {thumbOpacities.map((op, i) => (
                  <button key={i} onClick={() => setActiveThumb(i)} style={{ flexShrink: 0, width: 60, height: 60, background: G2, border: `.5px solid ${activeThumb === i ? S : G3}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
                    <img src={productImg} alt="" style={{ width: 48, height: 48, objectFit: "contain", opacity: op }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Info section */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Breadcrumb */}
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 16 }}>SS25 — Chrome Series</div>
              
              {/* Title & Price */}
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 8 }}>Chrome V Tee</h1>
                <div style={{ fontSize: 10, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Tops / Essential</div>
              </div>

              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingBottom: 24, borderBottom: `.5px solid ${G3}` }}>
                <span style={{ fontSize: 12, color: S }}>★★★★★</span>
                <span style={{ fontSize: 9, color: SD }}>4.9 (128 reviews)</span>
              </div>

              {/* Price + Actions row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>Price</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: S }}>$68</div>
                </div>
                <button onClick={() => toggleWishlist(1)} style={{ background: wishlisted ? `rgba(${parseInt(S.slice(1,3), 16)},${parseInt(S.slice(3,5), 16)},${parseInt(S.slice(5,7), 16)},.1)` : "transparent", border: `.5px solid ${wishlisted ? S : G3}`, color: wishlisted ? S : SD, width: 44, height: 44, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontFamily: "inherit", transition: "all .2s", marginTop: 12 }}>
                  {wishlisted ? "♥" : "♡"}
                </button>
              </div>

              {/* Description */}
              <p style={{ fontSize: 12, color: SD, lineHeight: 1.8, marginBottom: 28 }}>Heavyweight 350gsm cotton. Oversized silhouette. Embossed chrome V logo. Built for the borough.</p>

              {/* Color selector */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Color: <span style={{ color: "#fff" }}>{selectedColor}</span></label>
                <div style={{ display: "flex", gap: 10 }}>
                  {COLORS.map(c => (
                    <button key={c.name} onClick={() => setSelectedColor(c.name)} title={c.name} style={{ width: 32, height: 32, background: c.hex, border: selectedColor === c.name ? `2px solid ${S}` : `.5px solid ${G3}`, cursor: "pointer", borderRadius: "50%", transition: "all .2s" }} />
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase" }}>Size {!selectedSize && <span style={{ color: "#e03" }}>*</span>}</label>
                  <button onClick={() => setSizeGuideOpen(true)} style={{ background: "none", border: "none", fontSize: 8, letterSpacing: 2, color: S, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Size Guide →</button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {SIZES.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} style={{ width: 48, height: 40, border: `.5px solid ${selectedSize === s ? S : G3}`, background: selectedSize === s ? S : "transparent", color: selectedSize === s ? "#000" : SD, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + Add button */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", border: `.5px solid ${G3}` }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 48, background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>−</button>
                  <div style={{ width: 32, textAlign: "center", fontSize: 12, borderLeft: `.5px solid ${G3}`, borderRight: `.5px solid ${G3}` }}>{qty}</div>
                  <button onClick={() => setQty(q => q + 1)} style={{ width: 40, height: 48, background: "none", border: "none", color: SD, fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>+</button>
                </div>
                <button onClick={handleAdd} style={{ flex: 1, background: added ? "#0c6" : S, color: "#000", border: "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", height: 48, transition: "background .3s", fontFamily: "inherit" }}>
                  {added ? "✓ Added to Bag" : "Add to Bag"}
                </button>
              </div>

              {/* Trust badges */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, paddingTop: 16, borderTop: `.5px solid ${G3}` }}>
                {[{ icon: Package, title: "Free Shipping", sub: "over $150" }, { icon: RotateCcw, title: "Easy Returns", sub: "30 days" }, { icon: Zap, title: "NYC Made", sub: "Limited run" }].map(({ icon: Icon, title, sub }) => (
                  <div key={title} style={{ textAlign: "center" }}>
                    <Icon size={18} style={{ marginBottom: 8, color: S, margin: "0 auto" }} />
                    <div style={{ fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>{title}</div>
                    <div style={{ fontSize: 7, color: SD, marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Accordion */}
          <div style={{ background: G2, border: `.5px solid ${G3}`, padding: "clamp(16px,3vw,24px)" }}>
            <Accordion type="single" collapsible className="w-full">
              {accordionData.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#fff", fontWeight: 700 }}>{item.title}</AccordionTrigger>
                  <AccordionContent style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      <SectionDivider label="You May Also Like" />
      <div style={{ padding: "clamp(24px,4vw,32px)", maxWidth: 1200, margin: "0 auto" }}>
        <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {related.map(p => (
            <ProductCard key={p.id} product={p} img={productImg}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id)}
              onAdd={() => addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price })}
              onClick={() => navigate(`/product/${p.id}`)} />
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="mobile-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,10,.98)", borderTop: `.5px solid ${G3}`, padding: "12px clamp(12px,4vw,24px) env(safe-area-inset-bottom, 12px)", display: "none", gap: 8, zIndex: 150, backdropFilter: "blur(12px)" }}>
        {!selectedSize && <div style={{ fontSize: 9, color: "#e03", textAlign: "center", letterSpacing: 1 }}>SELECT A SIZE</div>}
        <button onClick={handleAdd} style={{ width: "100%", background: added ? "#0c6" : S, color: "#000", border: "none", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", padding: "12px", fontFamily: "inherit", transition: "background .3s" }}>
          {added ? "✓ Added" : `Add to Bag · $68`}
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mobile-cta { display: flex !important; flex-direction: column; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}