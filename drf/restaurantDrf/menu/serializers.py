from rest_framework import serializers

from .models import MenuItem, Category

class BaseMenuItemSerializer(serializers.ModelSerializer):
    big_img = serializers.SerializerMethodField()
    img = serializers.SerializerMethodField()

    def get_big_img(self, obj):
        request = self.context.get('request')
        if obj.big_img:
            return request.build_absolute_uri(obj.big_img.url)
        return None
    
    def get_img(self, obj):
        request = self.context.get('request')
        if obj.img:
            return request.build_absolute_uri(obj.img.url)
        return None

class MenuItemSerializer(BaseMenuItemSerializer):

    class Meta:
        model = MenuItem
        fields = '__all__'



class CategorySerializer(serializers.ModelSerializer):
    menu_items = serializers.SerializerMethodField('related_menu_items')

    def related_menu_items(self, instance):
        return MenuItemSerializer(instance.menuitem_set.all(), many=True, context=self.context).data
    
    class Meta: 
        model = Category
        fields = ('menu_items', 'name', 'img')



