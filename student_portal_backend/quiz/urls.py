from django.urls import path
from .views import QuizPointsView

urlpatterns = [
    path('points/', QuizPointsView.as_view(), name='quiz_points'),
]