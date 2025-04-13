import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Wireless Mouse',
    price: 29.99,
    rating: 4.5,
    isPrime: true,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300',
    productUrl: '#'
  },
  {
    id: '2',
    title: 'Ergonomic Gaming Mouse',
    price: 59.99,
    rating: 4.8,
    isPrime: true,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300',
    productUrl: '#'
  },
  {
    id: '3',
    title: 'Basic Wireless Mouse',
    price: 15.99,
    rating: 3.9,
    isPrime: false,
    imageUrl: 'https://images.unsplash.com/photo-1618499890638-3a0dd4b86c96?w=300',
    productUrl: '#'
  }
];