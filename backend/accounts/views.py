from django.shortcuts import render
from .serializers import RegistrationSerializer, LoginSerializer, UserSerializer, ProfileSerializer, UpdateProfileSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User, Profile
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                'message': 'Registration Succssfull',
            }, status=status.HTTP_201_CREATED)
        
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Login successfull',
                "refresh":str(refresh),
                "access":str(refresh.access_token),
                "role": user.role,
            }, status=status.HTTP_200_OK)
            
class ProfileView(generics.ListCreateAPIView):
    queryset = Profile.objects.all()
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save(user=request.user)
            return Response({
                'profile': ProfileSerializer(profile).data,
                'message': 'Profile created suuccessfully',
            }, status=status.HTTP_201_CREATED)
        return Response({
            'error': 'Error uploading profile'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        try:
            profile = request.user
            serializer = self.get_serializer(profile)
            return Response({
                'profile': serializer.data,
            }, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({
                'error': 'Profile not found'
            }, status=status.HTTP_400_BAD_REQUEST)
            

class UpdateProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        # Returns the profile of the currently authenticated user
        return self.request.user.user_profile

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
            
            
            
        
