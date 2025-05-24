from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer
import random
from .models import Score
from .serializers import ScoreSerializer

@api_view(['POST'])
def submit_score(request):
    serializer = ScoreSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "score saved"})
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_questions(request, subject):
    questions = Question.objects.filter(subject__name=subject)
    random_questions = random.sample(list(questions), min(5, len(questions)))
    serializer = QuestionSerializer(random_questions, many=True)
    data = []
    for item in serializer.data:
        data.append({
            "id": item["id"],
            "question": item["text"],
            "options": [item["option_a"], item["option_b"], item["option_c"], item["option_d"]],
            "answer": item["correct_option"]
        })
    return Response(data)
