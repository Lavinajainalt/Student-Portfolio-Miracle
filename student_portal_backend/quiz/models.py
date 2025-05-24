from django.db import models

class Question(models.Model):
    subject = models.CharField(max_length=100)
    question = models.TextField()
    options = models.JSONField(default=list)
    answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question
# models.py
class Score(models.Model):
    player_name = models.CharField(max_length=100, default="Anonymous")
    subject = models.CharField(max_length=100)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
