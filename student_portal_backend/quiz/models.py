from django.db import models
from django.conf import settings

class QuizPoints(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    guest_id = models.CharField(max_length=100, null=True, blank=True)
    points = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.user.username if self.user else self.guest_id} - {self.points} points"