import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";

let likeDebounceTimer = null;
let pendingLikes = 0;

export default function VigoLive() {
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Camera state (host only)
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamRef = useRef(null);

  // Load user
  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setIsAdmin(u?.role === "admin");
    }).catch(() => {});
  }, []);

  // Load active stream
  const loadStream = useCallback(async () => {
    try {
      const rows = await base44.entities.LiveStreamEvent.filter({ status: "live" }, "-created_date", 1);
      const found = rows?.[0] || null;
      if (!found) {
        const all = await base44.entities.LiveStreamEvent.list("-created_date", 1);
        if (all?.[0]) { setStream(all[0]); streamRef.current = all[0]; setLikeCount(all[0].likeCount || 0); }
      } else {
        setStream(found); streamRef.current = found; setLikeCount(found.likeCount || 0);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadStream(); }, [loadStream]);

  // Real-time stream updates
  useEffect(() => {
    const unsub = base44.entities.LiveStreamEvent.subscribe((event) => {
      if (streamRef.current && event.id === streamRef.current.id && event.type === "update") {
        setStream(event.data);
        streamRef.current = event.data;
        setLikeCount(event.data.likeCount || 0);
      }
    });
    return unsub;
  }, []);

  // Load chat
  useEffect(() => {
    if (!stream?.id) return;
    base44.entities.LiveChatMessage.filter({ streamId: stream.id }, "created_date", 100)
      .then(msgs => setMessages(msgs || [])).catch(() => {});
  }, [stream?.id]);

  // Real-time chat
  useEffect(() => {
    if (!stream?.id) return;
    const unsub = base44.entities.LiveChatMessage.subscribe((event) => {
      if (event.data?.streamId !== stream.id) return;
      if (event.type === "create") {
        setMessages(prev => prev.find(m => m.id === event.id) ? prev : [...prev, event.data]);
      }
    });
    return unsub;
  }, [stream?.id]);

  // Auto-scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Spam-able like — debounce the DB write, immediate UI
  const handleLike = useCallback(() => {
    if (!stream?.id) return;

    // Immediately update UI
    setLikeCount(prev => prev + 1);

    // Spawn floating heart at random position
    const id = Date.now() + Math.random();
    const x = 60 + Math.random() * 30; // right side %
    setFloatingHearts(prev => [...prev, { id, x }]);
    setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== id)), 2200);

    // Batch DB writes — debounce 800ms
    pendingLikes += 1;
    clearTimeout(likeDebounceTimer);
    likeDebounceTimer = setTimeout(async () => {
      const batch = pendingLikes;
      pendingLikes = 0;
      try {
        const current = streamRef.current;
        if (current?.id) {
          await base44.entities.LiveStreamEvent.update(current.id, {
            likeCount: (current.likeCount || 0) + batch,
          });
        }
      } catch {}
    }, 800);
  }, [stream?.id]);

  // Camera functions
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      cameraStreamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  const flipCamera = async () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    if (cameraActive) {
      if (cameraStreamRef.current) cameraStreamRef.current.getTracks().forEach(t => t.stop());
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: next }, audio: true });
        cameraStreamRef.current = mediaStream;
        if (videoRef.current) { videoRef.current.srcObject = mediaStream; videoRef.current.play(); }
      } catch {}
    }
  };

  const handleSend = async () => {
    const text = newMsg.trim();
    if (!text || !stream?.id || sending) return;
    setSending(true);
    const userName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Guest";
    setNewMsg("");
    try {
      await base44.entities.LiveChatMessage.create({
        streamId: stream.id, userName,
        userEmail: user?.email || null,
        text, isHost: isAdmin,
      });
    } catch { toast.error("Failed to send"); setNewMsg(text); }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: "THE BACK DOOR — VÍGO Live", url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
  };

  const isLive = stream?.status === "live";
  const isEnded = stream?.status === "ended";

  if (loading) return (
    <div style={{ minHeight: "100svh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 6, height: 6, background: "#C0C0C0", animation: "pulse 1s infinite" }} />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: "100svh", height: "100svh",
      background: "#000", color: "#fff",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>

      {/* VIDEO / CAMERA / BG LAYER */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {/* Host camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isAdmin} // mute self-view for host only
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            display: cameraActive ? "block" : "none",
            transform: facingMode === "user" ? "scaleX(-1)" : "none",
          }}
        />

        {/* Stream URL iframe (for viewers when host uses external stream) */}
        {!cameraActive && stream?.streamUrl && (
          <iframe
            src={stream.streamUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="autoplay; fullscreen; camera; microphone"
            allowFullScreen
          />
        )}

        {/* Placeholder when no feed */}
        {!cameraActive && !stream?.streamUrl && (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(180deg, #0d0d0d 0%, #111 50%, #0a0a0a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(48px,12vw,80px)", fontWeight: 900, letterSpacing: 12,
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.75)",
                textShadow: "0 0 40px rgba(255,255,255,0.25), 0 0 80px rgba(255,255,255,0.08)",
                fontStyle: "italic",
              }}>VÍGO</div>
              <div style={{ width: 60, height: 1, background: "rgba(255,255,255,0.08)", margin: "14px auto" }} />
              <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>
                {isLive ? "Stream starting..." : isEnded ? "Stream has ended" : "No active stream"}
              </div>
            </div>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 2, background: "rgba(255,255,255,0.8)", boxShadow: "0 0 60px 30px rgba(255,255,255,0.05)" }} />
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 72%, rgba(0,0,0,0.95) 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* FLOATING HEARTS */}
      {floatingHearts.map(h => (
        <div key={h.id} style={{
          position: "absolute", right: 72, bottom: 140, zIndex: 50,
          pointerEvents: "none", fontSize: 24,
          animation: `floatHeart 2.2s ease-out forwards`,
          left: `${h.x}%`,
        }}>❤️</div>
      ))}

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "max(14px, env(safe-area-inset-top, 14px)) 16px 8px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        {/* Back */}
        <button onClick={() => navigate(-1)} style={{
          background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: "0.5px solid rgba(255,255,255,0.18)", borderRadius: 20,
          padding: "8px 14px", color: "#fff", fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>

        {/* Stream status */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: "#fff", textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}>
            THE BACK DOOR
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {isLive && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(220,0,0,0.9)", borderRadius: 4, padding: "3px 8px" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: "liveDot 1.4s infinite" }} />
                <span style={{ fontSize: 8, letterSpacing: 2, fontWeight: 900, color: "#fff" }}>LIVE</span>
              </div>
            )}
            {isEnded && <div style={{ background: "rgba(80,80,80,0.85)", borderRadius: 4, padding: "3px 8px" }}><span style={{ fontSize: 8, letterSpacing: 2, color: "#aaa" }}>ENDED</span></div>}
            {(stream?.viewerCount || 0) > 0 && (
              <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: 4, padding: "3px 8px" }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>👁 {stream.viewerCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADMIN CAMERA CONTROLS — shown only for admin when live */}
      {isAdmin && isLive && (
        <div style={{
          position: "relative", zIndex: 10,
          padding: "8px 16px",
          display: "flex", gap: 8, alignItems: "center",
        }}>
          {!cameraActive ? (
            <button onClick={startCamera} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(0,200,80,0.85)", border: "none", borderRadius: 20,
              padding: "8px 16px", color: "#fff", fontSize: 10, letterSpacing: 1,
              fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
              textTransform: "uppercase", backdropFilter: "blur(8px)",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              Go Live on Camera
            </button>
          ) : (
            <>
              <button onClick={stopCamera} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(220,0,0,0.85)", border: "none", borderRadius: 20,
                padding: "8px 14px", color: "#fff", fontSize: 10, letterSpacing: 1,
                fontWeight: 800, cursor: "pointer", fontFamily: "inherit", textTransform: "uppercase",
              }}>
                <div style={{ width: 8, height: 8, background: "#fff", borderRadius: 2 }} />
                Stop Camera
              </button>
              <button onClick={flipCamera} style={{
                background: "rgba(0,0,0,0.6)", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 20,
                padding: "8px 14px", color: "#fff", fontSize: 10, cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                </svg>
                Flip
              </button>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f00", boxShadow: "0 0 8px #f00", animation: "liveDot 1.2s infinite" }} />
            </>
          )}
          {cameraError && <span style={{ fontSize: 10, color: "#ff6b6b" }}>{cameraError}</span>}
        </div>
      )}

      {/* BOTTOM CONTENT */}
      <div style={{ position: "relative", zIndex: 10, marginTop: "auto", padding: "0 0 max(16px, env(safe-area-inset-bottom, 16px))" }}>

        {/* RIGHT SIDE ACTIONS */}
        <div style={{
          position: "absolute", right: 12,
          bottom: "calc(max(16px, env(safe-area-inset-bottom, 16px)) + 60px)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 18,
        }}>
          {/* Spammable Like */}
          <button
            onClick={handleLike}
            onTouchStart={e => { e.preventDefault(); handleLike(); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              WebkitTapHighlightColor: "transparent",
            }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "0.5px solid rgba(255,255,255,0.2)",
              transition: "transform 0.1s",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff3b30" stroke="#ff3b30" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, color: "#ff6b6b", fontWeight: 700 }}>
              {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount || "Like"}
            </span>
          </button>

          {/* Share */}
          <button onClick={handleShare} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "0.5px solid rgba(255,255,255,0.2)",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Share</span>
          </button>
        </div>

        {/* PINNED MESSAGE */}
        {stream?.pinnedMessage && (
          <div style={{ margin: "0 16px 10px", background: "rgba(0,0,0,0.72)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C0C0C0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style={{ fontSize: 8, letterSpacing: 2, color: "#C0C0C0", textTransform: "uppercase", fontWeight: 700 }}>PINNED</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{stream.pinnedMessage}</div>
            {stream.pinnedSubtext && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{stream.pinnedSubtext}</div>}
          </div>
        )}

        {/* CHAT */}
        <div style={{
          maxHeight: 200, overflowY: "auto", padding: "0 72px 0 16px",
          display: "flex", flexDirection: "column", gap: 8, marginBottom: 10,
        }}>
          {messages.length === 0 && isLive && (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Be the first to say something...</div>
          )}
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                background: msg.isHost ? "transparent" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)",
              }}>
                {msg.isHost
                  ? <img src={LOGO} alt="" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "contain", background: "#111" }} />
                  : (msg.userName?.[0] || "?").toUpperCase()
                }
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: msg.isHost ? "#C0C0C0" : "#fff" }}>{msg.userName}</span>
                  {msg.isHost && <span style={{ fontSize: 7, letterSpacing: 1, background: "#C0C0C0", color: "#000", padding: "1px 5px", borderRadius: 3, fontWeight: 900, textTransform: "uppercase" }}>HOST</span>}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, wordBreak: "break-word" }}>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT */}
        {isLive ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
              border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 24,
              display: "flex", alignItems: "center", padding: "0 14px",
            }}>
              <input
                ref={inputRef}
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={user ? "Say something..." : "Sign in to chat"}
                disabled={!user || sending}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#fff", fontSize: 13, fontFamily: "inherit",
                  padding: "11px 0", opacity: user ? 1 : 0.5,
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!newMsg.trim() || !user || sending}
              style={{
                width: 44, height: 44, borderRadius: "50%", border: "none",
                background: newMsg.trim() && user ? "#C0C0C0" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: newMsg.trim() && user ? "pointer" : "default",
                flexShrink: 0, transition: "background 0.2s", opacity: sending ? 0.6 : 1,
              }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={newMsg.trim() && user ? "#000" : "rgba(255,255,255,0.4)"} strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ padding: "6px 16px", textAlign: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              {isEnded ? "This stream has ended." : "Chat opens when we go live."}
            </span>
          </div>
        )}
      </div>

      {/* NO STREAM OVERLAY */}
      {!stream && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.9)", backdropFilter: "blur(20px)",
          gap: 14, padding: 32, textAlign: "center",
        }}>
          <img src={LOGO} alt="VIGO" style={{ width: 52, height: 52, objectFit: "contain", opacity: 0.5 }} />
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Not live right now</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 220 }}>
            THE BACK DOOR opens when we stream. Follow us on Instagram to get the alert.
          </div>
          <a href="https://www.instagram.com/vigonyc/" target="_blank" rel="noopener noreferrer" style={{ padding: "11px 26px", background: "#C0C0C0", color: "#000", textDecoration: "none", fontSize: 9, letterSpacing: 3, fontWeight: 900, textTransform: "uppercase", marginTop: 6 }}>
            @VIGONYC →
          </a>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "0.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            ← Go Back
          </button>
        </div>
      )}

      <style>{`
        @keyframes liveDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.7)} }
        @keyframes floatHeart {
          0%  { opacity:1; transform:translateY(0) scale(0.8); }
          30% { opacity:1; transform:translateY(-40px) scale(1.2); }
          100%{ opacity:0; transform:translateY(-130px) scale(0.6); }
        }
        * { -webkit-tap-highlight-color: transparent; }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}