from django.contrib import admin
from django.utils.html import format_html
from .models import Contact, Meeting, JobApplication

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'department', 'priority', 'created_at')
    list_filter = ('department', 'priority', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'date', 'time', 'department', 'status')
    list_filter = ('department', 'status', 'date')
    search_fields = ('name', 'email', 'purpose')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-date', '-time')

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'preferred_position', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email', 'preferred_position')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def filename(self, obj):
        return obj.filename()
    filename.short_description = 'Resume Filename'
    
    def resume_link(self, obj):
        if obj.resume:
            return format_html('<a href="{}" target="_blank">View Resume</a>', obj.resume.url)
        return "No resume uploaded"
    resume_link.short_description = 'Resume'
    
    def resume_preview(self, obj):
        if obj.resume:
            file_extension = obj.resume.name.split('.')[-1].lower()
            if file_extension in ['pdf', 'doc', 'docx']:
                return format_html('<a href="{}" target="_blank">View Resume</a><br><br>Filename: {}', 
                                  obj.resume.url, obj.filename())
            elif file_extension in ['jpg', 'jpeg', 'png', 'gif']:
                return format_html('<a href="{}" target="_blank"><img src="{}" width="300" /></a><br>Filename: {}', 
                                  obj.resume.url, obj.resume.url, obj.filename())
            else:
                return format_html('<a href="{}" target="_blank">Download File</a><br><br>Filename: {}', 
                                  obj.resume.url, obj.filename())
        return "No resume uploaded"
    resume_preview.short_description = 'Resume Preview'