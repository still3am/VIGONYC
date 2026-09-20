import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { S, G2, G3, SD } from "@/components/admin/adminUi";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [orders, products, contacts, returns, reviews, subs] = await Promise.all([
          base44.entities.Order.list("-created_date", 500).catch(() => []),
          base44.entities.Product.list("-created_date", 500).catch(() => []),
          base44.entities.ContactEntry.list("-created_date", 500).catch(() => []),
          base44.entities.ReturnRequest.list("-created_date", 500).catch(() => []),
          base44.entities.Review.list("-created_date", 500).catch(() => []),
          base44.entities.NewsletterSubscriber.list("-created_date", 500).catch(() => []),
        ]);
        const revenue = (orders || []).filter(o => o.paymentStatus === "captured").reduce((s, o) => s + (o.total || 0), 0);
        setStats({
          orders: orders?.length || 0,
          pendingOrders: (orders || []).filter(o => o.status === "Pending" || o.status === "Processing").length,
          revenue,
          products: products?.length || 0,
          lowStock: (products || []).filter(p => (p.stock || 0) <= 5 && p.inStock).length,
          newMessages: (contacts || []).filter(c => c.status === "New").length,
          pendingReturns: (returns || []).filter(r => r.status === "Pending").length,
          pendingReviews: (reviews || []).filter(r => !r.approved).length,
          subscribers: (subs || []).filter(s => s.active).length,
        });
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div style={{ padding: 48, textAlign: "center", color: SD, fontSize: 12 }}>Loading overview...</div>;
  if (!stats) return null;

  const cards = [
    { label: "Total Orders", value: stats.orders, sub: `${stats.pendingOrders} pending`, color: S },
    { label: "Revenue (captured)", value: `$${stats.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, sub: "all time", color: "#0c6" },
    { label: "Products", value: stats.products, sub: `${stats.lowStock} low stock`, color: S },
    { label: "New Messages", value: stats.newMessages, sub: "unread", color: "#fa0" },
    { label: "Pending Returns", value: stats.pendingReturns, sub: "awaiting review", color: "#e03" },
    { label: "Pending Reviews", value: stats.pendingReviews, sub: "awaiting approval", color: S },
    { label: "Newsletter Subs", value: stats.subscribers, sub: "active", color: "#08f" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: G2, border: `0.5px solid ${G3}`, borderTop: `2px solid ${c.color}`, padding: "22px" }}>
          <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 10 }}>{c.label}</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: c.color, letterSpacing: -1 }}>{c.value}</div>
          <div style={{ fontSize: 9, color: SD, marginTop: 6 }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}