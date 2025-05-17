from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('faculty', 'Faculty'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    # Add custom related_name attributes to avoid the clash
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
    SUBJECT_CHOICES = (
        ('PGDFE', 'Post Graduate Diploma in Frontend Engineering'),
        ('DATA_SCIENCE', 'Data Science'),
        ('CYBER_SECURITY', 'Cyber Security'),
    )
    name = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.get_name_display()

class StudentSubject(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='subjects')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    enrollment_date = models.DateField(auto_now_add=True)
    
    class Meta:
        unique_together = ('student', 'subject')
        
    def __str__(self):
        return f"{self.student.username} - {self.subject.name}"