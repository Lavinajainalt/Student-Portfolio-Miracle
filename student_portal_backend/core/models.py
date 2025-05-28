from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('faculty', 'Faculty'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
  
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='custom_user',
    )

    def __str__(self):
        return self.username

class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class StudentSubject(models.Model):
    student = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.student.username} - {self.subject.name}"

class Video(models.Model):
    title = models.CharField(max_length=200)
    heading = models.CharField(max_length=200, null=True, blank=True)
    video_url = models.URLField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='videos')
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.subject.name}"

class FeeStructure(models.Model):
    course = models.CharField(max_length=50, choices=[
        ('PGDFE', 'Post Graduate Diploma in Frontend Engineering'),
        ('DATA_SCIENCE', 'Data Science'),
        ('CYBER_SECURITY', 'Cyber Security')
    ])
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_installments = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course} - ₹{self.total_amount}"

class FeeInstallment(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    installment_number = models.IntegerField()
    status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue')
    ], default='PENDING')

    def __str__(self):
        return f"{self.student.username} - Installment {self.installment_number}"

class Payment(models.Model):
    installment = models.ForeignKey(FeeInstallment, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=[
        ('CREDIT_CARD', 'Credit Card'),
        ('DEBIT_CARD', 'Debit Card'),
        ('NET_BANKING', 'Net Banking'),
        ('UPI', 'UPI')
    ])
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=[
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('PENDING', 'Pending')
    ])
    payment_details = models.JSONField(null=True, blank=True)  # Store payment details including PIN

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.status}"

# Test Models
class Topic(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='topics')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.subject.name} - {self.name}"

    class Meta:
        unique_together = ('subject', 'name')

class Question(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=200)
    option_b = models.CharField(max_length=200)
    option_c = models.CharField(max_length=200)
    option_d = models.CharField(max_length=200)
    correct_answer = models.CharField(max_length=200, choices=[
        ('option_a', 'Option A'),
        ('option_b', 'Option B'),
        ('option_c', 'Option C'),
        ('option_d', 'Option D')
    ])
    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.question_text

    class Meta:
        ordering = ['id']
