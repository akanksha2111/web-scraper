export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  isPrime: boolean;
  imageUrl: string;
  productUrl: string;
}

export interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  isPrime: boolean;
}