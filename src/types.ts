export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  is_prime: boolean;
  url: string;
  image_url: string;
  source: string;
}

export interface SearchFilters {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  isPrime: boolean;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}