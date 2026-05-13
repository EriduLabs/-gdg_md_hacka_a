from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HackathonEvent, IdeaSubmission, HackathonRegistration, IdeaJoinRequest, GDGCategory, GDGGuide, DiscussionPost

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class HackathonEventSerializer(serializers.ModelSerializer):
    timeline_progress = serializers.SerializerMethodField()

    class Meta:
        model = HackathonEvent
        fields = '__all__'

    def get_timeline_progress(self, obj):
        from django.utils import timezone
        if obj.judging_date and obj.created_at:
            total_duration = (obj.judging_date - obj.created_at).total_seconds()
            elapsed = (timezone.now() - obj.created_at).total_seconds()
            if total_duration > 0:
                progress = (elapsed / total_duration) * 100
                return min(max(progress, 0), 100)
        return 0

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

class GDGGuideSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = GDGGuide
        fields = '__all__'

class GDGCategorySerializer(serializers.ModelSerializer):
    guides = GDGGuideSerializer(many=True, read_only=True)
    
    class Meta:
        model = GDGCategory
        fields = '__all__'

class DiscussionPostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event = serializers.PrimaryKeyRelatedField(queryset=HackathonEvent.objects.all(), required=False)

    class Meta:
        model = DiscussionPost
        fields = '__all__'
