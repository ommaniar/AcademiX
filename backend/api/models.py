from django.db import models

# Create your models here.
class Article(models.Model):
    title = models.CharField(max_length=255)
    html = models.TextField()
    original_link = models.URLField()
    def __str__(self):
        return self.title