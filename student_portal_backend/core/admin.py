from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import (
    CustomUser, Subject, StudentSubject, Video,
    FeeStructure, FeeInstallment, Payment,
    Topic, Question
)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role',)}),
    )

class TopicAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'description']
    list_filter = ['subject']
    search_fields = ['name', 'description']
    ordering = ['subject', 'name']

class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'topic']
    list_filter = ['topic__subject', 'topic']
    search_fields = ['question_text', 'explanation']
    ordering = ['topic__subject', 'topic']
    
    fieldsets = (
        ('Question Details', {
            'fields': ('topic', 'question_text', 'explanation')
        }),
        ('Options', {
            'fields': ('option_a', 'option_b', 'option_c', 'option_d')
        }),
        ('Answer', {
            'fields': ('correct_answer',)
        }),
    )

class FeeStructureAdmin(admin.ModelAdmin):
    list_display = ['course', 'total_amount', 'number_of_installments', 'created_at']
    list_filter = ['course']
    search_fields = ['course']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request)

class FeeInstallmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'fee_structure', 'amount', 'due_date', 'installment_number', 'status']
    list_filter = ['status', 'fee_structure__course']
    search_fields = ['student__username', 'student__email', 'fee_structure__course']
    date_hierarchy = 'due_date'
    
    actions = ['mark_as_paid', 'mark_as_pending']
    
    def mark_as_paid(self, request, queryset):
        updated = queryset.update(status='PAID')
        self.message_user(request, f'Successfully marked {updated} installments as paid.')
    mark_as_paid.short_description = 'Mark selected installments as paid'
    
    def mark_as_pending(self, request, queryset):
        updated = queryset.update(status='PENDING')
        self.message_user(request, f'Successfully marked {updated} installments as pending.')
    mark_as_pending.short_description = 'Mark selected installments as pending'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('student', 'fee_structure')

class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'student_name', 'amount', 'payment_date', 'payment_method', 'status', 'display_payment_details']
    
    def display_payment_details(self, obj):
        if not obj.payment_details:
            return '-'
        details = obj.payment_details.copy()
        
        # Mask sensitive information
        if 'pin' in details:
            details['pin'] = 'XXXXXX'
        if 'cardNumber' in details:
            details['cardNumber'] = 'XXXX-XXXX-XXXX-' + details['cardNumber'][-4:]
        
        # Format the details nicely
        formatted_details = []
        for key, value in details.items():
            formatted_details.append(f"<strong>{key.replace('_', ' ').title()}</strong>: {value}")
        
        return format_html('<div style="white-space: pre-wrap;">{}</div>', '<br>'.join(formatted_details))
    display_payment_details.short_description = 'Payment Details'
    display_payment_details.allow_tags = True
    list_filter = ['status', 'payment_method', 'payment_date', 'payment_details']
    search_fields = ['transaction_id', 'installment__student__username', 'installment__student__email', 'payment_details__cardNumber']
    date_hierarchy = 'payment_date'
    readonly_fields = ['transaction_id', 'display_payment_details', 'student_details']
    
    actions = ['mark_as_successful', 'mark_as_failed']
    
    def student_name(self, obj):
        return f"{obj.installment.student.first_name} {obj.installment.student.last_name}"
    student_name.short_description = 'Student Name'
    student_name.admin_order_field = 'installment__student__first_name'
    
    def display_payment_details(self, obj):
        if not obj.payment_details:
            return '-'
        details = obj.payment_details.copy()
        # Mask sensitive information
        if 'pin' in details:
            details['pin'] = 'XXXXXX'
        if 'cardNumber' in details:
            details['cardNumber'] = 'XXXX-XXXX-XXXX-' + details['cardNumber'][-4:]
        
        # Format the details nicely
        formatted_details = []
        for key, value in details.items():
            formatted_details.append(f"<strong>{key.replace('_', ' ').title()}</strong>: {value}")
        
        return format_html('<div style="white-space: pre-wrap;">{}</div>', '<br>'.join(formatted_details))
    display_payment_details.short_description = 'Payment Details'
    display_payment_details.allow_tags = True
    
    def student_details(self, obj):
        student = obj.installment.student
        return format_html(
            '<div style="white-space: pre-wrap;">'
            '<strong>Username:</strong> {}<br>'
            '<strong>Email:</strong> {}<br>'
            '<strong>Role:</strong> {}<br>'
            '</div>',
            student.username,
            student.email,
            student.get_role_display()
        )
    student_details.short_description = 'Student Information'
    student_details.allow_tags = True
    
    def mark_as_successful(self, request, queryset):
        updated = queryset.update(status='SUCCESS')
        self.message_user(request, f'Successfully marked {updated} payments as successful.')
    mark_as_successful.short_description = 'Mark selected payments as successful'
    
    def mark_as_failed(self, request, queryset):
        updated = queryset.update(status='FAILED')
        self.message_user(request, f'Successfully marked {updated} payments as failed.')
    mark_as_failed.short_description = 'Mark selected payments as failed'
    
    def get_queryset(self, request):
        # Get the base queryset with related fields
        qs = super().get_queryset(request).select_related(
            'installment',
            'installment__student'
        ).prefetch_related(
            'installment__fee_structure'
        )
        
        # If not a superuser, only show payments for the current user's students
        if not request.user.is_superuser:
            qs = qs.filter(installment__student__in=request.user.students.all())
            
        # Order by most recent payments first
        return qs.order_by('-payment_date')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Subject)
admin.site.register(StudentSubject)
admin.site.register(Video)
admin.site.register(FeeStructure, FeeStructureAdmin)
admin.site.register(FeeInstallment, FeeInstallmentAdmin)
admin.site.register(Payment, PaymentAdmin)
admin.site.register(Topic, TopicAdmin)
admin.site.register(Question, QuestionAdmin)


