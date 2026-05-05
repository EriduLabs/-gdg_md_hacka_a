from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import HackathonEvent, IdeaSubmission, HackathonRegistration, IdeaJoinRequest
from .serializers import HackathonEventSerializer, IdeaSubmissionSerializer, HackathonRegistrationSerializer, IdeaJoinRequestSerializer

class HackathonEventListAPIView(generics.ListAPIView):
    queryset = HackathonEvent.objects.all().order_by('-created_at')
    serializer_class = HackathonEventSerializer
    permission_classes = [permissions.AllowAny]

class ActiveHackathonEventAPIView(generics.RetrieveAPIView):
    serializer_class = HackathonEventSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return HackathonEvent.objects.filter(is_active=True).first()

class IdeaSubmissionCreateView(generics.CreateAPIView):
    queryset = IdeaSubmission.objects.all()
    serializer_class = IdeaSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Now acts as a hackathon proposal independent of an event
        serializer.save(owner=self.request.user)

class HackathonRegistrationView(generics.CreateAPIView):
    queryset = HackathonRegistration.objects.all()
    serializer_class = HackathonRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event_id = self.request.data.get('event_id')
        if event_id:
            event = get_object_or_404(HackathonEvent, id=event_id)
        else:
            event = HackathonEvent.objects.filter(is_active=True).first()
            
        registration, created = HackathonRegistration.objects.update_or_create(
            user=self.request.user,
            event=event,
            defaults={
                'status': self.request.data.get('status', 'Looking for Team'),
                'role': self.request.data.get('role', ''),
                'skills': self.request.data.get('skills', '')
            }
        )
        return registration

class IdeaJoinRequestCreateView(generics.CreateAPIView):
    queryset = IdeaJoinRequest.objects.all()
    serializer_class = IdeaJoinRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        idea = get_object_or_404(IdeaSubmission, id=self.request.data.get('idea'))
        serializer.save(user=self.request.user, idea=idea)
