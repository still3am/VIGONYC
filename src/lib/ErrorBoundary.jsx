import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("VIGONYC Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 32, color: "#C0C0C0" }}>✕</div>
          <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#C0C0C0" }}>Something went wrong</div>
          <p style={{ fontSize: 13, color: "var(--vt-sub)", maxWidth: 360, lineHeight: 1.7 }}>An unexpected error occurred. Refresh the page or contact support.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "#C0C0C0", color: "#000", border: "none", padding: "12px 28px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer" }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}