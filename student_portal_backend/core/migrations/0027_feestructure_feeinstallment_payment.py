# Generated by Django 5.1.7 on 2025-05-26 13:33

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0026_remove_payment_installment_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='FeeStructure',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.CharField(choices=[('PGDFE', 'Post Graduate Diploma in Frontend Engineering'), ('DATA_SCIENCE', 'Data Science'), ('CYBER_SECURITY', 'Cyber Security')], max_length=50)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('number_of_installments', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='FeeInstallment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('due_date', models.DateField()),
                ('installment_number', models.IntegerField()),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('PAID', 'Paid'), ('OVERDUE', 'Overdue')], default='PENDING', max_length=20)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('fee_structure', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.feestructure')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('payment_date', models.DateTimeField(auto_now_add=True)),
                ('payment_method', models.CharField(choices=[('CREDIT_CARD', 'Credit Card'), ('DEBIT_CARD', 'Debit Card'), ('NET_BANKING', 'Net Banking'), ('UPI', 'UPI')], max_length=20)),
                ('transaction_id', models.CharField(max_length=100, unique=True)),
                ('status', models.CharField(choices=[('SUCCESS', 'Success'), ('FAILED', 'Failed'), ('PENDING', 'Pending')], max_length=20)),
                ('installment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.feeinstallment')),
            ],
        ),
    ]
