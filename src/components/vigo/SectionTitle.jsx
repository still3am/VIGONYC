import { S } from "@/lib/vigoColors";

export default function SectionTitle({ label, title, subtitle }) {
  return (
    <div>
      {label && (
        <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 14 }}>
          ✦ {label}
        </div>
      )}
      <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, letterSpacing: -1, marginBottom: subtitle ? 12 : 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 12, color: "#777", lineHeight: 1.9 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}