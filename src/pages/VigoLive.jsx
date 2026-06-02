import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";

export default function VigoLive() {
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [user, setUser] = useState(null);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const streamRef = useRef(null);

  // Load user
  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  // Load active stream
  const loadStream = useCallback(async () => {
    try {
      const rows = await base44.entities.LiveStreamEvent.filter({ status: "live" }, "-created_date", 1);
      if (rows?.length > 0) {
        setStream(rows[0]);
        streamRef.current = rows[0];
      } else {
        // Fall back to most recent stream of any status
        const all = await base44.entities.LiveStreamEvent.list("-created_date", 1);
        if (all?.length > 0) {
          setStream(all[0]);
          streamRef.current = all[0];
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadStream(); }, [loadStream]);

  // Real-time stream updates
  useEffect(() => {
    const unsub = base44.entities.LiveStreamEvent.subscribe((event) => {
      if (event.type === "update" && streamRef.current && event.id === streamRef.current.id) {
        setStream(event.data);
        streamRef.current = event.data;
      }
    });
    return unsub;
  }, []);

  // Load chat messages when stream is known
  useEffect(() => {
    if (!stream?.id) return;
    base44.entities.LiveChatMessage.filter({ streamId: stream.id }, "created_date", 100)
      .then(msgs => setMessages(msgs || []))
      .catch(() => {});
  }, [stream?.id]);

  // Real-time chat subscription
  useEffect(() => {
    if (!stream?.id) return;
    const unsub = base44.entities.LiveChatMessage.subscribe((event) => {
      if (event.data?.streamId !== stream.id) return;
      if (event.type === "create") {
        setMessages(prev => {
          if (prev.find(m => m.id === event.id)) return prev;
          return [...prev, event.data];
        });
      }
    });
    return unsub;
  }, [stream?.id]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if user already liked this stream
  useEffect(() => {
    if (!stream?.id) return;
    const key = `vigo_liked_${stream.id}`;
    if (localStorage.getItem(key) === "1") setLiked(true);
  }, [stream?.id]);

  const handleLike = async () => {
    if (liked || !stream?.id) return;
    setLiked(true);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    localStorage.setItem(`vigo_liked_${stream.id}`, "1");

    // Spawn floating hearts
    const id = Date.now();
    const x = 75 + Math.random() * 10;
    setFloatingHearts(prev => [...prev, { id, x }]);
    setTimeout(() => setFloatingHearts(prev => prev.filter(h => h.id !== id)), 2000);

    try {
      await base44.entities.LiveStreamEvent.update(stream.id, {
        likeCount: (stream.likeCount || 0) + 1
      });
    } catch {}
  };

  const handleSend = async () => {
    const text = newMsg.trim();
    if (!text || !stream?.id || sending) return;
    setSending(true);

    let userName = "Guest";
    let userEmail = null;
    let isHost = false;
    if (user) {
      userName = user.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Guest";
      userEmail = user.email;
      isHost = user.role === "admin";
    }

    setNewMsg("");
    try {
      await base44.entities.LiveChatMessage.create({
        streamId: stream.id,
        userName,
        userEmail,
        text,
        isHost,
      });
    } catch {
      toast.error("Failed to send message");
      setNewMsg(text);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "THE BACK DOOR — VÍGO Live", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const likeCount = stream?.likeCount || 0;
  const viewerCount = stream?.viewerCount || 0;
  const isLive = stream?.status === "live";
  const isEnded = stream?.status === "ended";
  const pinnedMsg = stream?.pinnedMessage;
  const pinnedSub = stream?.pinnedSubtext;

  if (loading) {
    return (
      <div style={{ minHeight: "100svh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 6, height: 6, background: "#C0C0C0", animation: "pulse 1s infinite" }} />
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100svh",
      height: "100svh",
      background: "#000",
      color: "#fff",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* VIDEO / BG LAYER */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {stream?.streamUrl ? (
          <iframe
            src={stream.streamUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(180deg, #0d0d0d 0%, #111 40%, #0a0a0a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 72, fontWeight: 900, letterSpacing: 10,
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.8)",
                textShadow: "0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.1)",
                fontStyle: "italic",
              }}>VÍGO</div>
              <div style={{ width: 80, height: 1, background: "rgba(255,255,255,0.1)", margin: "16px auto" }} />
              <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
                {isLive ? "Stream starting..." : isEnded ? "Stream has ended" : "Coming soon"}
              </div>
            </div>
            {/* Spotlight */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 160, height: 2, background: "rgba(255,255,255,0.9)", boxShadow: "0 0 80px 40px rgba(255,255,255,0.06)" }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.95) 100%)",
        }} />
      </div>

      {/* FLOATING HEARTS */}
      {floatingHearts.map(h => (
        <div key={h.id} style={{
          position: "absolute", bottom: 120, right: 16, zIndex: 50,
          pointerEvents: "none",
          animation: "floatHeart 2s ease-out forwards",
          fontSize: 22,
        }}>❤️</div>
      ))}

      {/* HEADER */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "max(14px, env(safe-area-inset-top, 14px)) 16px 8px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 20,
          padding: "8px 14px", color: "#fff", fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        {/* Stream info */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              THE BACK DOOR
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isLive && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,0,0,0.85)", borderRadius: 4, padding: "2px 8px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "liveDot 1.4s infinite" }} />
                <span style={{ fontSize: 9, letterSpacing: 2, fontWeight: 800, color: "#fff" }}>LIVE</span>
              </div>
            )}
            {isEnded && (
              <div style={{ background: "rgba(80,80,80,0.8)", borderRadius: 4, padding: "2px 8px" }}>
                <span style={{ fontSize: 9, letterSpacing: 2, fontWeight: 700, color: "#aaa" }}>ENDED</span>
              </div>
            )}
            {viewerCount > 0 && (
              <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: 4, padding: "2px 8px" }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", letterSpacing: 1 }}>
                  👁 {viewerCount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM CONTENT */}
      <div style={{ position: "relative", zIndex: 10, marginTop: "auto", padding: "0 0 max(16px, env(safe-area-inset-bottom, 16px))" }}>

        {/* RIGHT SIDE ACTIONS */}
        <div style={{
          position: "absolute", right: 12, bottom: "calc(max(16px, env(safe-area-inset-bottom, 16px)) + 56px)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        }}>
          {/* Like */}
          <button onClick={handleLike} style={{
            background: "none", border: "none", cursor: liked ? "default" : "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            transform: likeAnim ? "scale(1.35)" : "scale(1)",
            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: liked ? "1.5px solid #ff3b30" : "0.5px solid rgba(255,255,255,0.2)",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={liked ? "#ff3b30" : "none"}
                stroke={liked ? "#ff3b30" : "rgba(255,255,255,0.9)"} strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, color: liked ? "#ff3b30" : "rgba(255,255,255,0.8)", fontWeight: 600 }}>
              {likeCount > 0 ? (likeCount >= 1000 ? `${(likeCount/1000).toFixed(1)}K` : likeCount) : "Like"}
            </span>
          </button>

          {/* Share */}
          <button onClick={handleShare} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
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
        {pinnedMsg && (
          <div style={{ margin: "0 16px 10px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C0C0C0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span style={{ fontSize: 8, letterSpacing: 2, color: "#C0C0C0", textTransform: "uppercase", fontWeight: 700 }}>PINNED</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{pinnedMsg}</div>
            {pinnedSub && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{pinnedSub}</div>}
          </div>
        )}

        {/* CHAT MESSAGES */}
        <div style={{
          maxHeight: 220, overflowY: "auto", padding: "0 16px",
          display: "flex", flexDirection: "column", gap: 8,
          marginBottom: 10, paddingRight: 72,
        }}>
          {messages.length === 0 && isLive && (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Be the first to say something...</div>
          )}
          {messages.map(msg => (
            <div key={msg.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: msg.isHost ? "#C0C0C0" : "rgba(255,255,255,0.12)",
                border: msg.isHost ? "none" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: msg.isHost ? "#000" : "rgba(255,255,255,0.7)",
              }}>
                {msg.isHost
                  ? <img src={LOGO} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "contain" }} />
                  : (msg.userName?.[0] || "?").toUpperCase()
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: msg.isHost ? "#C0C0C0" : "#fff" }}>
                    {msg.userName}
                  </span>
                  {msg.isHost && (
                    <span style={{ fontSize: 7, letterSpacing: 1, background: "#C0C0C0", color: "#000", padding: "1px 5px", borderRadius: 3, fontWeight: 900, textTransform: "uppercase" }}>HOST</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4, wordBreak: "break-word" }}>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* MESSAGE INPUT */}
        {isLive ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)", border: "0.5px solid rgba(255,255,255,0.15)",
              borderRadius: 24, display: "flex", alignItems: "center", padding: "0 14px",
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
                width: 44, height: 44, borderRadius: "50%", border: "none", cursor: "pointer",
                background: newMsg.trim() && user ? "#C0C0C0" : "rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.2s", opacity: sending ? 0.6 : 1,
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={newMsg.trim() && user ? "#000" : "rgba(255,255,255,0.5)"} strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ padding: "0 16px" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "8px 0" }}>
              {isEnded ? "This stream has ended." : "Chat opens when we go live."}
            </div>
          </div>
        )}
      </div>

      {/* OFFLINE / NOT LIVE overlay */}
      {!stream && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)",
          gap: 16, padding: 32, textAlign: "center",
        }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>VIGONYC</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>No stream right now</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: 240 }}>
            THE BACK DOOR opens when we're live. Follow us to get notified first.
          </div>
          <a href="https://www.instagram.com/vigonyc/" target="_blank" rel="noopener noreferrer" style={{
            marginTop: 8, padding: "12px 28px", background: "#C0C0C0", color: "#000",
            textDecoration: "none", fontSize: 9, letterSpacing: 3, fontWeight: 900, textTransform: "uppercase",
          }}>
            @VIGONYC →
          </a>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "0.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", padding: "10px 20px", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
            ← Go Back
          </button>
        </div>
      )}

      <style>{`
        @keyframes liveDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes floatHeart { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-120px) scale(1.6)} }
        * { -webkit-tap-highlight-color: transparent; }
        input::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  );
}