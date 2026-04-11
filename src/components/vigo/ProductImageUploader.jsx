import { useState } from "react";
import { Plus, Upload, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G2 = "#111";
const G3 = "#1a1a1a";
const SD = "#777";

export default function ProductImageUploader({ imageUrl, onImageChange, uploading }) {
  const [thumbnails, setThumbnails] = useState(imageUrl ? [imageUrl] : []);

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setThumbnails([...thumbnails, file_url]);
      if (thumbnails.length === 0) onImageChange(file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const removeThumbnail = (idx) => {
    const updated = thumbnails.filter((_, i) => i !== idx);
    setThumbnails(updated);
    if (idx === thumbnails.findIndex(t => t === imageUrl)) {
      onImageChange(updated[0] || "");
    }
  };

  const mainImage = imageUrl || thumbnails[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Main image display */}
      <div style={{ background: G1, border: `.5px solid ${G3}`, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280, borderRadius: 4 }}>
        {mainImage ? (
          <img src={mainImage} alt="Product" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        ) : (
          <div style={{ textAlign: "center", color: SD }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 11 }}>No image yet</div>
          </div>
        )}
      </div>

      {/* Thumbnail gallery */}
      {thumbnails.length > 0 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {thumbnails.map((thumb, i) => (
            <div key={i} style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={thumb}
                alt={`Thumb ${i}`}
                onClick={() => onImageChange(thumb)}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  background: G2,
                  border: thumb === mainImage ? `2px solid ${S}` : `.5px solid ${G3}`,
                  cursor: "pointer",
                  borderRadius: 3,
                }}
              />
              <button
                onClick={() => removeThumbnail(i)}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#e03",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <label style={{ flex: 1, cursor: uploading ? "not-allowed" : "pointer" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            style={{ display: "none" }}
            disabled={uploading}
          />
          <button
            type="button"
            onClick={(e) => e.currentTarget.parentElement?.querySelector('input[type="file"]')?.click()}
            disabled={uploading}
            style={{
              width: "100%",
              padding: "10px",
              background: uploading ? "#666" : S,
              color: "#000",
              border: "none",
              cursor: uploading ? "not-allowed" : "pointer",
              fontWeight: 900,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 9,
              letterSpacing: 1,
              textTransform: "uppercase",
              borderRadius: 3,
            }}
          >
            <Upload size={14} /> {uploading ? "Uploading..." : "Upload"}
          </button>
        </label>
      </div>
    </div>
  );
}