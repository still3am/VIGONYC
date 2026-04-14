import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useState } from "react";

const S = "#C0C0C0";
const G3 = "var(--vt-border)";
const SD = "var(--vt-sub)";

export default function SelectDrawer({ label, value, options, onChange, required = false }) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || "Select…";

  return (
    <>
      <div>
        <div style={{ fontSize: 8, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>{label}{required && " *"}</div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            width: "100%",
            background: "var(--vt-card)",
            border: `.5px solid ${value ? S : G3}`,
            color: value ? "var(--vt-text)" : SD,
            padding: "13px 16px",
            fontSize: 12,
            outline: "none",
            fontFamily: "inherit",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            textAlign: "left",
          }}
        >
          <span>{selectedLabel}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent style={{ background: "var(--vt-card)", border: "none", borderTop: `2px solid ${S}` }}>
          <DrawerHeader>
            <DrawerTitle style={{ color: "var(--vt-text)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textAlign: "left" }}>
              {label}
            </DrawerTitle>
          </DrawerHeader>
          <div style={{ padding: "0 0 env(safe-area-inset-bottom,16px)" }}>
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  background: value === opt.value ? "rgba(192,192,192,.08)" : "none",
                  border: "none",
                  borderBottom: `.5px solid ${G3}`,
                  color: value === opt.value ? S : "var(--vt-text)",
                  padding: "18px 24px",
                  fontSize: 13,
                  textAlign: "left",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {opt.label}
                {value === opt.value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}