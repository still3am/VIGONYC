import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";

export default function NeuralScanner({ onScanResult }) {
  const [active, setActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [merging, setMerging] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setActive(false);
    setScanning(false);
  };

  const startCamera = async () => {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setActive(true);
      setScanning(true);
      // Simulate QR scanning by checking every 2s (real QR decode would need a library)
      intervalRef.current = setInterval(() => {
        captureAndScan();
      }, 2000);
    } catch (e) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  };

  const captureAndScan = async () => {
    // In a real implementation this would decode the QR from the video frame.
    // Here we simulate by showing a manual input fallback after 6s
  };

  const handleManualCode = async (code) => {
    if (!code.trim()) return;
    setScanning(false);
    stopCamera();
    try {
      const res = await base44.functions.invoke("loyaltyPoints", { action: "scanQR", data: { qrCodeId: code.trim() } });
      const data = res.data;
      if (data.error) {
        setError(data.error);
      } else {
        setMerging(true);
        setTimeout(() => {
          setMerging(false);
          setResult(data);
          if (onScanResult) onScanResult(data);
        }, 1800);
      }
    } catch (e) {
      setError("Scan failed. Try again.");
    }
  };

  useEffect(() => () => stopCamera(), []);

  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);

  return (
    <div style={{ background: "#0a0a0a", border: "1px solid #222", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Pulsing corner brackets */}
      <div style={{ position: "absolute", top: 12, left: 12, width: 20, height: 20, borderTop: `2px solid ${S}`, borderLeft: `2px solid ${S}`, animation: "chrome-pulse 2s infinite" }} />
      <div style={{ position: "absolute", top: 12, right: 12, width: 20, height: 20, borderTop: `2px solid ${S}`, borderRight: `2px solid ${S}`, animation: "chrome-pulse 2s infinite" }} />
      <div style={{ position: "absolute", bottom: 12, left: 12, width: 20, height: 20, borderBottom: `2px solid ${S}`, borderLeft: `2px solid ${S}`, animation: "chrome-pulse 2s infinite" }} />
      <div style={{ position: "absolute", bottom: 12, right: 12, width: 20, height: 20, borderBottom: `2px solid ${S}`, borderRight: `2px solid ${S}`, animation: "chrome-pulse 2s infinite" }} />

      <div style={{ fontSize: 8, letterSpacing: 4, color: S, textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>✦ Neural Scanner</div>

      {/* Mercury flow animation */}
      {merging && (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: "mercury-drop 1.8s ease-in-out" }}>⬤</div>
            <div style={{ fontSize: 9, letterSpacing: 4, color: S, textTransform: "uppercase" }}>Merging...</div>
          </div>
        </div>
      )}

      {result && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
          <div style={{ fontSize: 11, color: S, fontWeight: 700, marginBottom: 4 }}>
            {result.type === "referral" ? result.message : `+${result.pointsAdded} Points Earned`}
          </div>
          {result.product && <div style={{ fontSize: 9, color: "#666", letterSpacing: 2 }}>{result.product.productName} — Authenticated</div>}
          <button onClick={() => { setResult(null); setManualCode(""); setShowManual(false); }} style={chromeBtn}>Scan Again</button>
        </div>
      )}

      {!result && (
        <>
          {/* Camera viewfinder */}
          <div style={{ position: "relative", aspectRatio: "1", background: "#0a0a0a", border: `1px solid #1a1a1a`, marginBottom: 16, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {active ? (
              <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted playsInline />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  <rect x="5" y="5" width="3" height="3" fill="#333"/><rect x="16" y="5" width="3" height="3" fill="#333"/><rect x="5" y="16" width="3" height="3" fill="#333"/>
                  <path d="M14 14h3v3M14 17v3h3"/>
                </svg>
                <div style={{ fontSize: 9, color: "#444", letterSpacing: 2, textTransform: "uppercase" }}>Ready to Scan</div>
              </div>
            )}
            {scanning && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "50%", left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg, transparent, ${S}, transparent)`, animation: "scanner-line 2s linear infinite" }} />
              </div>
            )}
          </div>

          {error && <div style={{ fontSize: 10, color: "#e03", textAlign: "center", marginBottom: 12 }}>{error}</div>}

          <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
            {!active ? (
              <button onClick={startCamera} style={chromeBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}><circle cx="12" cy="12" r="3"/><path d="M6.343 6.343A8 8 0 1 0 17.657 17.657A8 8 0 0 0 6.343 6.343z"/></svg>
                Scan Gear
              </button>
            ) : (
              <button onClick={stopCamera} style={{ ...chromeBtn, background: "transparent", border: "1px solid #333", color: "#666" }}>Stop Camera</button>
            )}

            <button onClick={() => setShowManual(!showManual)} style={{ background: "none", border: "none", fontSize: 8, letterSpacing: 2, color: "#444", cursor: "pointer", textTransform: "uppercase", fontFamily: "inherit" }}>
              {showManual ? "Hide" : "Enter Code Manually"}
            </button>

            {showManual && (
              <div style={{ display: "flex", gap: 0 }}>
                <input value={manualCode} onChange={e => setManualCode(e.target.value)} placeholder="Enter QR code / referral code" style={{ flex: 1, background: "#111", border: "1px solid #222", borderRight: "none", color: "#fff", padding: "10px 14px", fontSize: 11, outline: "none", fontFamily: "inherit" }} onKeyDown={e => e.key === "Enter" && handleManualCode(manualCode)} />
                <button onClick={() => handleManualCode(manualCode)} style={{ background: S, color: "#000", border: "none", padding: "10px 16px", fontSize: 9, letterSpacing: 1, fontWeight: 900, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase" }}>Submit</button>
              </div>
            )}
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <style>{`
        @keyframes chrome-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes scanner-line { 0%{top:10%} 100%{top:90%} }
        @keyframes mercury-drop { 0%{transform:scale(0);color:#333} 50%{transform:scale(2);color:#C0C0C0} 100%{transform:scale(1);color:#E8E8E8} }
      `}</style>
    </div>
  );
}

const chromeBtn = {
  width: "100%", background: "linear-gradient(135deg, #888, #C0C0C0, #E8E8E8, #C0C0C0)", color: "#000",
  border: "none", padding: "12px", fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
  fontWeight: 900, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center",
  transition: "all 0.2s",
};