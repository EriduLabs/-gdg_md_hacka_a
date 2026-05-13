from django.contrib import admin
from .models import HackathonEvent, IdeaSubmission, HackathonRegistration, IdeaJoinRequest, GDGCategory, GDGGuide, DiscussionPost

@admin.register(HackathonEvent)
class HackathonEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'kickoff_time', 'judging_date', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')

@admin.register(IdeaSubmission)
class IdeaSubmissionAdmin(admin.ModelAdmin):
    list_display = ('proposed_title', 'owner', 'created_at')
    search_fields = ('proposed_title', 'problem_statement')

@admin.register(HackathonRegistration)
class HackathonRegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'role', 'status', 'score', 'progress_status', 'registered_at')
    list_editable = ('score', 'progress_status')
    list_filter = ('event', 'status', 'role', 'progress_status')
    search_fields = ('user__username', 'event__title', 'skills')

@admin.register(IdeaJoinRequest)
class IdeaJoinRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'idea', 'created_at')
    search_fields = ('user__username', 'idea__proposed_title', 'message')

@admin.register(GDGCategory)
class GDGCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'created_at')
    search_fields = ('name',)
    list_editable = ('order',)

@admin.register(GDGGuide)
class GDGGuideAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'order', 'created_at')
    list_filter = ('category',)
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('order',)

@admin.register(DiscussionPost)
class DiscussionPostAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'timestamp')
    list_filter = ('event', 'user')
    search_fields = ('content', 'user__username', 'event__title')
