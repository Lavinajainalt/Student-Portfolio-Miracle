from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'student_id', 'student_name', 'title', 'description', 'project_link', 'date_submitted']
        read_only_fields = ['id', 'date_submitted']