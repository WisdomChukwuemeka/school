from rest_framework import serializers
from .models import User, Profile
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User, AccessCode

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'username', 'phone_number', 'role', 'code', 'date_joined',
                  'is_staff', 'is_superuser', 'is_active', 'agreement',
                  ]
        read_only_fields = ['id', 'date_joined', 'is_staff', 'is_superuser', 'is_active']

class AccessCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessCode
        fields = ['code', 'role', 'is_used', 'user', 'created_at']
        read_only_fields = ['is_used', 'user', 'created_at']
        
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'username', 'phone_number', 'password']
        read_only_fields = ['is_superuser', 'is_manager', 'is_staff']
    
    def create(self, validated_data):
        validated_data['is_superuser'] = True
        validated_data['is_manager'] = True
        validated_data['is_staff'] = True
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        return user
        
            
        
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True, write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'username', 'phone_number', 'code', 'password', 'confirm_password', 'role', 'agreement']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        
        role = attrs.get('role')
        code = attrs.get('code', '').strip()
        if role in ['manager', 'staff']:
            if not code:
                raise serializers.ValidationError("Unauthorized access")        
            try:
                access_code = AccessCode.objects.get(code=code, role=role, is_used=False)
                self.context['access_code'] = access_code
            except AccessCode.DoesNotExist:
                raise serializers.ValidationError('unauthorized access')
        elif role in ['student', 'visitor'] and code:
                raise serializers.ValidationError('Code is not required')
        return attrs
        
    
    def validate_role(self, value):
        if not value:
            raise serializers.ValidationError("Role can't be left empty")
        return value
    
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data.pop('code', None)
        access_code = self.context.get('access_code')
        if access_code:
            access_code.is_used = True
            access_code.save()
        user = User.objects.create_user(
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            username = validated_data['username'],
            phone_number = validated_data['phone_number'],
            password = validated_data['password'],
            role = validated_data['role'],
            agreement = validated_data['agreement'],
            code = validated_data.get('code', 'null')
        )
        user.set_password(validated_data['password'])
        user.save()
        Profile.objects.create(user=user)
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(email=email, password=password)
            
            if not user:
                raise serializers.ValidationError("User does not exist")
            if not user.is_active:
                raise serializers.ValidationError("user account has been disabled, contact customer care.")
            attrs['user'] = user
            return attrs
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'avatar']
        read_only_fields = ['id', 'avatar']

    
class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'user', 'avatar']
        read_only_fields = ['id', 'user']
        
    def validate_avatar(self, value):
        ext = value.name.split('.')[-1].lower()
        if ext not in ['jpeg', 'jpg', 'png']:
            raise serializers.ValidationError("File not supported. Use jpeg or png.")
        return value
        
    

        
        


    