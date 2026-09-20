import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { S, G1, G2, G3, SD, btnPrimary, inputStyle, Empty } from "@/components/admin/adminUi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.Product.list("-created_date", 200).then(p => setProducts(p || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = async (id, data, msg) => {
    await base44.entities.Product.update(id, data).catch(() => {});
    toast.success(msg || "Updated");
    setProducts(p => p.map(x => x.id === id ? { ...x, ...data } : x));
  };

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>Loading products...</div>;

  return (
    <div>
      {products.length === 0 ? <Empty msg="No products yet." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: G2, border: `0.5px solid ${G3}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <img src={p.images?.[0]} alt="" style={{ width: 48, height: 48, objectFit: "cover", background: G1, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 9, color: SD, marginTop: 2 }}>{p.cat} · ${p.price} · {p.sku || "no sku"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 9, color: SD, textTransform: "uppercase", letterSpacing: 1 }}>Stock</span>
                <input type="number" value={p.stock || 0} onChange={e => setProducts(arr => arr.map(x => x.id === p.id ? { ...x, stock: parseInt(e.target.value || "0", 10) } : x))} style={{ ...inputStyle, width: 70, padding: "6px 10px" }} />
                <button onClick={() => update(p.id, { stock: p.stock }, "Stock updated")} style={btnPrimary}>Set</button>
              </div>
              <button onClick={() => update(p.id, { inStock: !p.inStock }, `Marked ${p.inStock ? "out of stock" : "in stock"}`)} style={{ ...btnPrimary, background: p.inStock ? S : G3, color: p.inStock ? "#000" : SD }}>{p.inStock ? "In Stock" : "Sold Out"}</button>
              <button onClick={() => update(p.id, { featured: !p.featured }, p.featured ? "Unfeatured" : "Featured")} style={{ ...btnPrimary, background: p.featured ? "#0c6" : "none", color: p.featured ? "#000" : SD, border: p.featured ? "none" : `0.5px solid ${G3}` }}>{p.featured ? "★ Featured" : "Feature"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}