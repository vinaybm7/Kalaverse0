import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  totalResults?: number;
  placeholder?: string;
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalResults,
  placeholder = "Search artworks, artists, or categories..."
}: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const clearSearch = () => {
    onSearchChange('');
    onCategoryChange('All');
  };

  const hasActiveFilters = searchQuery.trim() || selectedCategory !== 'All';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-10 pr-20 h-12 text-base transition-all duration-200 ${
            isFocused ? 'ring-2 ring-primary border-primary' : ''
          }`}
        />
        
        {/* Action Buttons */}
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 ${
                  selectedCategory !== 'All' ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`cursor-pointer ${
                    selectedCategory === category ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  {category}
                  {selectedCategory === category && (
                    <Badge variant="secondary" className="ml-auto h-5">
                      ✓
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters & Results */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory !== 'All' && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <button
                  onClick={() => onCategoryChange('All')}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchQuery.trim() && (
              <Badge variant="secondary" className="gap-1">
                "{searchQuery.trim()}"
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
          
          {typeof totalResults === 'number' && (
            <span className="text-muted-foreground">
              {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};