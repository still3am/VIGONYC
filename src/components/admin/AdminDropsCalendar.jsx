const S = "#C0C0C0";
const G1 = "#111111";
const G2 = "#161616";
const G3 = "#222222";
const SD = "#666666";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TODAY = new Date();

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const statusColor = s => s === "live" ? "#0c6" : s === "upcoming" ? S : "#e03";

export default function AdminDropsCalendar({ drops, onEdit, onDelete }) {
  const [viewDate, setViewDate] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selectedDrop, setSelectedDrop] = useState(null);

  // need useState from react
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const dropOnDay = day => {
    if (!day) return null;
    return drops.find(dr => dr.date && isSameDay(new Date(dr.date), day));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }} className="admin-drops-cal-grid">
      {/* Calendar */}
      <div style={{ background: G1, border: `0.5px solid ${G3}`, borderTop: `2px solid ${S}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `0.5px solid ${G3}` }}>
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={navBtn}>←</button>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase", color: "#fff" }}>
            {MONTHS[month]} <span style={{ color: S }}>{year}</span>
          </div>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={navBtn}>→</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: G2, borderBottom: `0.5px solid ${G3}` }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ padding: "8px 4px", textAlign: "center", fontSize: 8, letterSpacing: 1, color: SD }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
          {cells.map((day, i) => {
            const drop = dropOnDay(day);
            const isToday = day && isSameDay(day, TODAY);
            const isSelected = selectedDrop && drop && selectedDrop.id === drop.id;
            const isPast = day && day < TODAY && !isToday;
            return (
              <div
                key={i}
                onClick={() => { if (drop) setSelectedDrop(drop); }}
                style={{
                  minHeight: 64, padding: "8px 6px 6px",
                  borderRight: (i + 1) % 7 !== 0 ? `0.5px solid ${G3}` : "none",
                  borderBottom: `0.5px solid ${G3}`,
                  cursor: drop ? "pointer" : "default",
                  background: isSelected ? "rgba(192,192,192,.08)" : "transparent",
                  transition: "background .15s", position: "relative"
                }}
                onMouseEnter={e => { if (drop && !isSelected) e.currentTarget.style.background = "rgba(192,192,192,.04)"; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                {day && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: isToday ? 900 : 400, color: isToday ? "#000" : isPast ? SD : drop ? "#fff" : SD, width: 20, height: 20, background: isToday ? S : "transparent", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
                      {day.getDate()}
                    </div>
                    {drop && (
                      <div style={{ background: `${statusColor(drop.status)}18`, borderLeft: `2px solid ${statusColor(drop.status)}`, padding: "2px 4px", fontSize: 6, letterSpacing: .5, color: statusColor(drop.status), lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {drop.series || drop.name}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "12px 20px", borderTop: `0.5px solid ${G3}`, display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[[S, "Upcoming"], ["#0c6", "Live"], ["#e03", "Sold Out"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 2, background: c }} />
              <span style={{ fontSize: 7, color: SD, letterSpacing: 1, textTransform: "uppercase" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Drop Panel */}
      <div>
        {selectedDrop ? (
          <div style={{ background: G1, border: `0.5px solid ${G3}`, borderTop: `2px solid ${statusColor(selectedDrop.status)}` }}>
            <div style={{ padding: "18px 20px", borderBottom: `0.5px solid ${G3}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 7, letterSpacing: 2, color: statusColor(selectedDrop.status), textTransform: "uppercase", border: `0.5px solid ${statusColor(selectedDrop.status)}`, padding: "2px 8px" }}>{selectedDrop.status}</span>
                <span style={{ fontSize: 9, color: SD }}>{selectedDrop.price}</span>
              </div>
              <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{selectedDrop.name}</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, letterSpacing: -1, color: "#fff", marginBottom: 8 }}>{selectedDrop.series}</h3>
              {selectedDrop.description && <p style={{ fontSize: 11, color: SD, lineHeight: 1.8 }}>{selectedDrop.description}</p>}
            </div>

            <div style={{ padding: "14px 20px", borderBottom: `0.5px solid ${G3}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                ["Date", selectedDrop.date ? new Date(selectedDrop.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"],
                ["Time", selectedDrop.time || "—"],
                ["Units", selectedDrop.pieces ? `${selectedDrop.pieces}` : "—"]
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 7, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "14px 20px", display: "flex", gap: 8 }}>
              <button onClick={() => onEdit(selectedDrop)} style={{ flex: 1, background: S, color: "#000", border: "none", padding: "9px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}>Edit Drop</button>
              <button onClick={() => { onDelete(selectedDrop.id); setSelectedDrop(null); }} style={{ background: "none", border: `0.5px solid #e03`, color: "#e03", padding: "9px 12px", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>Del</button>
            </div>
          </div>
        ) : (
          <div style={{ background: G1, border: `0.5px solid ${G3}`, padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 22, opacity: .12, marginBottom: 10, color: "#fff" }}>✦</div>
            <div style={{ fontSize: 11, color: SD }}>Click a drop on the calendar to view details.</div>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:900px){ .admin-drops-cal-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

// need to import useState
import { useState } from "react";
const navBtn = { background: "none", border: `0.5px solid ${G3}`, color: S, width: 30, height: 30, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0 };