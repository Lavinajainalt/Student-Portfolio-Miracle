from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.submit_contact, name='submit_contact'),
    path('meetings/book/', views.book_meeting, name='book_meeting'),
    path('careers/upload-resume/', views.upload_resume, name='upload_resume'),
]