from django.urls import path
from .views import RegisterView, LoginView, ProfileView, UpdateProfileView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('update/profile/', UpdateProfileView.as_view(), name='update_profile'),
] 
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
