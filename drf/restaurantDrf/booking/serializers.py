from rest_framework import serializers

from taggit.serializers import (TagListSerializerField,
                                TaggitSerializer)

from .models import Table, BookingRequest

class TableSerializer(TaggitSerializer, serializers.ModelSerializer):
    
    tags = TagListSerializerField()

    class Meta:
        model = Table
        fields = '__all__'


class BookingRequestSerializer(TaggitSerializer, serializers.ModelSerializer):
    
    tags_for_table = TagListSerializerField()

    class Meta:
        model = BookingRequest
        fields = '__all__'