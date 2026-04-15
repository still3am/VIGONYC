import { Component } from "react";

const S = "#C0C0C0";
const SD = "var(--vt-sub)";
const G3 = "var(--vt-border)";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16 }}>✦ Something went wrong</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>Unexpected Error</h2>
          <p style={{ fontSize: 12, color: SD, lineHeight: 1.8, maxWidth: 360, marginBottom: 32 }}>
            Something broke on this page. Try refreshing — if it keeps happening, contact support.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ background: S, color: "#000", border: "none", padding: "12px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", fontWeight: 900, cursor: "pointer", fontFamily: "inherit" }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = "/"}
              style={{ background: "none", border: `.5px solid ${G3}`, color: SD, padding: "12px 28px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}
            >
              Go Home
            </button>
          </div>
          {this.state.error && (
            <details style={{ marginTop: 24, fontSize: 10, color: SD, maxWidth: 500, textAlign: "left" }}>
              <summary style={{ cursor: "pointer", letterSpacing: 1 }}>Error details</summary>
              <pre style={{ marginTop: 8, overflow: "auto", background: "var(--vt-card)", padding: 12, border: `.5px solid ${G3}`, fontSize: 9 }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}