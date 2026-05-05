from django.contrib import admin
from .models import HackathonEvent, IdeaSubmission, HackathonRegistration, IdeaJoinRequest

@admin.register(HackathonEvent)
class HackathonEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'kickoff_time', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')

@admin.register(IdeaSubmission)
class IdeaSubmissionAdmin(admin.ModelAdmin):
    list_display = ('proposed_title', 'owner', 'created_at')
    search_fields = ('proposed_title', 'problem_statement')

@admin.register(HackathonRegistration)
class HackathonRegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'role', 'status', 'registered_at')
    list_filter = ('event', 'status', 'role')
    search_fields = ('user__username', 'event__title', 'skills')

@admin.register(IdeaJoinRequest)
class IdeaJoinRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'idea', 'created_at')
    search_fields = ('user__username', 'idea__proposed_title', 'message')
