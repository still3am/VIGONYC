import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";

const MOCK_MESSAGES = [
  { id: 1, user: "still3am", role: null, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop", text: "just copped the mocha set 🔥" },
  { id: 2, user: "VÍGO", role: "HOST", avatar: LOGO, text: "appreciate you all fr. more coming soon." },
  { id: 3, user: "angel", role: "VERIFIED", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop", text: "these hoodies feel insane in hand" },
  { id: 4, user: "tyfromny", role: null, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop", text: "when is the black set dropping?" },
  { id: 5, user: "VÍGO", role: "HOST", avatar: LOGO, text: "tonight. 11PM EST. be here." },
  { id: 6, user: "jordvn", role: "VERIFIED", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop", text: "quality is insane bro" },
  { id: 7, user: "natashaa", role: null, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop", text: "y'all goin crazy in here 🔥" },
];

export default function VigoLive() {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMsg, setNewMsg] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [viewerCount, setViewerCount] = useState(284);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    base44.entities.LiveStreamEvent.filter({ status: "live" }, "-created_date", 1)
      .then(rows => {
        if (rows?.length > 0) setStream(rows[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate viewer count fluctuation
  useEffect(() => {
    const iv = setInterval(() => {
      setViewerCount(v => v + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const handleSend = async () => {
    const text = newMsg.trim();
    if (!text) return;
    let userName = "you";
    try {
      const user = await base44.auth.me();
      if (user) userName = user.full_name?.split(" ")[0] || user.email?.split("@")[0] || "you";
    } catch {}
    const msg = {
      id: Date.now(),
      user: userName,
      role: null,
      avatar: null,
      text,
    };
    setMessages(prev => [...prev, msg]);
    setNewMsg("");
    inputRef.current?.focus();
  };

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    if (stream) {
      base44.entities.LiveStreamEvent.update(stream.id, { likeCount: (stream.likeCount || 0) + 1 }).catch(() => {});
    }
  };

  const pinnedMsg = stream?.pinnedMessage || "BLACK SET DROPS TONIGHT 11PM EST";
  const pinnedSub = stream?.pinnedSubtext || "No restocks. Once it's gone, it's gone.";
  const likeCount = stream?.likeCount || 1200;
  const isLive = stream?.status === "live" || true; // show live UI always for preview

  return (
    <div style={{
      minHeight: "100svh",
      background: "#000",
      color: "#fff",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      {/* VIDEO LAYER */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}>
        {stream?.streamUrl ? (
          <iframe
            src={stream.streamUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          /* Placeholder video background */
          <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #0d0d0d 0%, #1a1a1a 40%, #0a0a0a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {/* VIGO neon sign style */}
            <div style={{
              textAlign: "center",
              userSelect: "none",
            }}>
              <div style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: 8,
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.85)",
                textShadow: "0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.15)",
                fontStyle: "italic",
              }}>VÍGO</div>
              <div style={{ width: 120, height: 2, background: "rgba(255,255,255,0.15)", margin: "12px auto 0" }} />
            </div>
            {/* Ceiling light effect */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 3,
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 60px 30px rgba(255,255,255,0.08), 0 0 120px 60px rgba(255,255,255,0.04)",
            }} />
          </div>
        )}
        {/* Dark gradient overlay for readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.92) 100%)",
        }} />
      </div>

      {/* HEADER */}
      <div style={{
        position: "relative",
        zIndex: 10,
        padding: "16px 16px 8px",
        paddingTop: "max(16px, env(safe-area-inset-top, 16px))",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#fff" }}>
            THE BACK DOOR
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isLive && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#ff3b30",
                boxShadow: "0 0 8px #ff3b30",
                animation: "live-pulse 1.5s infinite",
              }} />
              <span style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, color: "#fff", textTransform: "uppercase" }}>LIVE</span>
            </div>
          )}
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 1 }}>
            {viewerCount.toLocaleString()} INSIDE
          </span>
        </div>
      </div>

      {/* PINNED MESSAGE */}
      <div style={{
        position: "relative",
        zIndex: 10,
        margin: "auto 16px 0",
        marginTop: "auto",
      }}>
        <div style={{
          background: "rgba(10,10,10,0.82)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(192,192,192,0.8)" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span style={{ fontSize: 8, letterSpacing: 2, color: "rgba(192,192,192,0.8)", textTransform: "uppercase", fontWeight: 700 }}>PINNED</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: "#fff", marginBottom: 2 }}>{pinnedMsg}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{pinnedSub}</div>
        </div>

        {/* CHAT MESSAGES */}
        <div style={{
          maxHeight: 260,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 8,
          paddingRight: 48,
        }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              {msg.avatar ? (
                <img src={msg.avatar} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: msg.role === "HOST" ? "1px solid #C0C0C0" : "none" }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.12)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700 }}>
                  {msg.user?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: msg.role === "HOST" ? "#C0C0C0" : "#fff" }}>{msg.user}</span>
                  {msg.role && (
                    <span style={{
                      fontSize: 7, letterSpacing: 1,
                      color: msg.role === "HOST" ? "#0a0a0a" : "rgba(255,255,255,0.7)",
                      background: msg.role === "HOST" ? "#C0C0C0" : "rgba(255,255,255,0.15)",
                      padding: "1px 5px", borderRadius: 3, fontWeight: 700, textTransform: "uppercase"
                    }}>{msg.role}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div style={{
          position: "absolute",
          right: 0,
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}>
          <button onClick={handleLike} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            transform: likeAnim ? "scale(1.3)" : "scale(1)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill={liked ? "#ff3b30" : "none"} stroke={liked ? "#ff3b30" : "rgba(255,255,255,0.85)"} strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
              {((likeCount + (liked ? 1 : 0)) / 1000).toFixed(1)}K
            </span>
          </button>

          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "THE BACK DOOR — VÍGO Live", url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }
          }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Share</span>
          </button>

          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8">
              <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>

        {/* MESSAGE INPUT */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
          paddingTop: 4,
        }}>
          <div style={{
            flex: 1,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "0.5px solid rgba(255,255,255,0.15)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            gap: 8,
          }}>
            <input
              ref={inputRef}
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "#fff", fontSize: 13, fontFamily: "inherit",
                padding: "11px 0",
              }}
            />
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </button>
          </div>
          <button
            onClick={handleSend}
            style={{
              width: 42, height: 42, borderRadius: "50%",
              background: newMsg.trim() ? "#C0C0C0" : "rgba(255,255,255,0.15)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              flexShrink: 0,
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={newMsg.trim() ? "#000" : "rgba(255,255,255,0.6)"} strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Offline state */}
      {!loading && !stream && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)",
          gap: 16, padding: 32, textAlign: "center",
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 4, color: "rgba(255,255,255,0.15)" }}>VÍGO</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>No live stream right now</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: 240 }}>
            THE BACK DOOR opens when we're live. Follow us on Instagram to get notified.
          </div>
          <a href="https://www.instagram.com/vigonyc/" target="_blank" rel="noopener noreferrer" style={{
            marginTop: 8, padding: "12px 28px", background: "#C0C0C0", color: "#000",
            textDecoration: "none", fontSize: 9, letterSpacing: 3, fontWeight: 900, textTransform: "uppercase",
          }}>
            @VIGONYC
          </a>
        </div>
      )}

      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .vigo-live-page * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}