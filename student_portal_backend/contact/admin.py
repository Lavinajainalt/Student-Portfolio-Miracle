from django.contrib import admin
from django.utils.html import format_html
from .models import Contact, Meeting, JobApplication

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'department', 'priority', 'created_at','message')
    list_filter = ('department', 'priority', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    date_hierarchy = 'created_at'

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'date', 'time', 'duration', 'department', 'status')
    list_filter = ('department', 'status', 'date')
    search_fields = ('name', 'email', 'purpose')
    date_hierarchy = 'date'

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'preferred_position', 'status', 'created_at', 'resume_link')
    list_filter = ('status', 'preferred_position', 'created_at')
    search_fields = ('name', 'email', 'phone', 'preferred_position')
    date_hierarchy = 'created_at'
    readonly_fields = ('filename', 'resume_preview')
    
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