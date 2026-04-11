import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import ProductCard from "./ProductCard";
import SectionDivider from "./SectionDivider";
import { toast } from "sonner";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const related = [
  { id: 2, name: "NYC Cargo Pant", cat: "Bottoms / Heavy", price: 145, tag: "drop", opacity: 0.4 },
  { id: 3, name: "Silver Label Hoodie", cat: "Tops / Outerwear", price: 128, tag: "new", tag2: "hot", opacity: 0.6 },
  { id: 4, name: "5-Panel Cap", cat: "Headwear / Unisex", price: 52, tag: "ltd", opacity: 0.45 },
  { id: 6, name: "Chrome Tech Jacket", cat: "Outerwear", price: 245, tag: "ltd", opacity: 0.5 },
];

const SIZES = ["XS","S","M","L","XL","XXL"];
const COLORS = [{ name: "Black", hex: "#111" }, { name: "Silver", hex: "#C0C0C0" }, { name: "Graphite", hex: "#555" }];

const accordionData = [
  { title: "Product Details", content: "350gsm 100% Premium Cotton. Garment-dyed for depth. Oversized drop-shoulder construction. Embossed chrome V logo on chest. Ribbed cuffs and hem. VIGONYC woven label inside collar." },
  { title: "Sizing & Fit", content: "Model is 6'1\" wearing size L. This style runs oversized — size down for a slimmer fit. Refer to size guide for exact measurements." },
  { title: "Shipping & Returns", content: "Free standard shipping on orders over $150. Express (2-3 days) and Overnight available. Returns accepted within 30 days of delivery. Items must be unworn and in original packaging." },
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
    <div style={{ paddingBottom: "120px", minHeight: "100vh" }}>
    <div style={{ padding: "clamp(24px,5vw,48px) clamp(16px,4vw,32px)", maxWidth: 1400, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: "clamp(24px,4vw,40px)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: SD, overflowX: "auto" }}>
        {[["Home","/"],["Shop","/shop"],["Chrome V Tee",null]].map(([l,to],i) => (
          <span key={l} style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
            {i > 0 && <span>/</span>}
            {to ? <button onClick={() => navigate(to)} style={{ background: "none", border: "none", color: SD, cursor: "pointer", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "inherit" }}>{l}</button> : <span style={{ color: "#fff" }}>{l}</span>}
          </span>
        ))}
      </div>

      <div className="vigo-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(32px,6vw,64px)" }}>
        {/* Images */}
        <div style={{ display: "flex", gap: "clamp(8px,2vw,10px)", flexDirection: "row-reverse" }}>
          <div style={{ flex: 1, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "3/4", overflow: "hidden" }}>
            <img src={productImg} alt="Chrome V Tee" style={{ width: "85%", objectFit: "contain", opacity: thumbOpacities[activeThumb], filter: "drop-shadow(0 0 40px rgba(192,192,192,.12))", transition: "opacity .3s" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", maxHeight: "600px" }}>
            {thumbOpacities.map((op, i) => (
              <div key={i} onClick={() => setActiveThumb(i)} style={{ width: 68, height: 68, background: G1, border: `.5px solid ${activeThumb === i ? S : G3}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "border-color .2s" }}>
                <img src={productImg} alt="" style={{ width: 54, height: 54, objectFit: "contain", opacity: op }} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 12 }}>SS25 — Chrome Series</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: -2, marginBottom: 6 }}>Chrome V Tee</h1>
          <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 20 }}>Tops / Essential</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: S, marginBottom: 12 }}>$68</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingBottom: 24, borderBottom: `.5px solid ${G3}` }}>
            <span style={{ color: S, fontSize: 14 }}>★★★★★</span>
            <span style={{ fontSize: 10, color: SD }}>4.9 (128 reviews)</span>
          </div>

          <p style={{ fontSize: 12, color: SD, lineHeight: 1.9, marginBottom: 28 }}>
            Heavyweight 350gsm cotton. Oversized silhouette. Embossed chrome V logo. Built for the borough.
          </p>

          {/* Color */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>Color: <span style={{ color: "#fff" }}>{selectedColor}</span></div>
            <div style={{ display: "flex", gap: 10 }}>
              {COLORS.map(c => (
                <button key={c.name} onClick={() => setSelectedColor(c.name)} title={c.name} style={{ width: 28, height: 28, background: c.hex, border: selectedColor === c.name ? `2px solid ${S}` : `.5px solid ${G3}`, cursor: "pointer", borderRadius: "50%" }} />
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase" }}>Size {!selectedSize && <span style={{ color: "#e03" }}>*</span>}</div>
              <button onClick={() => setSizeGuideOpen(true)} style={{ background: "none", border: "none", fontSize: 9, letterSpacing: 2, color: S, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Size Guide →</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SIZES.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{ width: 50, height: 44, border: `.5px solid ${selectedSize === s ? S : G3}`, background: selectedSize === s ? S : "none", color: selectedSize === s ? "#000" : SD, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", border: `.5px solid ${G3}` }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width: 44, height: 52, background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer", fontFamily: "inherit" }}>−</button>
              <span style={{ width: 36, textAlign: "center", fontSize: 14 }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)} style={{ width: 44, height: 52, background: "none", border: "none", color: SD, fontSize: 20, cursor: "pointer", fontFamily: "inherit" }}>+</button>
            </div>
            <button onClick={handleAdd} style={{ flex: 1, background: added ? "#0c6" : S, color: "#000", border: "none", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", height: 52, transition: "background .3s", fontFamily: "inherit" }}>
              {added ? "✓ Added to Bag" : "Add to Bag"}
            </button>
          </div>
          <button onClick={() => toggleWishlist(1)} style={{ width: "100%", background: "none", border: `.5px solid ${G3}`, color: wishlisted ? S : SD, padding: "14px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", marginBottom: 28, fontFamily: "inherit" }}>
            {wishlisted ? "♥ Saved to Wishlist" : "♡ Save to Wishlist"}
          </button>

          {/* Delivery info */}
          <div className="vigo-delivery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginBottom: 28 }}>
            {[["🚚","Free over $150"],["↩","30-day returns"],["🏭","NYC made"]].map(([ic,l]) => (
              <div key={l} style={{ background: G1, border: `.5px solid ${G3}`, padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{ic}</div>
                <div style={{ fontSize: 9, letterSpacing: 1, color: SD, textTransform: "uppercase", lineHeight: 1.4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <div style={{ borderTop: `.5px solid ${G3}` }}>
            <Accordion type="single" collapsible className="w-full">
              {accordionData.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>{item.title}</AccordionTrigger>
                  <AccordionContent style={{ fontSize: 12, color: SD, lineHeight: 1.9 }}>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>

      {/* You May Also Like */}
      <SectionDivider label="You May Also Like" />
      <div style={{ padding: "32px clamp(16px,4vw,32px) 0" }}>
        <div className="vigo-4col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 1400, margin: "0 auto" }}>
          {related.map(p => (
            <ProductCard key={p.id} product={p} img={productImg}
              wishlisted={wishlist.includes(p.id)}
              onWishlist={() => toggleWishlist(p.id)}
              onAdd={() => addToCart({ id: p.id, name: p.name, meta: "Size: M · Color: Black", price: p.price })}
              onClick={() => navigate(`/product/${p.id}`)} />
          ))}
        </div>
      </div>

      {/* Sticky Add to Bag (mobile) */}
      <div className="vigo-sticky-cta" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(10,10,10,.98)", borderTop: `.5px solid ${G3}`, padding: "12px clamp(16px,4vw,32px) env(safe-area-inset-bottom,12px)", display: "none", flexDirection: "column", gap: 8, zIndex: 150, backdropFilter: "blur(12px)" }}>
        {!selectedSize && <div style={{ fontSize: 10, color: "#e03", textAlign: "center", letterSpacing: 1 }}>SELECT A SIZE</div>}
        <button onClick={handleAdd} style={{ width: "100%", background: added ? "#0c6" : S, color: "#000", border: "none", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", padding: "14px", fontFamily: "inherit", borderRadius: "4px", transition: "background .3s" }}>
          {added ? "✓ Added to Bag" : `Add to Bag · $68`}
        </button>
      </div>

      <style>{`
        @media(max-width:900px){
          .vigo-2col{grid-template-columns:1fr !important;}
          .vigo-4col{grid-template-columns:repeat(2,1fr) !important;}
          .vigo-delivery-grid{grid-template-columns:repeat(3,1fr) !important;}
          .vigo-sticky-cta { display: flex !important; }
        }
        @media(min-width:901px){
          .vigo-sticky-cta { display: none !important; }
        }
        @media(max-width:480px){
          .vigo-4col{grid-template-columns:1fr !important;}
        }
      `}</style>
    </div>
  );
}