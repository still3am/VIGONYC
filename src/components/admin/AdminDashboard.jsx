import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

function StatCard({ label, value, sub, color = S }) {
  return (
    <div style={{ background: G1, border: `0.5px solid ${G3}`, borderTop: `2px solid ${color}`, padding: "24px" }}>
      <div style={{ fontSize: 8, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: color, letterSpacing: -1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: SD, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0a0a0a", border: `0.5px solid ${G3}`, padding: "10px 14px" }}>
        <div style={{ fontSize: 9, color: SD, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: S }}>${payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Order.list("-created_date", 100).catch(() => []),
      base44.entities.Product.list("-created_date", 100).catch(() => []),
    ]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === "Pending").length;
  const shipped = orders.filter(o => o.status === "Shipped").length;
  const delivered = orders.filter(o => o.status === "Delivered").length;
  const avgOrder = orders.length ? (totalRevenue / orders.length).toFixed(2) : 0;
  const lowStock = products.filter(p => typeof p.stock === "number" && p.stock <= 5 && p.inStock !== false);
  const customerRevenue = (() => {
    const map = {};
    orders.forEach(o => {
      const email = o.userEmail || o.created_by;
      if (email) map[email] = (map[email] || 0) + (o.total || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  })();

  // Build chart data from orders grouped by day
  const chartData = (() => {
    const map = {};
    orders.forEach(o => {
      const d = new Date(o.created_date);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      map[key] = (map[key] || 0) + (o.total || 0);
    });
    return Object.entries(map).slice(-14).map(([date, revenue]) => ({ date, revenue }));
  })();

  const recentOrders = orders.slice(0, 8);

  if (loading) return <div style={{ color: SD, fontSize: 12, padding: 40, textAlign: "center" }}>Loading analytics...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Overview</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Dashboard</h2>
      </div>

      {/* Stat Cards */}
      {lowStock.length > 0 && (
        <div style={{ background: "rgba(250,160,0,.08)", border: "0.5px solid rgba(250,160,0,.3)", padding: "16px 20px", marginBottom: 4 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: "#fa0", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>⚠ Low Stock Alert</div>
          {lowStock.map(p => (
            <div key={p.id} style={{ fontSize: 10, color: "#fff", marginBottom: 4 }}>{p.name} — <span style={{ color: "#fa0" }}>{p.stock} units remaining</span></div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="admin-4col">
        <StatCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} sub={`${orders.length} total orders`} color={S} />
        <StatCard label="Pending Orders" value={pending} sub="Awaiting processing" color="#fa0" />
        <StatCard label="Shipped" value={shipped} sub="In transit" color="#6af" />
        <StatCard label="Delivered" value={delivered} sub="Completed" color="#0c6" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }} className="admin-4col">
        <StatCard label="Avg Order Value" value={`$${avgOrder}`} sub="Per transaction" color={S} />
        <StatCard label="Products" value={products.length} sub={`${products.filter(p=>p.inStock!==false).length} in stock`} color="#6af" />
      </div>

      {/* Revenue Chart */}
      <div style={{ background: G1, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "24px" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, color: SD, textTransform: "uppercase", marginBottom: 20 }}>Revenue — Last 14 Days</div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={S} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={S} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: SD }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: SD }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke={S} strokeWidth={1.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: SD, fontSize: 12 }}>No revenue data yet</div>
        )}
      </div>

      {/* Top Customers */}
       {customerRevenue.length > 0 && (
         <div style={{ background: G1, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
           <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${G3}`, fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Top Customers</div>
           {customerRevenue.map(([email, revenue], i) => (
             <div key={email} style={{ padding: "12px 20px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <div>
                 <div style={{ fontSize: 11, color: "#fff", marginBottom: 2 }}>{i + 1}. {email}</div>
               </div>
               <span style={{ fontSize: 13, fontWeight: 900, color: S }}>${revenue.toFixed(2)}</span>
             </div>
           ))}
         </div>
       )}

      {/* Orders + Products */}
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="admin-2col">
         {/* Recent Orders */}
         <div style={{ background: G1, border: `0.5px solid ${G3}` }}>
          <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${G3}`, fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Recent Orders</div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: SD, fontSize: 11 }}>No orders yet</div>
          ) : (
            recentOrders.map(o => {
              const statusColor = o.status === "Delivered" ? "#0c6" : o.status === "Shipped" ? S : o.status === "Processing" ? "#fa0" : "#e03";
              return (
                <div key={o.id} style={{ padding: "12px 20px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#fff", marginBottom: 2 }}>{o.orderId}</div>
                    <div style={{ fontSize: 9, color: SD }}>{o.items?.slice(0, 30)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 7, color: statusColor, border: `0.5px solid ${statusColor}`, padding: "2px 7px", letterSpacing: 1, textTransform: "uppercase" }}>{o.status}</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: S }}>${o.total}</span>
                    <button onClick={() => onNavigate?.("orders")} style={{ background: "none", border: `0.5px solid ${G3}`, color: SD, padding: "4px 10px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Manage →</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Product Stock */}
        <div style={{ background: G1, border: `0.5px solid ${G3}` }}>
          <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${G3}`, fontSize: 9, letterSpacing: 3, color: S, textTransform: "uppercase" }}>Products ({products.length})</div>
          {products.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: SD, fontSize: 11 }}>No products yet</div>
          ) : (
            products.slice(0, 8).map(p => (
              <div key={p.id} style={{ padding: "12px 20px", borderBottom: `0.5px solid ${G3}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#fff", marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: SD }}>{p.cat} {p.collection ? `· ${p.collection}` : ""}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {p.tag && <span style={{ fontSize: 7, color: S, border: `0.5px solid ${G3}`, padding: "2px 6px", letterSpacing: 1, textTransform: "uppercase" }}>{p.tag}</span>}
                  <span style={{ fontSize: 13, fontWeight: 900, color: S }}>${p.price}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`@media(max-width:900px){.admin-4col{grid-template-columns:1fr 1fr !important;}.admin-2col{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}