import { useEffect, useRef } from "react";

const TIERS = [
  { name: "Silver", min: 0, max: 3000, color: "#C0C0C0" },
  { name: "Chrome", min: 3000, max: 10000, color: "#E8E8E8" },
  { name: "Obsidian", min: 10000, max: 25000, color: "#9CA3AF" },
];

export default function PointTracker({ points = 0, totalEarned = 0 }) {
  const canvasRef = useRef(null);

  const tier = TIERS.find(t => totalEarned < t.max) || TIERS[TIERS.length - 1];
  const progress = Math.min((totalEarned - tier.min) / (tier.max - tier.min), 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const cx = size / 2, cy = size / 2;
    const radius = size * 0.38;
    const lineW = size * 0.06;

    ctx.clearRect(0, 0, size, size);

    // Background track
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = lineW;
    ctx.lineCap = "round";
    ctx.stroke();

    // Gradient fill
    const startAngle = Math.PI * 0.75;
    const endAngle = startAngle + progress * Math.PI * 1.5;
    if (progress > 0) {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, "#888888");
      grad.addColorStop(0.5, "#C0C0C0");
      grad.addColorStop(1, "#E8E8E8");
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.strokeStyle = grad;
      ctx.lineWidth = lineW;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // Liquid drop effect at end
    if (progress > 0 && progress < 1) {
      const dropX = cx + radius * Math.cos(endAngle);
      const dropY = cy + radius * Math.sin(endAngle);
      const dropGrad = ctx.createRadialGradient(dropX, dropY, 0, dropX, dropY, lineW * 0.8);
      dropGrad.addColorStop(0, "#ffffff");
      dropGrad.addColorStop(1, "#C0C0C0");
      ctx.beginPath();
      ctx.arc(dropX, dropY, lineW * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = dropGrad;
      ctx.fill();
    }
  }, [points, totalEarned, progress]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: 180, height: 180 }}>
        <canvas ref={canvasRef} width={180} height={180} style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#C0C0C0", letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>
            {points.toLocaleString()}
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#666", textTransform: "uppercase", marginTop: 2 }}>Points</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: tier.color, boxShadow: `0 0 8px ${tier.color}` }} />
        <span style={{ fontSize: 9, letterSpacing: 3, color: tier.color, textTransform: "uppercase" }}>{tier.name} Tier</span>
      </div>
      <div style={{ fontSize: 9, color: "#555", letterSpacing: 1 }}>
        {totalEarned < tier.max ? `${(tier.max - totalEarned).toLocaleString()} pts to ${TIERS[TIERS.indexOf(tier) + 1]?.name || "Max"}` : "Max Tier Reached"}
      </div>
    </div>
  );
}