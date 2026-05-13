from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("api/", include("hackathon.urls")),
    path("api/dj-rest-auth/", include("dj_rest_auth.urls")),
    path("api/dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")),
    path("accounts/", include("allauth.urls")),
    path('admin/', admin.site.urls),
]

admin.site.site_header = "Hacka-MD Admin"
admin.site.site_title = "Hacka-MD Admin Portal"
admin.site.index_title = "Welcome to Hacka-MD Administration"
