# Generated by Django 5.1.7 on 2025-05-26 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0022_rename_amount_paid_payment_amount_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='installment',
        ),
        migrations.RemoveField(
            model_name='feestructure',
            name='subject',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='role',
            field=models.CharField(choices=[('student', 'Student'), ('faculty', 'Faculty')], max_length=10),
        ),
        migrations.AlterField(
            model_name='subject',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='subject',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.DeleteModel(
            name='FeeInstallment',
        ),
        migrations.DeleteModel(
            name='Payment',
        ),
        migrations.DeleteModel(
            name='FeeStructure',
        ),
    ]
