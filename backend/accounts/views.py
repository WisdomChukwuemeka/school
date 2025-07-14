from django.shortcuts import render
from .serializers import RegistrationSerializer, LoginSerializer, UserSerializer, UserProfileSerializer, AvatarSerializer, AccessCodeSerializer, AdminSerializer
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import User, Profile
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from accounts.models import AccessCode

# Create your views here.
class AccessCodeView(generics.ListCreateAPIView):
    queryset = AccessCode.objects.all()
    serializer_class = AccessCodeSerializer
    permission_classes = [IsAdminUser]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access_code = serializer.save()
        return Response({
            'access_code': AccessCodeSerializer(access_code).data,
            'message': 'Access code created successfully',
        }, status=status.HTTP_201_CREATED)
    
    def get(self, request, *args, **kwargs):
        access_codes = AccessCode.objects.all()
        serializer = AccessCodeSerializer(access_codes, many=True)
        return Response({
            'access_codes': serializer.data,
        }, status=status.HTTP_200_OK)
        
class AdminView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminSerializer
    
    def post(self, request, *arg, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': AdminSerializer(user).data,
                'message': 'User register successfully',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

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
                'role': user.role,
                'code': user.code,
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
                'code': user.code,
            }, status=status.HTTP_200_OK)
            
class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        if search:
                return User.objects.filter(role__icontains=search)
        return User.objects.all()
          

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'message': 'Users found successfully',
            'users': serializer.data
        }, status=status.HTTP_200_OK)
        
        
        
class UserListDeleteView(APIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'
   
    def delete(self, request, pk, *args, **kwargs):
        if not request.user.is_superuser:
            return Response({'detail': 'You do not have permission to delete users.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response({'detail': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
            
          
            
# In views.py
class AvatarApiView(generics.ListCreateAPIView):
    serialier_class = AvatarSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, format=None):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AvatarSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'profile': serializer.data,
            'message': 'Avatar updated successfully'
        }, status=status.HTTP_200_OK)
        
class GetProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserProfileSerializer(profile)
        return Response({'profile': serializer.data}, status=status.HTTP_200_OK)
