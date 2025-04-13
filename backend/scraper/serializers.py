from rest_framework import serializers
from .models import ScrapedProduct

class ScrapedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapedProduct
        fields = ['id', 'title', 'price', 'rating', 'is_prime', 'product_url', 'image_url', 'created_at']