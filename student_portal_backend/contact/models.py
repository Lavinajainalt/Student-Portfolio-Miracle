from django.db import models
from django.utils import timezone
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError
import os

# Function to validate file size
def validate_file_size(value):
    filesize = value.size
    if filesize > 5 * 1024 * 1024:  # 5MB limit
        raise ValidationError("The maximum file size that can be uploaded is 5MB")
    return value

# Function to determine resume upload path
def resume_upload_path(instance, filename):
    # Get the file extension
    ext = filename.split('.')[-1]
    # Generate a new filename with timestamp
    new_filename = f"resume_{instance.name.replace(' ', '_')}_{timezone.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    # Return the upload path
    return os.path.join('resumes', new_filename)

# In contact/models.py
class Contact(models.Model):
    DEPARTMENT_CHOICES = [
        ('academic', 'Academic Affairs'),
        ('technical', 'Technical Support'),
        ('financial', 'Financial Services'),
        ('student', 'Student Services'),
        ('other', 'Other'),
    ]
    
    PRIORITY_CHOICES = [
        ('normal', 'Normal'),
        ('urgent', 'Urgent'),
        ('low', 'Low'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES, default='other')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.subject}"

class Meeting(models.Model):
    DEPARTMENT_CHOICES = [
        ('academic', 'Academic Affairs'),
        ('technical', 'Technical Support'),
        ('financial', 'Financial Services'),
        ('student', 'Student Services'),
        ('other', 'Other'),
    ]
    
    DURATION_CHOICES = [
        ('15', '15 minutes'),
        ('30', '30 minutes'),
        ('45', '45 minutes'),
        ('60', '1 hour'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    date = models.DateField()
    time = models.TimeField()
    duration = models.CharField(max_length=5, choices=DURATION_CHOICES, default='30')
    purpose = models.CharField(max_length=200)
    department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'time']
        verbose_name = 'Meeting'
        verbose_name_plural = 'Meetings'
    
    def __str__(self):
        return f"{self.name} - {self.date} {self.time} - {self.get_status_display()}"

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('reviewing', 'Reviewing'),
        ('interview', 'Interview Scheduled'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    preferred_position = models.CharField(max_length=100)
    resume = models.FileField(upload_to=resume_upload_path)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Job Application'
        verbose_name_plural = 'Job Applications'
    
    def __str__(self):
        return f"{self.name} - {self.preferred_position} - {self.get_status_display()}"
    
    def filename(self):
        return os.path.basename(self.resume.name)