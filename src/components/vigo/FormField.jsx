import { SD, G2, G3 } from "@/lib/vigoColors";

export default function FormField({ label, type = "text", placeholder, value, onChange, required = false }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: SD, textTransform: "uppercase", marginBottom: 8 }}>
        {label}{required && " *"}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          background: G2,
          border: `.5px solid ${G3}`,
          color: "#fff",
          padding: "12px 16px",
          fontSize: 12,
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}