from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HackathonEvent, IdeaSubmission, HackathonRegistration, IdeaJoinRequest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class HackathonEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HackathonEvent
        fields = '__all__'

class IdeaSubmissionSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = IdeaSubmission
        fields = '__all__'

class HackathonRegistrationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event = serializers.PrimaryKeyRelatedField(queryset=HackathonEvent.objects.all(), required=False)
    
    class Meta:
        model = HackathonRegistration
        fields = '__all__'

class IdeaJoinRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    idea = serializers.PrimaryKeyRelatedField(queryset=IdeaSubmission.objects.all())
    
    class Meta:
        model = IdeaJoinRequest
        fields = '__all__'
