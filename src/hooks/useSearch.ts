import { useState, useMemo } from 'react';

interface SearchableItem {
  id: number;
  title: string;
  artist: string;
  category: string;
  description?: string;
  location?: string;
}

export const useSearch = <T extends SearchableItem>(items: T[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category first
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.artist.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [items, searchQuery, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
    return ['All', ...uniqueCategories];
  }, [items]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredItems,
    categories,
    hasResults: filteredItems.length > 0,
    totalResults: filteredItems.length
  };
};