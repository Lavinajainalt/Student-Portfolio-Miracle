from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'subjects', views.SubjectViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.login_view, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/videos/', views.user_course_videos, name='user_course_videos'),
    
    # Student-specific endpoints
    path('student/current/', views.current_student, name='current_student'),
    path('student/course/', views.student_course, name='student_course'),
  
    # Fee Management URLs
    path('fees/student-fees/', views.FeeManagementViewSet.as_view({'get': 'get_student_fees'}), name='student-fees'),
    path('fees/initiate-payment/', views.FeeManagementViewSet.as_view({'post': 'initiate_payment'}), name='initiate-payment'),
    path('fees/admin-dashboard/', views.FeeManagementViewSet.as_view({'get': 'admin_dashboard'}), name='fee-admin-dashboard'),
    
    # Test URLs
    path('courses/topics/', views.TopicViewSet.as_view({'get': 'list'}), name='topics-list'),
    path('courses/questions/<int:topic_id>/', views.QuestionViewSet.as_view({'get': 'list'}), name='questions-list'),
    path('courses/submit-test/', views.submit_test, name='submit-test'),
    path('courses/get-questions/', views.get_subject_questions, name='get-questions'),
    path('courses/test-results/', views.get_test_results, name='test-results'),
]
