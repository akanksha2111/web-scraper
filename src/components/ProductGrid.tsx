import React from 'react';
import { Product } from '../types';
import { Star, Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No products found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.is_prime && (
                <span className="flex items-center gap-1 text-blue-500">
                  <Package size={16} />
                  Prime
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
            </div>

            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition-colors"
            >
              View Product
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}