import { S } from "@/lib/vigoColors";

export default function StatusBadge({ status }) {
  const statusConfig = {
    "Delivered": { color: "#0c6", label: "✓ Delivered" },
    "Shipped": { color: "#ff9800", label: "→ Shipped" },
    "Processing": { color: "#999", label: "⏳ Processing" },
    "Cancelled": { color: "#e03", label: "✕ Cancelled" },
    "New": { color: S, label: "● New" },
    "Reviewed": { color: "#999", label: "● Reviewed" },
    "Responded": { color: "#0c6", label: "✓ Responded" },
  };

  const config = statusConfig[status] || { color: "#777", label: status };

  return (
    <div
      style={{
        fontSize: 7,
        letterSpacing: 2,
        color: config.color,
        textTransform: "uppercase",
        border: `.5px solid ${config.color}`,
        padding: "3px 8px",
        display: "inline-block",
      }}
    >
      {config.label}
    </div>
  );
}