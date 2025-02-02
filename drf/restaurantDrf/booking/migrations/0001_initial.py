# Generated by Django 4.1 on 2023-08-24 20:47

from django.db import migrations, models
import phonenumber_field.modelfields
import taggit.managers


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('taggit', '0005_auto_20220424_2025'),
    ]

    operations = [
        migrations.CreateModel(
            name='Table',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('max_guests', models.IntegerField()),
                ('tags', taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags')),
            ],
        ),
        migrations.CreateModel(
            name='BookingRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guests', models.IntegerField()),
                ('booking_start', models.DateTimeField()),
                ('booking_end', models.DateTimeField()),
                ('client_name', models.CharField(max_length=120)),
                ('client_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('client_email', models.EmailField(max_length=254)),
                ('tables', models.ManyToManyField(to='booking.table')),
                ('tags_for_table', taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags')),
            ],
        ),
    ]
