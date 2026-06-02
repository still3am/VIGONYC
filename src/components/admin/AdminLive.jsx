import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const S = "#C0C0C0";
const G3 = "#1a1a1a";
const SD = "#555555";

const EMPTY = { title: "THE BACK DOOR", status: "scheduled", streamUrl: "", viewerCount: 0, pinnedMessage: "", pinnedSubtext: "", likeCount: 0, coverImage: "" };

export default function AdminLive() {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const loadStream = async () => {
    setLoading(true);
    try {
      const all = await base44.entities.LiveStreamEvent.list("-created_date", 10);
      if (all?.length > 0) {
        setStream(all[0]);
        setForm(all[0]);
      } else {
        setStream(null);
        setForm(EMPTY);
      }
    } catch { }
    setLoading(false);
  };

  useEffect(() => { loadStream(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (stream?.id) {
        await base44.entities.LiveStreamEvent.update(stream.id, form);
        toast.success("Stream updated");
      } else {
        const created = await base44.entities.LiveStreamEvent.create(form);
        setStream(created);
        toast.success("Stream created");
      }
      await loadStream();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  const handleGoLive = async () => {
    setSaving(true);
    try {
      const data = { ...form, status: "live" };
      if (stream?.id) {
        await base44.entities.LiveStreamEvent.update(stream.id, data);
      } else {
        await base44.entities.LiveStreamEvent.create(data);
      }
      toast.success("🔴 You're LIVE — THE BACK DOOR is open");
      await loadStream();
    } catch { toast.error("Failed"); }
    setSaving(false);
  };

  const handleEndStream = async () => {
    if (!stream?.id) return;
    setSaving(true);
    try {
      await base44.entities.LiveStreamEvent.update(stream.id, { status: "ended" });
      toast.success("Stream ended");
      await loadStream();
    } catch { toast.error("Failed"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!stream?.id || !window.confirm("Delete this stream event?")) return;
    setSaving(true);
    try {
      await base44.entities.LiveStreamEvent.delete(stream.id);
      setStream(null);
      setForm(EMPTY);
      toast.success("Deleted");
    } catch { toast.error("Failed"); }
    setSaving(false);
  };

  const statusColor = { scheduled: "#fa0", live: "#0c6", ended: SD };
  const statusLabel = { scheduled: "SCHEDULED", live: "🔴 LIVE", ended: "ENDED" };

  if (loading) return <div style={{ color: SD, fontSize: 11, letterSpacing: 2 }}>Loading...</div>;

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 8 }}>THE BACK DOOR</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>Live Stream Control</div>
      </div>

      {/* Status card */}
      <div style={{ background: "#0a0a0a", border: `0.5px solid ${G3}`, borderRadius: 8, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Current Status</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: statusColor[form.status] || SD, letterSpacing: 2 }}>
            {statusLabel[form.status] || "—"}
          </div>
          {stream && <div style={{ fontSize: 10, color: SD, marginTop: 4 }}>{stream.viewerCount || 0} viewers · {stream.likeCount || 0} likes</div>}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {form.status !== "live" && (
            <button onClick={handleGoLive} disabled={saving} style={{ background: "#0c6", color: "#fff", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
              ▶ GO LIVE
            </button>
          )}
          {form.status === "live" && (
            <button onClick={handleEndStream} disabled={saving} style={{ background: "#e03", color: "#fff", border: "none", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
              ■ END STREAM
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Stream Title" value={form.title} onChange={v => set("title", v)} placeholder="THE BACK DOOR" />
        <Field label="Stream URL (iframe / HLS embed)" value={form.streamUrl} onChange={v => set("streamUrl", v)} placeholder="https://..." />
        <Field label="Pinned Message" value={form.pinnedMessage} onChange={v => set("pinnedMessage", v)} placeholder="BLACK SET DROPS TONIGHT 11PM EST" />
        <Field label="Pinned Subtext" value={form.pinnedSubtext} onChange={v => set("pinnedSubtext", v)} placeholder="No restocks. Once it's gone, it's gone." />
        <Field label="Cover / Thumbnail Image URL" value={form.coverImage} onChange={v => set("coverImage", v)} placeholder="https://..." />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Viewer Count (manual)" value={form.viewerCount} onChange={v => set("viewerCount", Number(v))} type="number" placeholder="284" />
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 6 }}>Status</div>
            <select value={form.status} onChange={e => set("status", e.target.value)} style={{ width: "100%", background: "#0a0a0a", border: `0.5px solid ${G3}`, color: "#fff", padding: "10px 12px", fontSize: 11, fontFamily: "inherit", outline: "none" }}>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saving} style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : stream?.id ? "Save Changes" : "Create Stream"}
          </button>
          {stream?.id && (
            <button onClick={handleDelete} disabled={saving} style={{ background: "none", border: `0.5px solid rgba(224,0,51,0.4)`, color: "#e03", padding: "12px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Preview link */}
      {stream?.id && (
        <div style={{ marginTop: 32, padding: "16px 20px", background: "#0a0a0a", border: `0.5px solid ${G3}`, borderRadius: 6 }}>
          <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Preview</div>
          <a href="/live" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: S, textDecoration: "none" }}>
            Open THE BACK DOOR → /live ↗
          </a>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <input
        type={type}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", background: "#0a0a0a", border: "0.5px solid #1a1a1a", color: "#fff", padding: "10px 12px", fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );
}