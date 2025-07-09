from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_id', models.CharField(max_length=50)),
                ('student_name', models.CharField(max_length=100)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('project_link', models.URLField()),
                ('date_submitted', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]