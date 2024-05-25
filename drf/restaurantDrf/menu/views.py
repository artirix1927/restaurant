from django.shortcuts import render

from rest_framework import viewsets

from .models import MenuItem, Category

from .serializers import MenuItemSerializer, CategorySerializer

from .rendererers import JPEGRenderer, PNGRenderer

from rest_framework.response import Response

from django_filters import rest_framework as filters

from rest_framework.renderers import JSONRenderer


# Create your views here.
class MenuItemViewset(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all().order_by("categories__id")
    serializer_class = MenuItemSerializer
    renderer_classes = (JSONRenderer, PNGRenderer, JPEGRenderer)

    def get_serializer_context(self):
        return {'request': self.request}



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    renderer_classes = (JSONRenderer, PNGRenderer, JPEGRenderer)

    def get_serializer_context(self):
        return {'request': self.request}