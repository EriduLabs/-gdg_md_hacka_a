import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from hackathon.models import IdeaSubmission, IdeaJoinRequest

IdeaJoinRequest.objects.all().delete()
IdeaSubmission.objects.all().delete()

print("Cleared Idea Submissions and Join Requests.")
