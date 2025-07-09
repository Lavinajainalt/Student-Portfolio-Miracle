from django.contrib import admin
from .models import QuizPoints

@admin.register(QuizPoints)
class QuizPointsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'guest_id', 'points')
    search_fields = ('user__username', 'guest_id')
    list_filter = ('points',)