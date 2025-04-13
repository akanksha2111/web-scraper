import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchForm from './components/SearchForm';
import ProductGrid from './components/ProductGrid';
import { Product, SearchFilters } from './types';

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch recent searches when component mounts
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const response = await fetch('/api/recent-searches/');
      if (!response.ok) throw new Error('Failed to fetch recent searches');
      const data = await response.json();
      setRecentSearches(data);
    } catch (err) {
      console.error('Error fetching recent searches:', err);
    }
  };

  const handleSearch = async (keyword: string, filters: SearchFilters) => {
    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setCurrentPage(1);

    try {
      const response = await fetch('/api/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating,
          isPrime: filters.isPrime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ApiResponse = await response.json();
      setProducts(data.results);
      setTotalPages(Math.ceil(data.count / 12)); // Assuming 12 items per page
      
      // Fetch updated recent searches
      fetchRecentSearches();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);

    try {
      const response = await fetch(`/api/search/?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data: ApiResponse = await response.json();
      setProducts(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2">
            <Search size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Product Search</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            error={error}
          />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : hasSearched && (
            <>
              <ProductGrid products={products} />
              
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {recentSearches.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search, {
                      minPrice: 0,
                      maxPrice: 1000,
                      minRating: 0,
                      isPrime: false,
                    })}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;