import json
import requests
from bs4 import BeautifulSoup
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import ScrapedProduct
from .serializers import ScrapedProductSerializer
import time
import random
from django.db.models import Q

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

@method_decorator(csrf_exempt, name='dispatch')
class ProductSearchView(APIView):
    pagination_class = StandardResultsSetPagination

    def post(self, request):
        try:
            # Get search parameters
            keyword = request.data.get('keyword', '')
            min_price = float(request.data.get('minPrice', 0))
            max_price = float(request.data.get('maxPrice', float('inf')))
            min_rating = float(request.data.get('minRating', 0))
            is_prime_only = request.data.get('isPrime', False)

            # Perform web scraping
            products = self.scrape_amazon(keyword)

            # Filter results
            filtered_products = [
                product for product in products
                if (min_price <= product['price'] <= max_price and
                    product['rating'] >= min_rating and
                    (not is_prime_only or product['is_prime']))
            ]

            # Save results to database
            saved_products = []
            for product_data in filtered_products:
                # Check if product already exists
                existing_product = ScrapedProduct.objects.filter(
                    Q(title=product_data['title']) & 
                    Q(price=product_data['price'])
                ).first()

                if existing_product:
                    saved_products.append(existing_product)
                else:
                    product = ScrapedProduct.objects.create(**product_data)
                    saved_products.append(product)

            # Paginate results
            paginator = self.pagination_class()
            page = paginator.paginate_queryset(saved_products, request)
            
            # Serialize the paginated results
            serializer = ScrapedProductSerializer(page, many=True)
            
            return Response({
                'count': len(saved_products),
                'next': paginator.get_next_link(),
                'previous': paginator.get_previous_link(),
                'results': serializer.data
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def scrape_amazon(self, keyword):
        products = []
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Connection': 'keep-alive',
        }
        
        # Format the search query for Amazon URL
        search_query = keyword.replace(' ', '+')
        url = f'https://www.amazon.com/s?k={search_query}'
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all product items
            product_items = soup.find_all('div', {'data-component-type': 's-search-result'})
            
            for item in product_items:
                try:
                    # Extract product title
                    title_elem = item.find('h2', {'class': 'a-size-mini'})
                    title = title_elem.text.strip() if title_elem else 'N/A'
                    
                    # Extract price
                    price_elem = item.find('span', {'class': 'a-offscreen'})
                    price = float(price_elem.text.replace('$', '').replace(',', '')) if price_elem else 0.0
                    
                    # Extract rating
                    rating_elem = item.find('span', {'class': 'a-icon-alt'})
                    rating = float(rating_elem.text.split()[0]) if rating_elem else 0.0
                    
                    # Extract product URL
                    url_elem = item.find('a', {'class': 'a-link-normal'})
                    product_url = 'https://www.amazon.com' + url_elem['href'] if url_elem else ''
                    
                    # Check if product is Prime eligible
                    prime_elem = item.find('i', {'class': 'a-icon-prime'})
                    is_prime = bool(prime_elem)
                    
                    # Extract image URL
                    img_elem = item.find('img', {'class': 's-image'})
                    image_url = img_elem['src'] if img_elem else ''
                    
                    product_data = {
                        'title': title,
                        'price': price,
                        'rating': rating,
                        'url': product_url,
                        'is_prime': is_prime,
                        'image_url': image_url,
                        'source': 'amazon'
                    }
                    
                    products.append(product_data)
                    
                    # Add a small delay to be respectful to the website
                    time.sleep(random.uniform(0.5, 1.5))
                    
                except Exception as e:
                    print(f"Error processing product: {str(e)}")
                    continue
                    
        except Exception as e:
            print(f"Error during scraping: {str(e)}")
            
        return products

@api_view(['GET'])
def get_product_detail(request, product_id):
    try:
        product = ScrapedProduct.objects.get(id=product_id)
        serializer = ScrapedProductSerializer(product)
        return Response(serializer.data)
    except ScrapedProduct.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def get_recent_searches(request):
    try:
        # Get the 10 most recent unique searches
        recent_searches = ScrapedProduct.objects.values('title').distinct().order_by('-created_at')[:10]
        return Response([search['title'] for search in recent_searches])
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )