from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'student_name', 'date_submitted')
    search_fields = ('title', 'student_name', 'description')
    list_filter = ('date_submitted',)