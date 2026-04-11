import { S, G1, G3, SD } from "@/lib/vigoColors";

export default function EmptyState({ icon, title, message, action, onAction }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        background: G1,
        border: `.5px solid ${G3}`,
        borderRadius: 4,
      }}
    >
      {icon && <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>{icon}</div>}
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: 11, color: SD, marginBottom: action ? 24 : 0 }}>
        {message}
      </p>
      {action && (
        <button
          onClick={onAction}
          style={{
            background: S,
            color: "#000",
            border: "none",
            padding: "12px 28px",
            fontSize: 9,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: 900,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}