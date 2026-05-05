from django.urls import path
from . import views, auth_views

urlpatterns = [
    path('auth/register/', auth_views.RegisterUserAPIView.as_view(), name='auth-register'),
    path('auth/login/', auth_views.LoginAPIView.as_view(), name='auth-login'),
    path('auth/me/', auth_views.CurrentUserAPIView.as_view(), name='auth-me'),
    path('events/', views.HackathonEventListAPIView.as_view(), name='event-list'),
    path('event/active/', views.ActiveHackathonEventAPIView.as_view(), name='event-active'),
    path('submissions/', views.IdeaSubmissionCreateView.as_view(), name='submission-create'),
    path('register-hackathon/', views.HackathonRegistrationView.as_view(), name='register-hackathon'),
    path('join-team/', views.IdeaJoinRequestCreateView.as_view(), name='join-team'),
]