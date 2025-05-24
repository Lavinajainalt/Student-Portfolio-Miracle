from django.urls import path
from .views import get_questions, submit_score


urlpatterns = [
    path('<str:subject>/', get_questions, name='get_questions'),
    path('submit-score/', submit_score, name='submit_score'),
]

