# core/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import UserSerializer
from .models import StudentSubject, Video
from .serializers import VideoSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role')
    
    try:
        # Find user with matching username and role
        user = CustomUser.objects.get(username=username, role=role)
        
        # Check password
        if user.check_password(password):
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Add user data to response
            serializer = UserSerializer(user)
            user_data = serializer.data
            
            return Response({
                'user': user_data,
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'success': True,
                'message': f'Login successful as {role}'
            })
        else:
            return Response({
                'success': False,
                'message': 'Invalid password'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except CustomUser.DoesNotExist:
        return Response({
            'success': False,
            'message': f'No {role} account found with this username'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_course_videos(request):
    user = request.user
    print(f"Authenticated user: {user.username}, role: {user.role}")
    
    if user.role != 'student':
        return Response({"error": "Only students can access videos."}, status=403)

    subjects = StudentSubject.objects.filter(student=user).values_list('subject', flat=True)
    print("Student subjects:", list(subjects))

    videos = Video.objects.filter(subject__in=subjects)
    print("Videos found:", videos)

    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)
