import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ArtCategories } from "@/components/ArtCategories";
import { ArtGallery } from "@/components/ArtGallery";
import { FeaturedArtists } from "@/components/FeaturedArtists";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    // Removed scroll functionality for search queries
  }, [searchQuery]);

  return (
    <main className="min-h-screen">
      <Navigation />
      {!searchQuery && <Hero />}
      {!searchQuery && <ArtCategories />}
      <ArtGallery initialSearchQuery={searchQuery || ''} />
      {!searchQuery && <FeaturedArtists />}
      <Footer />
    </main>
  );
};

export default Index;
