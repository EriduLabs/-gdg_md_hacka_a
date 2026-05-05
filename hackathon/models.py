from django.db import models
from django.contrib.auth.models import User

class HackathonEvent(models.Model):
    title = models.CharField(max_length=255)
    prize_pool = models.CharField(max_length=255, default="Sponsored Funding + Cloud Credits")
    kickoff_time = models.CharField(max_length=255, default="Friday, 6:00 PM")
    build_duration = models.CharField(max_length=255, default="48 Hours")
    demo_time = models.CharField(max_length=255, default="Sunday, 1:00 PM")
    rules = models.TextField(blank=True, help_text="List the rules and playbook here.")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({'Active' if self.is_active else 'Inactive'})"

class IdeaSubmission(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='ideas')
    proposed_title = models.CharField(max_length=255, default="Untitled Proposal")
    problem_statement = models.TextField(default="Describe the problem...")
    target_audience = models.CharField(max_length=255, blank=True)
    suggested_tools = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Proposal: {self.proposed_title} by {self.owner.username if self.owner else 'Anonymous'}"

class HackathonRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='registrations')
    event = models.ForeignKey(HackathonEvent, on_delete=models.CASCADE, related_name='participants')
    status = models.CharField(max_length=50, default='Looking for Team')
    role = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Developer, Designer, Project Manager")
    skills = models.TextField(blank=True, null=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')

    def __str__(self):
        return f"{self.user.username} - {self.event.title} - {self.role or 'Participant'}"

class IdeaJoinRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='join_requests')
    idea = models.ForeignKey(IdeaSubmission, on_delete=models.CASCADE, related_name='join_requests')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'idea')

    def __str__(self):
        return f"{self.user.username} wants to join {self.idea.proposed_title}"
