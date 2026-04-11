export default function PageLoader() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: "3px solid #333",
        borderTop: "3px solid #C0C0C0",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}