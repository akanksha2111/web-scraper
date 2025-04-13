from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.ProductSearchView.as_view(), name='product-search'),
    path('products/<int:product_id>/', views.get_product_detail, name='product-detail'),
    path('recent-searches/', views.get_recent_searches, name='recent-searches'),
]