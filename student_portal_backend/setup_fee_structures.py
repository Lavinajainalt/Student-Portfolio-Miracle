import os
import django
from datetime import date, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_portal_backend.settings')
django.setup()

from core.models import CustomUser, FeeStructure, FeeInstallment

def setup_fee_structures():
    # Delete existing fee structures
    FeeStructure.objects.all().delete()
    FeeInstallment.objects.all().delete()

    # Create fee structures for each course
    fee_structures = {
        'PGDFE': {
            'amount': 120000,
            'installments': 4
        },
        'DATA_SCIENCE': {
            'amount': 150000,
            'installments': 4
        },
        'CYBER_SECURITY': {
            'amount': 135000,
            'installments': 4
        }
    }

    created_structures = {}
    for course, details in fee_structures.items():
        structure = FeeStructure.objects.create(
            course=course,
            total_amount=details['amount'],
            number_of_installments=details['installments']
        )
        created_structures[course] = structure
        print(f"Created fee structure for {course}")

    # Create installments for each student
    students = CustomUser.objects.filter(role='student')
    
    for student in students:
        # Get the student's course from their first subject
        student_subject = student.studentsubject_set.first()
        if not student_subject:
            continue
            
        course = student_subject.subject.name
        if course not in created_structures:
            continue
            
        structure = created_structures[course]
        installment_amount = structure.total_amount / structure.number_of_installments
        
        # Create installments with due dates 3 months apart
        for i in range(structure.number_of_installments):
            due_date = date.today() + timedelta(days=90 * (i + 1))
            
            FeeInstallment.objects.create(
                student=student,
                fee_structure=structure,
                amount=installment_amount,
                due_date=due_date,
                installment_number=i + 1,
                status='PENDING'
            )
        
        print(f"Created installments for student: {student.username}")

if __name__ == '__main__':
    print("Setting up fee structures and installments...")
    setup_fee_structures()
    print("Setup complete!") 