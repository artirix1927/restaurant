from django.contrib import admin

from .models import Table, BookingRequest


# Register your models here.

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    pass


@admin.register(BookingRequest)
class BookingRequestAdmin(admin.ModelAdmin):
    pass

