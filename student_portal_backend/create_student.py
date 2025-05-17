# Script to create a student user
import os
import django
from django.contrib.auth.hashers import make_password

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_portal_backend.settings')
django.setup()

# Import the CustomUser model
from core.models import CustomUser

# Create a student user
username = 'student'
password = 'student123'  # Simple password for testing
email = 'student@example.com'
role = 'student'

# Check if user already exists
if CustomUser.objects.filter(username=username).exists():
    print(f"User '{username}' already exists.")
else:
    # Create the user
    user = CustomUser.objects.create(
        username=username,
        password=make_password(password),  # Hash the password
        email=email,
        role=role,
        is_active=True
    )
    print(f"Student user created successfully:")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Role: {role}")
    print("\nYou can now log in with these credentials.")