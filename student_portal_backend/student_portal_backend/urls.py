from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/contact/', include('contact.urls')),
    path('api/', include('core.urls')),  # Add core URLs for authentication
    path('api/quiz/', include('quiz.urls')),  # Add quiz URLs
    path('api/community/', include('community.urls')),  # Add community URLs
    path('api/student/', include('projects.urls')),  # Add projects URLs
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)