import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2 } from "lucide-react";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState("New");

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await base44.entities.Contact.filter({ status: statusFilter }, '-created_date', 50);
      setContacts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading contacts:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await base44.entities.Contact.update(id, { status: newStatus });
      loadContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await base44.entities.Contact.delete(id);
      loadContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div style={{ padding: "clamp(20px, 4vw, 32px)" }}>
      <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 900, marginBottom: 20 }}>Inquiries</h1>

      <div style={{ marginBottom: 20, display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
        {["New", "Reviewed", "Responded"].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); loadContacts(); }}
            style={{
              background: statusFilter === s ? S : G1,
              color: statusFilter === s ? "#000" : SD,
              border: `.5px solid ${statusFilter === s ? S : G3}`,
              padding: "8px 16px",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: statusFilter === s ? 900 : 400,
              whiteSpace: "nowrap",
              flexShrink: 0,
              minHeight: 44
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {contacts.map(contact => (
          <div
            key={contact.id}
            style={{
              background: G1,
              border: `.5px solid ${G3}`,
              borderTop: `2px solid ${S}`,
              padding: "clamp(16px, 3vw, 20px)",
              borderRadius: 4,
              cursor: "pointer"
            }}
            onClick={() => setSelectedContact(contact)}
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#fff", fontWeight: 700, marginBottom: 4 }}>{contact.name}</div>
              <div style={{ fontSize: "clamp(10px, 2vw, 11px)", color: S, fontWeight: 700, marginBottom: 4 }}>{contact.topic}</div>
              <div style={{ fontSize: "clamp(10px, 2vw, 11px)", color: "#999", lineHeight: 1.6 }}>
                {contact.message.slice(0, 80)}{contact.message.length > 80 ? "..." : ""}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "clamp(9px, 2vw, 10px)", color: SD }}>
              <span>{new Date(contact.created_date).toLocaleDateString()}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteContact(contact.id); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#e03",
                  cursor: "pointer",
                  padding: "8px 12px",
                  minHeight: 40,
                  minWidth: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedContact && (
        <div style={{ marginTop: 24, background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}`, padding: "clamp(16px, 4vw, 24px)", borderRadius: 4 }}>
          <h2 style={{ fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 900, marginBottom: 16 }}>From {selectedContact.name}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Email</div>
              <div style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#fff" }}>{selectedContact.email}</div>
            </div>

            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Phone</div>
              <div style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#fff" }}>{selectedContact.phone || "Not provided"}</div>
            </div>

            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Topic</div>
              <div style={{ fontSize: "clamp(12px, 3vw, 13px)", color: "#fff", fontWeight: 700 }}>{selectedContact.topic}</div>
            </div>

            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Message</div>
              <div style={{ fontSize: "clamp(11px, 2vw, 12px)", color: "#ccc", lineHeight: 1.8, background: G2, padding: "clamp(12px, 3vw, 16px)", borderRadius: 4 }}>
                {selectedContact.message}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <select
              value={selectedContact.status}
              onChange={(e) => { updateStatus(selectedContact.id, e.target.value); setSelectedContact(null); }}
              style={{
                background: G2,
                color: "#fff",
                border: `.5px solid ${G3}`,
                padding: "clamp(10px, 2vw, 12px)",
                fontSize: "clamp(10px, 2vw, 11px)",
                fontFamily: "inherit",
                cursor: "pointer",
                minHeight: 44,
                width: "100%"
              }}
            >
              <option value="New">Mark as New</option>
              <option value="Reviewed">Mark as Reviewed</option>
              <option value="Responded">Mark as Responded</option>
            </select>

            <button
              onClick={() => setSelectedContact(null)}
              style={{
                background: "none",
                border: `.5px solid ${G3}`,
                color: SD,
                padding: "clamp(10px, 2vw, 12px) 20px",
                fontSize: 9,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
                minHeight: 44,
                width: "100%"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}