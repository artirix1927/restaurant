from django.db import models


# Create your models here
from taggit.managers import TaggableManager
from phonenumber_field.modelfields import PhoneNumberField


class Table(models.Model):
    objects = models.Manager()

    max_guests = models.IntegerField(null=False)
    tags = TaggableManager()

    def __str__(self):
        return f'Table:{self.pk},Tags:{[str(x) for x in self.tags.all()]}'


class BookingRequest(models.Model):
    objects = models.Manager()

    guests = models.IntegerField()
    booking_start = models.DateTimeField()
    booking_end = models.DateTimeField()

    client_name = models.CharField(max_length=120)
    client_number = PhoneNumberField()
    client_email = models.EmailField()

    tags_for_table = TaggableManager()
    tables = models.ManyToManyField(Table)

    def __str__(self):
        return f'''Request:{self.pk},Name:{self.client_name}, Email + Number:{self.client_email}
                + {self.client_number},Tables:{[x.pk for x in self.tables.all()]}'''
