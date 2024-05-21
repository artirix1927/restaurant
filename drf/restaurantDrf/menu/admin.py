from django.contrib import admin

from .models import MenuItem, Category
# Register your MenuItem here.
@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    pass
    


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass
