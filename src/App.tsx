import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SearchForm from './components/SearchForm';
import ProductGrid from './components/ProductGrid';
import { Product, SearchFilters } from './types';
import { mockProducts } from './mockData';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (keyword: string, filters: SearchFilters) => {
    setIsLoading(true);
    setHasSearched(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filter mock products based on search criteria
    const filteredProducts = mockProducts.filter(product => {
      const matchesKeyword = product.title.toLowerCase().includes(keyword.toLowerCase());
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesRating = product.rating >= filters.minRating;
      const matchesPrime = !filters.isPrime || product.isPrime;

      return matchesKeyword && matchesPrice && matchesRating && matchesPrime;
    });

    setProducts(filteredProducts);
    setIsLoading(false);
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
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : hasSearched && (
            <ProductGrid products={products} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;