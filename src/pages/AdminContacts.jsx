import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Trash2, Eye } from "lucide-react";

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
    <div style={{ padding: "32px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24 }}>Contact Inquiries</h1>

      <div style={{ marginBottom: 24, display: "flex", gap: 8 }}>
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
              fontWeight: statusFilter === s ? 900 : 400
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: G1, border: `.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: `.5px solid ${G3}`, background: G2 }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>From</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Topic</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Message</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#fff" }}>Date</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700, color: "#fff" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} style={{ borderBottom: `.5px solid ${G3}` }}>
                  <td style={{ padding: "12px 16px", color: "#fff" }}>{contact.name}</td>
                  <td style={{ padding: "12px 16px", color: S }}>{contact.topic}</td>
                  <td style={{ padding: "12px 16px", color: "#999", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {contact.message.slice(0, 50)}...
                  </td>
                  <td style={{ padding: "12px 16px", color: SD, fontSize: 10 }}>
                    {new Date(contact.created_date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <button onClick={() => setSelectedContact(contact)} style={{ background: "none", border: "none", color: S, cursor: "pointer", marginRight: 8 }}>
                      <Eye size={16} />
                    </button>
                    <button onClick={() => deleteContact(contact.id)} style={{ background: "none", border: "none", color: "#e03", cursor: "pointer" }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContact && (
        <div style={{ marginTop: 24, background: G1, border: `.5px solid ${G3}`, padding: "24px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, marginBottom: 16 }}>Inquiry from {selectedContact.name}</h2>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Contact Info</div>
            <div style={{ fontSize: 11, color: "#fff" }}>{selectedContact.email}</div>
            <div style={{ fontSize: 11, color: "#fff" }}>{selectedContact.phone}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Topic</div>
            <div style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{selectedContact.topic}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>Message</div>
            <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.8, background: G2, padding: "12px", borderRadius: "4px" }}>
              {selectedContact.message}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <select
              value={selectedContact.status}
              onChange={e => { updateStatus(selectedContact.id, e.target.value); setSelectedContact(null); }}
              style={{
                background: G2,
                color: "#fff",
                border: `.5px solid ${G3}`,
                padding: "8px 12px",
                fontSize: 10,
                fontFamily: "inherit",
                cursor: "pointer"
              }}
            >
              <option value="New">Mark as New</option>
              <option value="Reviewed">Mark as Reviewed</option>
              <option value="Responded">Mark as Responded</option>
            </select>
            <button onClick={() => setSelectedContact(null)} style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "8px 16px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}