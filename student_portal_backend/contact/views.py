from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Contact, Meeting, JobApplication
from .serializers import ContactSerializer, MeetingSerializer, JobApplicationSerializer

@api_view(['POST'])
def submit_contact(request):
    serializer = ContactSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Your message has been sent successfully. We will get back to you soon.'
        }, status=status.HTTP_201_CREATED)
    return Response({
        'message': 'There was an error with your submission. Please check your information and try again.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def book_meeting(request):
    serializer = MeetingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Your meeting has been scheduled successfully. You will receive a confirmation email shortly.'
        }, status=status.HTTP_201_CREATED)
    return Response({
        'message': 'There was an error scheduling your meeting. Please check your information and try again.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    """
    API endpoint for uploading resumes and job applications
    """
    # Create a serializer with the request data
    serializer = JobApplicationSerializer(data=request.data)
    
    # Check if the data is valid
    if serializer.is_valid():
        # Save the job application
        serializer.save()
        
        return Response({
            'message': 'Your resume has been uploaded successfully. We will review your application and contact you soon.'
        }, status=status.HTTP_201_CREATED)
    
    # Return error response if data is invalid
    return Response({
        'message': 'There was an error with your submission. Please check your information and try again.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)