from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    def create(self, request):
        participant_ids = request.data.get('participants', [])
        if not participant_ids:
            return Response(
                {'error': 'Please provide participants'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add the current user to participants if not included
        if request.user.id not in participant_ids:
            participant_ids.append(request.user.id)

        # Check if conversation already exists with these participants
        participants = User.objects.filter(id__in=participant_ids)
        existing_conversation = Conversation.objects.filter(participants=request.user)
        for participant in participants:
            existing_conversation = existing_conversation.filter(participants=participant)

        if existing_conversation.exists():
            serializer = self.get_serializer(existing_conversation.first())
            return Response(serializer.data)

        conversation = Conversation.objects.create()
        conversation.participants.set(participants)
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs.get('conversation_pk')
        return Message.objects.filter(conversation_id=conversation_id)

    def perform_create(self, serializer):
        conversation_id = self.kwargs.get('conversation_pk')
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Verify user is a participant
        if not conversation.participants.filter(id=self.request.user.id).exists():
            raise permissions.PermissionDenied("You are not a participant in this conversation")
        
        serializer.save(
            sender=self.request.user,
            conversation_id=conversation_id
        )
        
        # Update conversation timestamp
        conversation.save()  # This will update the updated_at field

class CommunityMessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-timestamp')
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return Message.objects.all().order_by('-timestamp')

    def create(self, request, *args, **kwargs):
        try:
            serializer = MessageSerializer(data={
                'content': request.data.get('content', '')
            })
            if serializer.is_valid():
                serializer.save(sender=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        messages = self.get_queryset()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)