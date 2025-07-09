import os
import django
from datetime import date, timedelta
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_portal_backend.settings')
django.setup()

from core.models import CustomUser, FeeStructure, FeeInstallment, Payment
from django.utils import timezone

def setup_fee_structures():
    """
    Set up fee structures and installments for all courses and students.
    Also creates sample payment records for demonstration purposes.
    """
    # Delete existing fee structures and related data
    Payment.objects.all().delete()
    FeeInstallment.objects.all().delete()
    FeeStructure.objects.all().delete()

    # Create fee structures for each course with improved details
    fee_structures = {
        'PGDFE': {
            'amount': 120000,
            'installments': 4,
            'description': 'Post Graduate Diploma in Frontend Engineering'
        },
        'DATA_SCIENCE': {
            'amount': 150000,
            'installments': 4,
            'description': 'Data Science Professional Program'
        },
        'CYBER_SECURITY': {
            'amount': 135000,
            'installments': 4,
            'description': 'Cyber Security Specialist Program'
        }
    }

    created_structures = {}
    print("\n=== Creating Fee Structures ===")
    for course, details in fee_structures.items():
        structure = FeeStructure.objects.create(
            course=course,
            total_amount=details['amount'],
            number_of_installments=details['installments']
        )
        created_structures[course] = structure
        print(f"✓ Created fee structure for {course}: ₹{details['amount']} ({details['description']})")

    # Create installments for each student
    students = CustomUser.objects.filter(role='student')
    
    print("\n=== Creating Student Installments ===")
    for student in students:
        # Get the student's course from their first subject
        student_subject = student.studentsubject_set.first()
        if not student_subject:
            print(f"⚠ Skipping {student.username}: No subject assigned")
            continue
            
        course = student_subject.subject.name
        if course not in created_structures:
            print(f"⚠ Skipping {student.username}: Course {course} not found in fee structures")
            continue
            
        structure = created_structures[course]
        installment_amount = structure.total_amount / structure.number_of_installments
        
        # Create installments with due dates 3 months apart
        installments = []
        for i in range(structure.number_of_installments):
            due_date = date.today() + timedelta(days=90 * (i + 1))
            
            installment = FeeInstallment.objects.create(
                student=student,
                fee_structure=structure,
                amount=installment_amount,
                due_date=due_date,
                installment_number=i + 1,
                status='PENDING'
            )
            installments.append(installment)
        
        print(f"✓ Created {structure.number_of_installments} installments for {student.username} ({course})")
        
        # Create sample payments for demonstration (for the first installment)
        if installments:
            # Randomly decide if this student has made a payment
            if random.choice([True, False]):
                payment_methods = ['CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'UPI']
                transaction_id = f"DEMO-{timezone.now().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
                
                # Create payment for first installment
                first_installment = installments[0]
                payment = Payment.objects.create(
                    installment=first_installment,
                    amount=first_installment.amount,
                    payment_method=random.choice(payment_methods),
                    transaction_id=transaction_id,
                    status='SUCCESS',
                    payment_details={
                        'card_last4': f"{random.randint(1000, 9999)}",
                        'payment_gateway': 'Demo Gateway'
                    }
                )
                
                # Update installment status
                first_installment.status = 'PAID'
                first_installment.save()
                
                print(f"  → Created sample payment of ₹{payment.amount} for {student.username}")

def generate_fee_report():
    """Generate a summary report of fee status"""
    print("\n=== Fee Collection Summary ===")
    
    # Get total fees to be collected
    total_fees = FeeStructure.objects.aggregate(total=django.db.models.Sum('total_amount'))['total'] or 0
    
    # Get total fees collected
    collected_fees = Payment.objects.filter(status='SUCCESS').aggregate(
        total=django.db.models.Sum('amount'))['total'] or 0
    
    # Get pending installments
    pending_installments = FeeInstallment.objects.filter(status='PENDING').count()
    paid_installments = FeeInstallment.objects.filter(status='PAID').count()
    
    # Get student count
    student_count = CustomUser.objects.filter(role='student').count()
    
    print(f"Total Students: {student_count}")
    print(f"Total Fees (all students): ₹{total_fees}")
    print(f"Total Collected: ₹{collected_fees} ({(collected_fees/total_fees*100):.2f}%)")
    print(f"Installments - Paid: {paid_installments}, Pending: {pending_installments}")
    
    # Course-wise breakdown
    print("\n=== Course-wise Fee Collection ===")
    for structure in FeeStructure.objects.all():
        course_students = CustomUser.objects.filter(
            studentsubject__subject__name=structure.course, 
            role='student'
        ).count()
        
        course_installments = FeeInstallment.objects.filter(
            fee_structure=structure
        )
        
        course_paid = Payment.objects.filter(
            installment__fee_structure=structure,
            status='SUCCESS'
        ).aggregate(total=django.db.models.Sum('amount'))['total'] or 0
        
        print(f"{structure.course} ({course_students} students)")
        print(f"  Total Expected: ₹{structure.total_amount * course_students}")
        print(f"  Total Collected: ₹{course_paid}")
        print(f"  Paid Installments: {course_installments.filter(status='PAID').count()}")
        print(f"  Pending Installments: {course_installments.filter(status='PENDING').count()}")
        print()

if __name__ == '__main__':
    print("=== Fee Management System Setup ===")
    setup_fee_structures()
    generate_fee_report()
    print("\n=== Setup Complete! ===")