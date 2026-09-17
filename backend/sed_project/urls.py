"""
URL configuration for sed_project project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/meetings/', include('meetings.urls')),
]
