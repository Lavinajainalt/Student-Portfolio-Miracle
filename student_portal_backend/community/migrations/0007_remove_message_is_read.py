# Generated by Django 5.1.7 on 2025-05-24 07:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('community', '0006_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='is_read',
        ),
    ]
