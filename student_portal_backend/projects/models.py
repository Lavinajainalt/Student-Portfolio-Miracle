from django.db import models

class Project(models.Model):
    student_id = models.CharField(max_length=50)
    student_name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.TextField()
    project_link = models.URLField()
    date_submitted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.student_name}"