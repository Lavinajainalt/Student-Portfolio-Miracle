# Script to delete all users and create new ones with Indian names and course information
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

# Create students with Indian names and different courses
students = [
    {
        'username': 'rahul',
        'password': 'student123',
        'email': 'rahul@example.com',
        'role': 'student',
        'course': 'DATA_SCIENCE',
        'first_name': 'Rahul',
        'last_name': 'Sharma'
    },
    {
        'username': 'priya',
        'password': 'student123',
        'email': 'priya@example.com',
        'role': 'student',
        'course': 'PGDFE',
        'first_name': 'Priya',
        'last_name': 'Patel'
    },
    {
        'username': 'amit',
        'password': 'student123',
        'email': 'amit@example.com',
        'role': 'student',
        'course': 'CYBER_SECURITY',
        'first_name': 'Amit',
        'last_name': 'Singh'
    },
    {
        'username': 'neha',
        'password': 'student123',
        'email': 'neha@example.com',
        'role': 'student',
        'course': 'DATA_SCIENCE',
        'first_name': 'Neha',
        'last_name': 'Gupta'
    },
    {
        'username': 'vikram',
        'password': 'student123',
        'email': 'vikram@example.com',
        'role': 'student',
        'course': 'PGDFE',
        'first_name': 'Vikram',
        'last_name': 'Reddy'
    }
]

# Create faculty members with Indian names
faculty = [
    {
        'username': 'anand',
        'password': 'faculty123',
        'email': 'anand@example.com',
        'role': 'faculty',
        'first_name': 'Anand',
        'last_name': 'Kumar',
        'subject': 'DATA_SCIENCE'
    },
    {
        'username': 'deepa',
        'password': 'faculty123',
        'email': 'deepa@example.com',
        'role': 'faculty',
        'first_name': 'Deepa',
        'last_name': 'Verma',
        'subject': 'PGDFE'
    },
    {
        'username': 'rajesh',
        'password': 'faculty123',
        'email': 'rajesh@example.com',
        'role': 'faculty',
        'first_name': 'Rajesh',
        'last_name': 'Iyer',
        'subject': 'CYBER_SECURITY'
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
        first_name=student_data['first_name'],
        last_name=student_data['last_name'],
        is_active=True
    )
    
    # Assign course to student
    course_code = student_data['course']
    if course_code in subject_objects:
        StudentSubject.objects.create(
            student=user,
            subject=subject_objects[course_code]
        )
        print(f"Created student: {student_data['first_name']} {student_data['last_name']} ({student_data['username']}) with course: {subjects[course_code]}")
    else:
        print(f"Created student: {student_data['first_name']} {student_data['last_name']} ({student_data['username']}) (course not assigned - {course_code} not found)")

# Create faculty users
print("\nCreating faculty users...")
for faculty_data in faculty:
    user = CustomUser.objects.create(
        username=faculty_data['username'],
        password=make_password(faculty_data['password']),
        email=faculty_data['email'],
        role=faculty_data['role'],
        first_name=faculty_data['first_name'],
        last_name=faculty_data['last_name'],
        is_active=True
    )
    print(f"Created faculty: {faculty_data['first_name']} {faculty_data['last_name']} ({faculty_data['username']}) for {subjects[faculty_data['subject']]}")

print("\nUser creation complete. You can now log in with these credentials:")
print("\nStudents:")
for student in students:
    print(f"Name: {student['first_name']} {student['last_name']}")
    print(f"Username: {student['username']}")
    print(f"Password: {student['password']}")
    print(f"Course: {subjects[student['course']]}")
    print()

print("\nFaculty:")
for f in faculty:
    print(f"Name: {f['first_name']} {f['last_name']}")
    print(f"Username: {f['username']}")
    print(f"Password: {f['password']}")
    print(f"Subject: {subjects[f['subject']]}")
    print()