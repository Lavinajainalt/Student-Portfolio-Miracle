from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Subject, Topic, Question

class Command(BaseCommand):
    help = 'Create test data for topics and questions'

    def handle(self, *args, **options):
        # Get or create a test subject
        subject, _ = Subject.objects.get_or_create(
            name="Test Subject",
            description="A test subject for testing purposes"
        )

        # Create topics
        topics_data = [
            {
                "name": "Introduction",
                "description": "Basic concepts and introduction to the subject"
            },
            {
                "name": "Advanced Topics",
                "description": "More complex topics and concepts"
            }
        ]

        for topic_data in topics_data:
            topic, _ = Topic.objects.get_or_create(
                subject=subject,
                name=topic_data["name"],
                defaults={"description": topic_data["description"]}
            )

            # Create questions for the topic
            questions_data = [
                {
                    "question_text": "What is the capital of India?",
                    "option_a": "Delhi",
                    "option_b": "Mumbai",
                    "option_c": "Bangalore",
                    "option_d": "Chennai",
                    "correct_answer": "Delhi",
                    "explanation": "Delhi is the capital of India and serves as the political center of the country."
                },
                {
                    "question_text": "Which of these is not a programming language?",
                    "option_a": "Python",
                    "option_b": "Java",
                    "option_c": "HTML",
                    "option_d": "C++",
                    "correct_answer": "HTML",
                    "explanation": "HTML is a markup language used for structuring web pages, not a programming language."
                },
                {
                    "question_text": "What is the boiling point of water?",
                    "option_a": "100°C",
                    "option_b": "90°C",
                    "option_c": "110°C",
                    "option_d": "80°C",
                    "correct_answer": "100°C",
                    "explanation": "Water boils at 100°C (212°F) at standard atmospheric pressure."
                }
            ]

            for question_data in questions_data:
                Question.objects.get_or_create(
                    topic=topic,
                    question_text=question_data["question_text"],
                    defaults={
                        "option_a": question_data["option_a"],
                        "option_b": question_data["option_b"],
                        "option_c": question_data["option_c"],
                        "option_d": question_data["option_d"],
                        "correct_answer": question_data["correct_answer"],
                        "explanation": question_data["explanation"]
                    }
                )

        self.stdout.write(self.style.SUCCESS('Successfully created test data'))
