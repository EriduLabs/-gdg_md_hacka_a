from django.urls import path
from . import views, auth_views, social_views

urlpatterns = [
    path('auth/register/', auth_views.RegisterUserAPIView.as_view(), name='auth-register'),
    path('auth/login/', auth_views.LoginAPIView.as_view(), name='auth-login'),
    path('auth/me/', auth_views.CurrentUserAPIView.as_view(), name='auth-me'),
    path('auth/google/', social_views.GoogleLogin.as_view(), name='google_login'),
    path('events/', views.HackathonEventListAPIView.as_view(), name='event-list'),
    path('event/active/', views.ActiveHackathonEventAPIView.as_view(), name='event-active'),
    path('submissions/', views.IdeaSubmissionCreateView.as_view(), name='submission-create'),
    path('register-hackathon/', views.HackathonRegistrationView.as_view(), name='register-hackathon'),
    path('join-team/', views.IdeaJoinRequestCreateView.as_view(), name='join-team'),
    path('guides/categories/', views.GDGCategoryListAPIView.as_view(), name='guide-categories'),
    path('guides/<slug:slug>/', views.GDGGuideDetailAPIView.as_view(), name='guide-detail'),
    path('events/<int:event_id>/discussions/', views.DiscussionPostListCreateAPIView.as_view(), name='event-discussions'),
    path('events/<int:event_id>/leaderboard/', views.HackathonLeaderboardAPIView.as_view(), name='event-leaderboard'),
]