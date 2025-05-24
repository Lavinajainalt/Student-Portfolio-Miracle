from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommunityMessageViewSet

router = DefaultRouter()
router.register(r'messages', CommunityMessageViewSet, basename='community-messages')

urlpatterns = [
    path('', include(router.urls)),
]
