import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const FIT_LABELS = { runs_small: "Runs Small", true_to_size: "True to Size", runs_large: "Runs Large" };

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const [r, p] = await Promise.all([
      base44.entities.Review.list("-created_date", 200).catch(() => []),
      base44.entities.Product.list("-created_date", 200).catch(() => []),
    ]);
    setReviews(r || []);
    setProducts(p || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const productName = (id) => products.find(p => p.id === id)?.name || id;

  const handleApprove = async (id, approved) => {
    await base44.entities.Review.update(id, { approved });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    await base44.entities.Review.delete(id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const filtered = reviews.filter(r => {
    const matchFilter = filter === "All" || (filter === "Approved" ? r.approved : r.approved === false || r.approved === undefined);
    const matchRating = ratingFilter === "All" || r.rating === parseInt(ratingFilter);
    const matchSearch = !search || (r.reviewerName || "").toLowerCase().includes(search.toLowerCase()) || (r.body || "").toLowerCase().includes(search.toLowerCase()) || productName(r.productId).toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchRating && matchSearch;
  });

  const pending = reviews.filter(r => !r.approved && r.approved !== true).length;
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : "—";

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 6 }}>✦ Reviews</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "clamp(20px,5vw,28px)", fontWeight: 900, letterSpacing: -1, color: "#fff" }}>Product Reviews</h2>
          {pending > 0 && <span style={{ background: "#fa0", color: "#000", fontSize: 8, fontWeight: 900, padding: "3px 10px", letterSpacing: 1, textTransform: "uppercase" }}>{pending} Pending</span>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20, flexWrap: "wrap" }}>
        {[[reviews.length, "Total", S], [reviews.filter(r => r.approved).length, "Approved", "#0c6"], [pending, "Pending", "#fa0"], [avgRating, "Avg Rating", S]].map(([n, l, c]) => (
          <div key={l} style={{ flex: 1, minWidth: 100, background: G1, border: `0.5px solid ${G3}`, padding: "12px 16px" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: c, letterSpacing: -1 }}>{n}</div>
            <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." style={{ flex: 1, minWidth: 160, background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 14px", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          <option value="All">All Reviews</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending Approval</option>
        </select>
        <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} style={{ background: G1, border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, outline: "none", fontFamily: "inherit" }}>
          <option value="All">All Ratings</option>
          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
        </select>
        <div style={{ fontSize: 10, color: SD, alignSelf: "center" }}>{filtered.length} reviews</div>
      </div>

      {loading && <div style={{ padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>Loading reviews...</div>}
      {!loading && filtered.length === 0 && <div style={{ background: G1, border: `0.5px solid ${G3}`, padding: 40, textAlign: "center", color: SD, fontSize: 12 }}>No reviews found</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {!loading && filtered.map(r => {
          const approved = r.approved === true;
          return (
            <div key={r.id} style={{ background: G1, border: `0.5px solid ${G3}`, borderLeft: `3px solid ${approved ? "#0c6" : "#fa0"}`, padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                    <div style={{ color: S, fontSize: 14 }}>{"★".repeat(r.rating || 0)}{"☆".repeat(5 - (r.rating || 0))}</div>
                    <span style={{ fontSize: 7, letterSpacing: 1, textTransform: "uppercase", padding: "2px 8px", border: `0.5px solid ${approved ? "#0c6" : "#fa0"}`, color: approved ? "#0c6" : "#fa0" }}>{approved ? "Approved" : "Pending"}</span>
                    {r.verified && <span style={{ fontSize: 7, color: "#6af", border: `0.5px solid #6af`, padding: "2px 6px", letterSpacing: 1, textTransform: "uppercase" }}>Verified</span>}
                    {r.fit && <span style={{ fontSize: 7, color: SD, border: `0.5px solid ${G3}`, padding: "2px 6px", letterSpacing: 1 }}>{FIT_LABELS[r.fit] || r.fit}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: S, fontWeight: 700, marginBottom: 2 }}>{productName(r.productId)}</div>
                  {r.title && <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, marginBottom: 4 }}>{r.title}</div>}
                  {r.body && <div style={{ fontSize: 12, color: SD, lineHeight: 1.7, marginBottom: 8 }}>{r.body}</div>}
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, color: SD }}>By: <span style={{ color: "#fff" }}>{r.reviewerName || "Anonymous"}</span></span>
                    {r.size && <span style={{ fontSize: 9, color: SD }}>Size: {r.size}</span>}
                    <span style={{ fontSize: 9, color: SD }}>{r.created_date ? new Date(r.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                  <button onClick={() => handleApprove(r.id, !approved)} style={{ background: approved ? "none" : "#0c6", border: `0.5px solid ${approved ? G3 : "#0c6"}`, color: approved ? SD : "#fff", padding: "7px 12px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
                    {approved ? "Unapprove" : "Approve"}
                  </button>
                  <button onClick={() => handleDelete(r.id)} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "7px 12px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}