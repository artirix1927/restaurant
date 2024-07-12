from django.db import models


# Create your models here.
class Category(models.Model):
    objects = models.Manager()
    name = models.TextField()
    img = models.ImageField(upload_to="images/categories/")
    

    def __str__(self):
        return self.name
    

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'


class MenuItem(models.Model):
    objects = models.Manager()

    name = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    desc = models.TextField()
    img = models.ImageField(upload_to="images/menu/")
    big_img = models.ImageField(upload_to="images/menu/")
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return f'{self.name}:{self.price}'
    
    




