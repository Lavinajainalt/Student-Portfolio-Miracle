from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import QuizPoints
from .serializers import QuizPointsSerializer

class QuizPointsView(APIView):
    def get(self, request):
        user = request.user
        guest_id = request.query_params.get('guest_id', None)
        
        if user.is_authenticated:
            # Get points for logged-in user
            points_obj, created = QuizPoints.objects.get_or_create(user=user)
        elif guest_id:
            # Get points for guest user
            points_obj, created = QuizPoints.objects.get_or_create(guest_id=guest_id)
        else:
            return Response({"error": "Authentication required"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = QuizPointsSerializer(points_obj)
        return Response(serializer.data)
    
    def post(self, request):
        user = request.user
        guest_id = request.data.get('guest_id', None)
        points = request.data.get('points', 0)
        
        if user.is_authenticated:
            # Update points for logged-in user
            points_obj, created = QuizPoints.objects.get_or_create(user=user)
        elif guest_id:
            # Update points for guest user
            points_obj, created = QuizPoints.objects.get_or_create(guest_id=guest_id)
        else:
            return Response({"error": "Authentication required"}, status=status.HTTP_400_BAD_REQUEST)
        
        points_obj.points = points
        points_obj.save()
        
        serializer = QuizPointsSerializer(points_obj)
        return Response(serializer.data)