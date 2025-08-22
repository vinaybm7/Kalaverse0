import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ArtCategories } from "@/components/ArtCategories";
import { ArtGallery } from "@/components/ArtGallery";
import { FeaturedArtists } from "@/components/FeaturedArtists";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ArtCategories />
      <ArtGallery />
      <FeaturedArtists />
      <Footer />
    </main>
  );
};

export default Index;
