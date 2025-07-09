from rest_framework import serializers
from .models import (
    CustomUser, Video, Subject, StudentSubject, Topic, Question,
    FeeStructure, FeeInstallment, Payment, TestResult
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')
        read_only_fields = ['id']
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class StudentSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentSubject
        fields = ['id', 'student', 'subject']
        read_only_fields = ['id']

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_url', 'subject', 'heading', 'completed']

# Test Serializers
class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'subject', 'name', 'description']

class QuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'explanation']

    def get_options(self, obj):
        return {
            'option_a': obj.option_a,
            'option_b': obj.option_b,
            'option_c': obj.option_c,
            'option_d': obj.option_d
        }

    def get_correct_answer(self, obj):
        # Map the correct_answer choice to the actual option value
        answer_map = {
            'option_a': obj.option_a,
            'option_b': obj.option_b,
            'option_c': obj.option_c,
            'option_d': obj.option_d
        }
        return answer_map.get(obj.correct_answer, '')

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'options', 'explanation', 'correct_answer']

# Fee Management Serializers
class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = ['id', 'course', 'total_amount', 'number_of_installments', 'created_at', 'updated_at']

class FeeInstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeInstallment
        fields = ['id', 'student', 'fee_structure', 'amount', 'due_date', 'installment_number', 'status']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'installment', 'amount', 'payment_date', 'payment_method', 'transaction_id', 'status']

class StudentFeeReportSerializer(serializers.ModelSerializer):
    total_paid = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_pending = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    course = serializers.CharField(source='studentsubject_set.first.subject.name', read_only=True)
    payments = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'course', 'total_paid', 'total_pending', 'payments']
    
    def get_payments(self, obj):
        payments = Payment.objects.filter(
            installment__student=obj,
            status='SUCCESS'
        ).order_by('-payment_date')
        
        return [{
            'amount': payment.amount,
            'date': payment.payment_date,
            'method': payment.payment_method,
            'transaction_id': payment.transaction_id,
            'installment_number': payment.installment.installment_number
        } for payment in payments]

class TestResultSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    topic_name = serializers.SerializerMethodField()
    subject_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TestResult
        fields = ['id', 'student', 'student_name', 'topic', 'topic_name', 'subject_name', 
                 'score', 'total_questions', 'percentage', 'date_taken']
    
    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"
    
    def get_topic_name(self, obj):
        return obj.topic.name
    
    def get_subject_name(self, obj):
        return obj.topic.subject.name

