import { useState, useRef, useCallback } from "react";

const THRESHOLD = 72;

export default function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    const el = containerRef.current;
    if (el && el.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const onTouchMove = useCallback((e) => {
    if (startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      e.preventDefault();
      setPulling(true);
      setPullY(Math.min(dy * 0.5, THRESHOLD + 20));
    }
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (pullY >= THRESHOLD) {
      setRefreshing(true);
      setPullY(THRESHOLD);
      await onRefresh?.();
      setRefreshing(false);
    }
    startY.current = null;
    setPulling(false);
    setPullY(0);
  }, [pullY, onRefresh]);

  const progress = Math.min(pullY / THRESHOLD, 1);
  const show = pulling || refreshing;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", overflowY: "auto", height: "100%" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Indicator */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", justifyContent: "center", alignItems: "center",
        height: show ? Math.max(pullY, refreshing ? THRESHOLD : 0) : 0,
        overflow: "hidden", transition: refreshing || !pulling ? "height .3s" : "none",
        background: "linear-gradient(180deg,#0d0d0d,transparent)",
        pointerEvents: "none",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "2px solid #1a1a1a",
          borderTop: `2px solid #C0C0C0`,
          opacity: refreshing ? 1 : progress,
          transform: `rotate(${refreshing ? 0 : progress * 360}deg)`,
          animation: refreshing ? "ptr-spin 0.7s linear infinite" : "none",
          transition: refreshing ? "none" : "opacity .2s",
        }} />
      </div>

      <div style={{ transform: show ? `translateY(${refreshing ? THRESHOLD : pullY}px)` : "none", transition: refreshing || !pulling ? "transform .3s" : "none" }}>
        {children}
      </div>

      <style>{`@keyframes ptr-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}