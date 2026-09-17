from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'position', 'department', 'avatar', 'role', 'phone', 'is_active']
        read_only_fields = ['id', 'is_active']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'position', 'department', 'avatar', 'phone']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Пароли не совпадают'})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True  # ВАЖНО: Пользователь активен по умолчанию
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            # Попробуем найти пользователя по email
            try:
                user_obj = User.objects.get(email=data['email'])
                if user_obj.check_password(data['password']):
                    user = user_obj
            except User.DoesNotExist:
                pass
        
        if not user:
            raise serializers.ValidationError('Неверный email или пароль')
        
        if not user.is_active:
            raise serializers.ValidationError('Аккаунт деактивирован')
        
        data['user'] = user
        return data
