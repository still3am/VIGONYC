import Nav from "../components/vigo/Nav";
import Hero from "../components/vigo/Hero";
import Shop from "../components/vigo/Shop";
import Collection from "../components/vigo/Collection";
import BrandStory from "../components/vigo/BrandStory";
import Footer from "../components/vigo/Footer";

export default function VIGONYCFlagship() {
  return (
    <div className="bg-vigo-black min-h-screen font-vigo overflow-x-hidden">
      <Nav />
      <Hero />
      <Shop />
      <Collection />
      <BrandStory />
      <Footer />
    </div>
  );
}