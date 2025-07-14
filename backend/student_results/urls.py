# urls.py
from django.urls import path
from .views import (
    CourseRegistrationCreateView, ResetNotificationView, StudentNotificationListView, StudentGradeView, StudentDashboardView, StudentCourseView, GradeView
)

urlpatterns = [
    path('dashboard/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('register_course/', CourseRegistrationCreateView.as_view(), name='register-course'),
    path('studentcourses/', StudentCourseView.as_view(), name='studentcourses'),
    path('grades/', GradeView.as_view(), name='grades'),
    path('studentgrade/', StudentGradeView.as_view(), name='studentgrade'),
    path('notifications/', StudentNotificationListView.as_view(), name='student-notifications'),
    path('reset-notification/', ResetNotificationView.as_view(), name='reset-notification'),
]
