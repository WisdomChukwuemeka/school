from django.urls import path
from .views import RegisterView, LoginView, UserListDeleteView, GetProfileView, AccessCodeView, AvatarApiView, AdminView, UserView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('avatar/', AvatarApiView.as_view(), name='avatar' ),
    path('profile/all/', GetProfileView.as_view(), name='profile'),
    path('adminpanel/', AdminView.as_view(), name='admin_panel'),
    path('user/ACCeSS_code/', AccessCodeView.as_view(), name='access_code'),
    path('users/', UserView.as_view(), name='users'),
    path('delete/<int:pk>/', UserListDeleteView.as_view(), name='delete_user'),
] 
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)