# Script to delete all users and create new ones with course information
import os
import django
from django.contrib.auth.hashers import make_password

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_portal_backend.settings')
django.setup()

# Import the models
from core.models import CustomUser, Subject, StudentSubject

# Delete all existing users
print("Deleting all existing users...")
CustomUser.objects.all().delete()
print("All users deleted.")

# Ensure subjects exist
subjects = {
    'PGDFE': 'Post Graduate Diploma in Frontend Engineering',
    'DATA_SCIENCE': 'Data Science',
    'CYBER_SECURITY': 'Cyber Security'
}

# Create or get subjects
subject_objects = {}
for code, name in subjects.items():
    subject, created = Subject.objects.get_or_create(name=code, defaults={'description': name})
    subject_objects[code] = subject
    if created:
        print(f"Created subject: {name}")
    else:
        print(f"Using existing subject: {name}")

# Create students with different courses
students = [
    {
        'username': 'data_student',
        'password': 'student123',
        'email': 'data_student@example.com',
        'role': 'student',
        'course': 'DATA_SCIENCE'
    },
    {
        'username': 'pgdfe_student',
        'password': 'student123',
        'email': 'pgdfe_student@example.com',
        'role': 'student',
        'course': 'PGDFE'
    },
    {
        'username': 'cyber_student',
        'password': 'student123',
        'email': 'cyber_student@example.com',
        'role': 'student',
        'course': 'CYBER_SECURITY'
    }
]

# Create faculty members
faculty = [
    {
        'username': 'data_faculty',
        'password': 'faculty123',
        'email': 'data_faculty@example.com',
        'role': 'faculty'
    },
    {
        'username': 'pgdfe_faculty',
        'password': 'faculty123',
        'email': 'pgdfe_faculty@example.com',
        'role': 'faculty'
    },
    {
        'username': 'cyber_faculty',
        'password': 'faculty123',
        'email': 'cyber_faculty@example.com',
        'role': 'faculty'
    }
]

# Create student users and assign courses
print("\nCreating student users...")
for student_data in students:
    user = CustomUser.objects.create(
        username=student_data['username'],
        password=make_password(student_data['password']),
        email=student_data['email'],
        role=student_data['role'],
        is_active=True
    )
    
    # Assign course to student
    course_code = student_data['course']
    if course_code in subject_objects:
        StudentSubject.objects.create(
            student=user,
            subject=subject_objects[course_code]
        )
        print(f"Created student: {student_data['username']} with course: {subjects[course_code]}")
    else:
        print(f"Created student: {student_data['username']} (course not assigned - {course_code} not found)")

# Create faculty users
print("\nCreating faculty users...")
for faculty_data in faculty:
    user = CustomUser.objects.create(
        username=faculty_data['username'],
        password=make_password(faculty_data['password']),
        email=faculty_data['email'],
        role=faculty_data['role'],
        is_active=True
    )
    print(f"Created faculty: {faculty_data['username']}")

print("\nUser creation complete. You can now log in with these credentials:")
print("\nStudents:")
for student in students:
    print(f"Username: {student['username']}, Password: {student['password']}, Course: {subjects[student['course']]}")

print("\nFaculty:")
for f in faculty:
    print(f"Username: {f['username']}, Password: {f['password']}")