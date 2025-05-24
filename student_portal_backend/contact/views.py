from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
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

@api_view(['POST', 'OPTIONS'])
@parser_classes([MultiPartParser, FormParser])
@csrf_exempt
def upload_resume(request):
    """
    API endpoint for uploading resumes and job applications
    Public endpoint - no authentication required
    """
    # Handle OPTIONS request for CORS
    if request.method == 'OPTIONS':
        response = Response()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Accept"
        return response

    try:
        print("Received data:", request.data)  # Debug print
        
        # Create a serializer with the request data
        serializer = JobApplicationSerializer(data=request.data)
        
        # Check if the data is valid
        if serializer.is_valid():
            # Save the job application
            application = serializer.save()
            
            response = Response({
                'message': 'Your resume has been uploaded successfully. We will review your application and contact you soon.',
                'application_id': application.id
            }, status=status.HTTP_201_CREATED)
            
            # Add CORS headers
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Content-Type, Accept"
            
            return response
        
        # Print validation errors for debugging
        print("Validation errors:", serializer.errors)
        
        # Return validation error response
        error_response = Response({
            'message': 'There was an error with your submission. Please check the form and try again.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
        # Add CORS headers to error response
        error_response["Access-Control-Allow-Origin"] = "*"
        error_response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        error_response["Access-Control-Allow-Headers"] = "Content-Type, Accept"
        
        return error_response
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error in upload_resume: {str(e)}")
        error_response = Response({
            'message': 'An unexpected error occurred while processing your application.',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Add CORS headers to error response
        error_response["Access-Control-Allow-Origin"] = "*"
        error_response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        error_response["Access-Control-Allow-Headers"] = "Content-Type, Accept"
        
        return error_response