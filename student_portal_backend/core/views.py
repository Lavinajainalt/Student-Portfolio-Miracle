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
    Video, FeeStructure, FeeInstallment, Payment, Topic, Question
)
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
import time
from .serializers import (
    UserSerializer, SubjectSerializer, VideoSerializer, TopicSerializer, QuestionSerializer
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

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'student':
            return Subject.objects.filter(studentsubject__student=self.request.user)
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_test(request):
    """Submit test answers."""
    if request.user.role != 'student':
        return Response({'error': 'Only students can submit tests'}, status=status.HTTP_403_FORBIDDEN)
    
    answers = request.data.get('answers', {})
    if not answers:
        return Response({'error': 'No answers provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Process answers and calculate score
    score = 0
    total_questions = len(answers)
    
    for question_id, answer in answers.items():
        try:
            question = Question.objects.get(id=question_id)
            if question.correct_answer == answer:
                score += 1
        except Question.DoesNotExist:
            continue
    
    return Response({
        'score': score,
        'total_questions': total_questions,
        'percentage': (score / total_questions) * 100 if total_questions > 0 else 0
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

            # Calculate total paid amount
            total_paid = Payment.objects.filter(
                installment__in=installments,
                status='SUCCESS'
            ).aggregate(Sum('amount'))['amount__sum'] or 0

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

        except FeeStructure.DoesNotExist:
            return Response({"error": "Fee structure not found"}, status=status.HTTP_404_NOT_FOUND)

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
                    student=request.user,
                    status='PENDING'
                )
            except FeeInstallment.DoesNotExist:
                return Response({
                    "error": "Invalid or non-pending installment"
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


