# Script to check existing users in the database
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_portal_backend.settings')
django.setup()

# Import the CustomUser model
from core.models import CustomUser

# Get all users and print their username and role
users = CustomUser.objects.all().values('username', 'email', 'role')
print("Existing users in the database:")
for user in users:
    print(f"Username: {user['username']}, Role: {user['role']}, Email: {user['email']}")

# Check if there are any student users
student_users = CustomUser.objects.filter(role='student').values('username')
print("\nStudent users:")
if student_users:
    for user in student_users:
        print(f"- {user['username']}")
else:
    print("No student users found in the database.")

# Check if there are any faculty users
faculty_users = CustomUser.objects.filter(role='faculty').values('username')
print("\nFaculty users:")
if faculty_users:
    for user in faculty_users:
        print(f"- {user['username']}")
else:
    print("No faculty users found in the database.")