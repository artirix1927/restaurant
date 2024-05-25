from django.contrib import admin

from .models import MenuItem, Category
# Register your MenuItem here.
@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    pass
    

class MenuItemInlineAdmin(admin.TabularInline):
     model = MenuItem


class MenuItemInline(admin.TabularInline ):
    model = MenuItem.categories.through
    extra = 0

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    model = Category
    inlines = [MenuItemInline]
    



