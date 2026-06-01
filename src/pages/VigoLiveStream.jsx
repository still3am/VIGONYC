import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const LOGO = "https://media.base44.com/images/public/69d978a3dcb07c4d96ef01e2/3cb93aaf5_IMG_8246-removebg-preview.png";
const COVER = "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80";

const MOCK_MESSAGES = [
  { id: "m1", username: "still3am", message: "just copped the mocha set 🔥", isHost: false, isVerified: false, avatarUrl: "https://i.pravatar.cc/36?img=1" },
  { id: "m2", username: "VÍGO", message: "appreciate you all fr. more coming soon.", isHost: true, isVerified: false, avatarUrl: LOGO },
  { id: "m3", username: "angel", message: "these hoodies feel insane in hand", isHost: false, isVerified: true, avatarUrl: "https://i.pravatar.cc/36?img=5" },
  { id: "m4", username: "tyfromny", message: "when is the black set dropping?", isHost: false, isVerified: false, avatarUrl: "https://i.pravatar.cc/36?img=8" },
  { id: "m5", username: "VÍGO", message: "tonight. 11PM EST. be here.", isHost: true, isVerified: false, avatarUrl: LOGO },
  { id: "m6", username: "jordvn", message: "quality is insane bro", isHost: false, isVerified: true, avatarUrl: "https://i.pravatar.cc/36?img=11" },
  { id: "m7", username: "natashaa", message: "y'all goin crazy in here 🔥", isHost: false, isVerified: false, avatarUrl: "https://i.pravatar.cc/36?img=20" },
];

export default function VigoLiveStream() {
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [likeCount, setLikeCount] = useState(1200);
  const [liked, setLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [user, setUser] = useState(null);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.title = "THE BACK DOOR — VIGONYC";
    return () => { document.title = "VIGONYC — NYC Streetwear"; };
  }, []);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    // Load active stream
    base44.entities.LiveStreamEvent.filter({ isLive: true }, "-created_date", 1)
      .then(rows => { if (rows?.[0]) setStream(rows[0]); })
      .catch(() => {});
    // Subscribe to new chat messages
    const unsub = base44.entities.LiveChatMessage.subscribe((event) => {
      if (event.type === "create") {
        setMessages(prev => [...prev, event.data]);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (stream?.id) {
      base44.entities.LiveChatMessage.filter({ streamId: stream.id }, "created_date", 100)
        .then(rows => { if (rows?.length > 0) setMessages(prev => [...prev, ...rows]); })
        .catch(() => {});
    }
  }, [stream?.id]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const newMsg = {
      id: `local-${Date.now()}`,
      username: user?.full_name || "You",
      message: text,
      isHost: false,
      isVerified: false,
      avatarUrl: null,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    if (stream?.id) {
      base44.entities.LiveChatMessage.create({
        streamId: stream.id,
        username: user?.full_name || "Anonymous",
        message: text,
        isHost: false,
        isVerified: false,
      }).catch(() => {});
    }
  };

  const handleLike = () => {
    setLiked(l => !l);
    setLikeCount(c => liked ? c - 1 : c + 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "THE BACK DOOR — VIGONYC LIVE", url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const pinnedMsg = stream?.pinnedMessage || "BLACK SET DROPS TONIGHT 11PM EST";
  const pinnedSub = stream?.pinnedMessageSub || "No restocks. Once it's gone, it's gone.";
  const viewerCount = stream?.viewerCount || 284;
  const isLive = stream?.isLive !== false;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "#000",
      fontFamily: "'Helvetica Neue',Arial,sans-serif",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Background video / cover image */}
      {stream?.streamUrl ? (
        <iframe
          src={stream.streamUrl}
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", zIndex: 0 }}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `url(${stream?.coverImage || COVER})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.45)",
        }} />
      )}

      {/* Gradient overlays */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />

      {/* Top bar */}
      <div style={{ position: "relative", zIndex: 10, padding: "env(safe-area-inset-top, 16px) 16px 0", paddingTop: "max(env(safe-area-inset-top, 0px), 16px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <button onClick={() => navigate("/drops")} style={{ background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: 3, color: "#fff", textTransform: "uppercase" }}>
                {stream?.title || "THE BACK DOOR"}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: isLive ? "#ff3b3b" : "#888", animation: isLive ? "live-pulse 1.5s infinite" : "none" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: isLive ? "#ff5252" : "#888", letterSpacing: 1, textTransform: "uppercase" }}>{isLive ? "Live" : "Offline"}</span>
              </div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 0.5 }}>{viewerCount.toLocaleString()} inside</span>
            </div>
          </div>
          <div style={{ width: 36 }} />
        </div>
      </div>

      {/* Main content area — flex grows to fill */}
      <div style={{ flex: 1, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>

        {/* Pinned message */}
        <div style={{ padding: "0 16px", marginBottom: 12 }}>
          <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", borderRadius: 10, padding: "10px 14px", border: "0.5px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)" stroke="none"><path d="M16 2l-4 4-6-2-2 6 4 4-2 6 6-2 4 4 4-6-2-4 2-4z"/></svg>
              <span style={{ fontSize: 8, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontWeight: 700 }}>Pinned</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#fff", letterSpacing: 0.5, marginBottom: 2 }}>{pinnedMsg}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{pinnedSub}</div>
          </div>
        </div>

        {/* Chat scroll area */}
        <div ref={chatRef} style={{ overflowY: "auto", maxHeight: "45vh", padding: "0 16px", display: "flex", flexDirection: "column", gap: 10, scrollbarWidth: "none" }}>
          {messages.map((msg, i) => (
            <div key={msg.id || i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              {msg.avatarUrl ? (
                <img src={msg.avatarUrl} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} alt="" />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(192,192,192,0.2)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#C0C0C0", fontWeight: 700 }}>
                  {(msg.username || "?")[0].toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: msg.isHost ? "#C0C0C0" : "#fff" }}>{msg.username}</span>
                  {msg.isHost && (
                    <span style={{ fontSize: 7, letterSpacing: 1, background: "rgba(192,192,192,0.18)", color: "#C0C0C0", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", fontWeight: 700 }}>Host</span>
                  )}
                  {msg.isVerified && !msg.isHost && (
                    <span style={{ fontSize: 7, letterSpacing: 1, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "1px 5px", borderRadius: 3, textTransform: "uppercase", fontWeight: 700 }}>Verified</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{msg.message}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right action buttons */}
        <div style={{ position: "absolute", right: 16, bottom: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <button onClick={handleLike} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: likeAnim ? "scale(1.35)" : "scale(1)", transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill={liked ? "#ff3b3b" : "none"} stroke={liked ? "#ff3b3b" : "rgba(255,255,255,0.85)"} strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{likeCount >= 1000 ? (likeCount / 1000).toFixed(1) + "K" : likeCount}</span>
          </button>
          <button onClick={handleShare} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>42</span>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ display: "flex", gap: 3 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.75)" }} />)}
            </div>
          </button>
        </div>

        {/* Message input */}
        <div style={{ padding: "10px 16px", paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 24, backdropFilter: "blur(10px)", border: "0.5px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", padding: "0 14px" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit", padding: "12px 0", caretColor: "#C0C0C0" }}
            />
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", padding: "0 0 0 8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </button>
          </div>
          <button onClick={sendMessage} style={{ width: 44, height: 44, borderRadius: "50%", background: "#C0C0C0", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes live-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        input::placeholder { color: rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
}