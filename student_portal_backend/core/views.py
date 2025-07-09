# core/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from .models import (
    CustomUser, Subject, StudentSubject,
    Video, FeeStructure, FeeInstallment, Payment, Topic, Question, TestResult
)
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
import time
from .serializers import (
    UserSerializer, SubjectSerializer, VideoSerializer, TopicSerializer, QuestionSerializer,
    TestResultSerializer
)
import random
import time
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()
    
    def get_queryset(self):
        # Faculty can filter users by role
        if self.request.user.role == 'faculty':
            role = self.request.query_params.get('role')
            if role:
                return CustomUser.objects.filter(role=role)
        return super().get_queryset()

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Both faculty and students can access subjects
        # Students only see their assigned subjects
        if self.request.user.role == 'student':
            return Subject.objects.filter(studentsubject__student=self.request.user)
        # Faculty can see all subjects
        elif self.request.user.role == 'faculty':
            return Subject.objects.all()
        return super().get_queryset()


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'student':
            return Topic.objects.filter(subject__studentsubject__student=self.request.user)
        return super().get_queryset()


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'student':
            # Get the topic_id from the URL parameters
            topic_id = self.kwargs.get('topic_id')
            if topic_id:
                # Filter questions by both student's subjects and the specific topic
                return Question.objects.filter(
                    topic_id=topic_id,
                    topic__subject__studentsubject__student=self.request.user
                )
            # If no topic_id is provided, return questions from all topics the student has access to
            return Question.objects.filter(topic__subject__studentsubject__student=self.request.user)
        return super().get_queryset()


# Test-related functions
def get_subject_questions(request):
    """Get questions for a specific subject."""
    subject_id = request.query_params.get('subject_id')
    if not subject_id:
        return Response({'error': 'subject_id is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        questions = Question.objects.filter(topic__subject_id=subject_id)
        return Response(QuestionSerializer(questions, many=True).data)
    except Question.DoesNotExist:
        return Response({'error': 'Questions not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_test_results(request):
    """Get test results for faculty or student."""
    if request.user.role == 'faculty':
        # Faculty can see all results
        results = TestResult.objects.all().order_by('-date_taken')
        
        # Filter by student if provided
        student_id = request.query_params.get('student_id')
        if student_id:
            results = results.filter(student_id=student_id)
            
        # Filter by subject if provided
        subject_id = request.query_params.get('subject_id')
        if subject_id:
            results = results.filter(topic__subject_id=subject_id)
            
        # Filter by topic if provided
        topic_id = request.query_params.get('topic_id')
        if topic_id:
            results = results.filter(topic_id=topic_id)
            
    elif request.user.role == 'student':
        # Students can only see their own results
        results = TestResult.objects.filter(student=request.user).order_by('-date_taken')
    else:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = TestResultSerializer(results, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_test(request):
    """Submit test answers."""
    if request.user.role != 'student':
        return Response({'error': 'Only students can submit tests'}, status=status.HTTP_403_FORBIDDEN)
    
    answers = request.data.get('answers', [])
    if not answers:
        return Response({'error': 'No answers provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Process answers and calculate score
    score = 0
    total_questions = len(answers)
    
    # Get the topic ID from the first question
    if total_questions > 0:
        first_question_id = answers[0].get('question_id')
        try:
            question = Question.objects.get(id=first_question_id)
            topic_id = question.topic_id
        except Question.DoesNotExist:
            return Response({'error': 'Invalid question ID'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'No answers provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    for answer_data in answers:
        question_id = answer_data.get('question_id')
        selected_answer = answer_data.get('selected_answer')
        
        try:
            question = Question.objects.get(id=question_id)
            correct_option = question.correct_answer  # This is 'option_a', 'option_b', etc.
            
            # Get the actual text value of the correct option
            correct_value = getattr(question, correct_option)
            
            if selected_answer == correct_value:
                score += 1
        except Question.DoesNotExist:
            continue
    
    # Calculate percentage
    percentage = (score / total_questions) * 100 if total_questions > 0 else 0
    
    # Save the test result
    TestResult.objects.create(
        student=request.user,
        topic_id=topic_id,
        score=score,
        total_questions=total_questions,
        percentage=percentage
    )
    
    return Response({
        'correct_answers': score,
        'total_questions': total_questions,
        'percentage': percentage
    })


# Fee Management ViewSet
class FeeManagementViewSet(viewsets.GenericViewSet):
    """ViewSet for handling fee management operations."""

    @action(detail=False, methods=['get'])
    def get_student_fees(self, request):
        """Get student's fee details including total amount, paid amount, and pending installments."""
        if request.user.role != 'student':
            return Response({"error": "Not a student account"}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Get student's first subject to determine course
            student_subject = request.user.studentsubject_set.first()
            if not student_subject:
                return Response({"error": "No subjects assigned to student"}, status=status.HTTP_404_NOT_FOUND)

            course = student_subject.subject.name
            fee_structure = FeeStructure.objects.get(course=course)
            installments = FeeInstallment.objects.filter(
                student=request.user,
                fee_structure=fee_structure
            ).order_by('installment_number')

            # Calculate total paid amount based on actual payments, not just installment status
            total_paid = Payment.objects.filter(
                installment__in=installments,
                status='SUCCESS'
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            
            # Check for inconsistencies between Payment records and FeeInstallment status
            for installment in installments:
                payment_exists = Payment.objects.filter(
                    installment=installment,
                    status='SUCCESS'
                ).exists()
                
                # If there's no payment record but the installment is marked as PAID,
                # update the installment status to PENDING
                if not payment_exists and installment.status == 'PAID':
                    installment.status = 'PENDING'
                    installment.save()
                    print(f"Fixed inconsistency: Reset installment {installment.id} to PENDING")

            # Refresh the installments after potential status updates
            installments = FeeInstallment.objects.filter(
                student=request.user,
                fee_structure=fee_structure
            ).order_by('installment_number')
            
            # Get pending and overdue installments
            pending_installments = installments.filter(status='PENDING')
            overdue_installments = installments.filter(
                status='PENDING',
                due_date__lt=timezone.now().date()
            )

            return Response({
                'installments': [{
                    'id': inst.id,
                    'installment_number': inst.installment_number,
                    'amount': float(inst.amount),
                    'due_date': inst.due_date,
                    'status': inst.status,
                    'course': course
                } for inst in installments],
                'total_amount': float(fee_structure.total_amount),
                'total_paid': float(total_paid),
                'pending_installments': pending_installments.count(),
                'overdue_installments': [inst.id for inst in overdue_installments]
            })
        except FeeStructure.DoesNotExist:
            return Response({"error": "Fee structure not found for course"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def initiate_payment(self, request):
        """Process tuition fee payment."""
        if request.user.role != 'student':
            return Response({"error": "Not a student account"}, status=status.HTTP_403_FORBIDDEN)

        try:
            # Get payment details from request
            payment_method = request.data.get('payment_method')
            payment_details = request.data.get('payment_details', {})
            installment_id = payment_details.get('installment_id')

            # Get the specific installment
            try:
                installment = FeeInstallment.objects.get(
                    id=installment_id,
                    student=request.user
                )
                
                # Check if the installment is already paid
                if installment.status == 'PAID':
                    # Reset the status to PENDING since admin deleted the payment
                    installment.status = 'PENDING'
                    installment.save()
                    
                    # Log this action for debugging
                    print(f"Reset installment {installment_id} status to PENDING for user {request.user.username}")
                
            except FeeInstallment.DoesNotExist:
                return Response({
                    "error": "Invalid installment"
                }, status=status.HTTP_404_NOT_FOUND)

            # Generate transaction ID
            transaction_id = f"PAY-{timezone.now().strftime('%Y%m%d%H%M%S')}-{random.randint(1000, 9999)}"

            # Create payment record
            payment = Payment.objects.create(
                installment=installment,
                amount=installment.amount,
                payment_method=payment_method,
                transaction_id=transaction_id,
                status='SUCCESS'
            )

            # Update installment status
            installment.status = 'PAID'
            installment.save()

            return Response({
                "message": "Payment successful",
                "transaction_id": transaction_id,
                "amount": float(installment.amount),
                "installment_number": installment.installment_number
            })

        except Exception as e:
            return Response({
                "error": "Payment processing failed. Please try again.",
                "details": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def admin_dashboard(self, request):
        """Get fee management dashboard for admin."""
        if request.user.role != 'faculty':
            return Response({"error": "Not an admin account"}, status=status.HTTP_403_FORBIDDEN)

        # Get total fees collected
        total_collected = Payment.objects.filter(
            status='SUCCESS'
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        # Get pending payments
        pending_payments = FeeInstallment.objects.filter(
            status='PENDING',
            due_date__lte=timezone.now().date() + timedelta(days=7)
        ).count()

        # Get overdue payments
        overdue_payments = FeeInstallment.objects.filter(
            status='PENDING',
            due_date__lt=timezone.now().date()
        ).count()

        # Get payment trends
        today = timezone.now().date()
        last_month = today - timedelta(days=30)
        payments_last_month = Payment.objects.filter(
            payment_date__date__gte=last_month,
            payment_date__date__lte=today,
            status='SUCCESS'
        ).count()

        return Response({
            'total_collected': float(total_collected),
            'pending_payments': pending_payments,
            'overdue_payments': overdue_payments,
            'payments_last_month': payments_last_month,
            'total_students': CustomUser.objects.filter(role='student').count()
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')
    
    try:
        # Find user with matching username and role
        user = CustomUser.objects.get(username=username, role=role)
        
        # Check password
        if user.check_password(password):
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Add user data to response
            serializer = UserSerializer(user)
            user_data = serializer.data
            
            return Response({
                'user': user_data,
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'success': True,
                'message': f'Login successful as {role}'
            })
        else:
            return Response({
                'success': False,
                'message': 'Invalid password'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except CustomUser.DoesNotExist:
        return Response({
            'success': False,
            'message': f'No {role} account found with this username'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_course_videos(request):
    user = request.user
    print(f"Authenticated user: {user.username}, role: {user.role}")
    
    if user.role != 'student':
        return Response({"error": "Only students can access videos."}, status=403)

    subjects = StudentSubject.objects.filter(student=user).values_list('subject', flat=True)
    print("Student subjects:", list(subjects))

    videos = Video.objects.filter(subject__in=subjects)
    print("Videos found:", videos)

    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_student(request):
    if request.user.role != 'student':
        return Response({"error": "Not a student account"}, status=403)
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_course(request):
    if request.user.role != 'student':
        return Response({"error": "Not a student account"}, status=403)
    
    try:
        student_subject = StudentSubject.objects.get(student=request.user)
        return Response({
            'subject': student_subject.subject.name,
            'description': student_subject.subject.description
        })
    except StudentSubject.DoesNotExist:
        return Response({"error": "No course found"}, status=404)


