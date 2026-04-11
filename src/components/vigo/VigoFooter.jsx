import { Link } from "react-router-dom";

const S = "#C0C0C0";
const G1 = "#0a0a0a";
const G3 = "#1a1a1a";
const SD = "#777";

const cols = {
  Shop: [["New Arrivals", "/shop"], ["Tops", "/shop?cat=Tops"], ["Bottoms", "/shop?cat=Bottoms"], ["Outerwear", "/shop?cat=Outerwear"], ["Accessories", "/shop?cat=Accessories"], ["Drop Calendar", "/drops"]],
  Info: [["About", "/about"], ["Lookbook", "/lookbook"], ["Press", "/press"], ["FAQ", "/faq"]],
  Support: [["Contact", "/contact"], ["Track Order", "/track-order"], ["Shipping & Returns", "/faq"], ["Size Guide", "/product/1"], ["Wishlist", "/wishlist"]]
};

export default function VigoFooter({ logo }) {
  return (
    <footer style={{ background: G1, borderTop: `.5px solid ${G3}`, marginTop: 0 }}>
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,#888,#E8E8E8,${S},#E8E8E8,#888,transparent)` }} />
      





















































      
      <style>{`
        @media(max-width:900px){.vigo-footer-grid{grid-template-columns:1fr 1fr !important;}}
        @media(max-width:480px){.vigo-footer-grid{grid-template-columns:1fr !important;}}
        @media(max-width:900px){footer { display: none !important; }}
      `}</style>
    </footer>);

}