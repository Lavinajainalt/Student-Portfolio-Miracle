# Student Project Submission API

This module allows students to submit their projects and faculty to view them.

## API Endpoints

### Submit a Project
- **URL**: `/api/student/projects/`
- **Method**: `POST`
- **Auth Required**: Yes (JWT Token)
- **Request Body**:
  ```json
  {
    "title": "Project Title",
    "description": "Project Description",
    "project_link": "https://github.com/username/project",
    "student_id": "12345",
    "student_name": "Student Name"
  }
  ```
- **Success Response**: 
  - **Code**: 201 CREATED
  - **Content**: Project object with ID and submission date

### Get All Projects
- **URL**: `/api/student/projects/`
- **Method**: `GET`
- **Auth Required**: Yes (JWT Token)
- **Success Response**: 
  - **Code**: 200 OK
  - **Content**: Array of project objects

## How to Use

1. Make sure the Django server is running
2. Use the frontend project submission form in Test.jsx
3. Faculty can view submitted projects in Feedback.jsx

## Testing

You can test the API using the provided `test_project_api.py` script:

```bash
python test_project_api.py
```