import { G1, G3, error } from "@/lib/vigoColors";

export default function DeleteConfirmation({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div style={{ background: G1, border: `.5px solid ${error}`, borderTop: `2px solid ${error}`, padding: "24px", borderRadius: 4 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, color: error, textTransform: "uppercase", fontWeight: 900, marginBottom: 10 }}>
        ⚠ {title}
      </div>
      <p style={{ fontSize: 11, color: "#777", lineHeight: 1.8, marginBottom: 20 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            background: error,
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
            fontWeight: 900,
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: `.5px solid ${G3}`,
            color: "#777",
            padding: "12px 20px",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}