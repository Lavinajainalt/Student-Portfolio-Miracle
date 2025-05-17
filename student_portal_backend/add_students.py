from core.models import CustomUser, Subject, StudentSubject
from django.utils.crypto import get_random_string

# List of sample student data
students_data = [
    {
        'username': 'student1',
        'email': 'student1@example.com',
        'first_name': 'John',
        'last_name': 'Doe',
        'password': 'password123',
    },
    {
        'username': 'student2',
        'email': 'student2@example.com',
        'first_name': 'Jane',
        'last_name': 'Smith',
        'password': 'password123',
    },
    {
        'username': 'student3',
        'email': 'student3@example.com',
        'first_name': 'Michael',
        'last_name': 'Johnson',
        'password': 'password123',
    },
    {
        'username': 'student4',
        'email': 'student4@example.com',
        'first_name': 'Emily',
        'last_name': 'Williams',
        'password': 'password123',
    },
    {
        'username': 'student5',
        'email': 'student5@example.com',
        'first_name': 'David',
        'last_name': 'Brown',
        'password': 'password123',
    },
]

# Create subjects if they don't exist
subjects = []
for subject_choice in Subject.SUBJECT_CHOICES:
    subject, created = Subject.objects.get_or_create(name=subject_choice[0])
    if created:
        print(f"Created subject: {subject.get_name_display()}")
    subjects.append(subject)

# Create students
created_count = 0
for student_data in students_data:
    # Check if user already exists
    if not CustomUser.objects.filter(username=student_data['username']).exists():
        # Create the user
        user = CustomUser.objects.create_user(
            username=student_data['username'],
            email=student_data['email'],
            first_name=student_data['first_name'],
            last_name=student_data['last_name'],
            password=student_data['password'],
            role='student'
        )
        
        # Assign a random subject to each student
        import random
        subject = random.choice(subjects)
        StudentSubject.objects.create(student=user, subject=subject)
        
        print(f"Created student: {user.username} with subject: {subject.get_name_display()}")
        created_count += 1
    else:
        print(f"Student {student_data['username']} already exists, skipping.")

print(f"\nCreated {created_count} new students.")