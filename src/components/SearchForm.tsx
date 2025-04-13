import React from 'react';
import { SearchFilters } from '../types';
import { Search, Star, Package, AlertCircle } from 'lucide-react';

interface SearchFormProps {
  onSearch: (keyword: string, filters: SearchFilters) => void;
  isLoading: boolean;
  error?: string | null;
}

export default function SearchForm({ onSearch, isLoading, error }: SearchFormProps) {
  const [keyword, setKeyword] = React.useState('');
  const [filters, setFilters] = React.useState<SearchFilters>({
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    isPrime: false,
  });
  const [localError, setLocalError] = React.useState<string | null>(null);

  const validateFilters = () => {
    if (filters.minPrice > filters.maxPrice) {
      setLocalError('Minimum price cannot be greater than maximum price');
      return false;
    }
    if (filters.minRating < 0 || filters.minRating > 5) {
      setLocalError('Rating must be between 0 and 5');
      return false;
    }
    setLocalError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFilters()) return;
    onSearch(keyword, filters);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      {(error || localError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error || localError}</span>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search for products..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
              step="0.01"
              disabled={isLoading}
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
              step="0.01"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400" />
              Minimum Rating
            </div>
          </label>
          <input
            type="number"
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
            min="0"
            max="5"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="prime"
          checked={filters.isPrime}
          onChange={(e) => setFilters({ ...filters, isPrime: e.target.checked })}
          className="rounded text-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
        <label htmlFor="prime" className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <Package size={16} className="text-blue-500" />
          Prime Eligible Only
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Searching...</span>
          </>
        ) : (
          <>
            <Search size={16} />
            <span>Search Products</span>
          </>
        )}
      </button>
    </form>
  );
}