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
    // If there's a search query, scroll to the gallery section
    if (searchQuery) {
      const gallerySection = document.getElementById('gallery');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
