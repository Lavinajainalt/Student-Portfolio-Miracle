# Script to create sample videos for each subject
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_portal_backend.settings')
django.setup()

from core.models import Subject, Video

# Sample videos data for each subject
sample_videos = {
    'PGDFE': [
        {'title': 'Introduction to Frontend', 'url': 'https://example.com/frontend_intro.mp4', 'order': 1},
        {'title': 'HTML Basics', 'url': 'https://example.com/html_basics.mp4', 'order': 2},
        {'title': 'CSS Fundamentals', 'url': 'https://example.com/css_fundamentals.mp4', 'order': 3},
    ],
    'DATA_SCIENCE': [
        {'title': 'Data Science Overview', 'url': 'https://example.com/ds_overview.mp4', 'order': 1},
        {'title': 'Python for Data Science', 'url': 'https://example.com/python_ds.mp4', 'order': 2},
        {'title': 'Data Visualization', 'url': 'https://example.com/data_viz.mp4', 'order': 3},
    ],
    'CYBER_SECURITY': [
        {'title': 'Cyber Security Basics', 'url': 'https://example.com/cyber_basics.mp4', 'order': 1},
        {'title': 'Network Security', 'url': 'https://example.com/network_security.mp4', 'order': 2},
        {'title': 'Ethical Hacking', 'url': 'https://example.com/ethical_hacking.mp4', 'order': 3},
    ],
}

def create_videos():
    for subject_code, videos in sample_videos.items():
        try:
            subject = Subject.objects.get(name=subject_code)
            for video_data in videos:
                video, created = Video.objects.get_or_create(
                    subject=subject,
                    title=video_data['title'],
                    defaults={'url': video_data['url'], 'order': video_data['order']}
                )
                if created:
                    print(f"Created video '{video.title}' for subject {subject.get_name_display()}")
                else:
                    print(f"Video '{video.title}' already exists for subject {subject.get_name_display()}")
        except Subject.DoesNotExist:
            print(f"Subject with code {subject_code} does not exist.")

if __name__ == '__main__':
    create_videos()
    print("Sample videos creation complete.")
