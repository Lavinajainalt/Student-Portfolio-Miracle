# Generated by Django 5.1.7 on 2025-05-22 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_delete_studentvideo'),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='heading',
            field=models.CharField(default='General', max_length=200),
        ),
    ]
