import requests
import json

# API endpoint
BASE_URL = 'http://localhost:8000/api'

def test_project_submission():
    """Test submitting a project to the API"""
    
    # Get a token first (you'll need to adjust this with valid credentials)
    login_data = {
        'username': 'student1',  # Replace with a valid username
        'password': 'password123'  # Replace with a valid password
    }
    
    # Login to get token
    try:
        login_response = requests.post(f'{BASE_URL}/token/', data=login_data)
        login_response.raise_for_status()
        token = login_response.json().get('access')
        print(f"Successfully logged in and got token")
    except Exception as e:
        print(f"Login failed: {e}")
        return
    
    # Project data
    project_data = {
        'title': 'Test Project',
        'description': 'This is a test project submission',
        'project_link': 'https://github.com/student/test-project',
        'student_id': '12345',
        'student_name': 'Test Student'
    }
    
    # Headers with token
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Submit project
    try:
        response = requests.post(
            f'{BASE_URL}/student/projects/', 
            data=json.dumps(project_data),
            headers=headers
        )
        response.raise_for_status()
        print(f"Project submitted successfully: {response.json()}")
    except Exception as e:
        print(f"Project submission failed: {e}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    test_project_submission()