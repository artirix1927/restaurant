"""restaurantDrf URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import re_path
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static

from booking.views import *
from menu.views import *

from rest_framework_swagger.views import get_swagger_view


schema_view = get_swagger_view(title='Pastebin API')



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/get-tables', GetTablesView.as_view()),
    path('api/v1/create-booking-request', BookingRequestViewSet.as_view({'post':'create'})),
    path('api/v1/get-user-bookings', BookingRequestViewSet.as_view({'get':'list'})),
    path('api/v1/get-booking-by-id/<int:id>', BookingRequestViewSet.as_view({'get':'retrieve'})),
    path('api/v1/delete-booking-by-id/<int:id>', BookingRequestViewSet.as_view({'delete':'destroy'})),
    path('api/v1/get-menu', MenuItemViewset.as_view({'get':'list'})),
    path('api/v1/get-categories', CategoryViewSet.as_view({'get':'list'})),
    re_path(r'^$', schema_view)
    



]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


