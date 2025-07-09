from rest_framework import serializers
from .models import QuizPoints

class QuizPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizPoints
        fields = ['id', 'user', 'guest_id', 'points']