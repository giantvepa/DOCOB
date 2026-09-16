from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import User, Department
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    ChangePasswordSerializer, DepartmentSerializer
)


@extend_schema_view(
    list=extend_schema(summary='Список пользователей'),
    retrieve=extend_schema(summary='Пользователь по ID'),
)
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра пользователей"""
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['role', 'department', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'position']
    ordering_fields = ['date_joined', 'username', 'last_name']


class RegisterView(APIView):
    """Регистрация нового пользователя"""
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        request=UserRegistrationSerializer,
        responses={201: UserSerializer},
        summary='Регистрация'
    )
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            login(request, user)
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'Регистрация успешна'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Вход в систему"""
    permission_classes = [permissions.AllowAny]
    
    @extend_schema(
        request=UserLoginSerializer,
        responses={200: UserSerializer},
        summary='Вход'
    )
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            
            # Обновляем IP
            user.last_login_ip = request.META.get('REMOTE_ADDR')
            user.save(update_fields=['last_login_ip'])
            
            return Response({
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': 'Вход выполнен успешно'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Выход из системы"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(summary='Выход')
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        logout(request)
        return Response({'message': 'Выход выполнен успешно'})


class MeView(APIView):
    """Текущий пользователь"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        responses={200: UserSerializer},
        summary='Текущий пользователь'
    )
    def get(self, request):
        return Response(UserSerializer(request.user).data)
    
    @extend_schema(
        request=UserSerializer,
        responses={200: UserSerializer},
        summary='Обновить профиль'
    )
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """Смена пароля"""
    permission_classes = [permissions.IsAuthenticated]
    
    @extend_schema(
        request=ChangePasswordSerializer,
        summary='Сменить пароль'
    )
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'old_password': 'Неверный текущий пароль'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Пароль изменён успешно'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema_view(
    list=extend_schema(summary='Список отделов'),
    retrieve=extend_schema(summary='Отдел по ID'),
    create=extend_schema(summary='Создать отдел'),
    update=extend_schema(summary='Обновить отдел'),
    destroy=extend_schema(summary='Удалить отдел'),
)
class DepartmentViewSet(viewsets.ModelViewSet):
    """ViewSet для отделов"""
    queryset = Department.objects.filter(is_active=True)
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_active', 'parent']
    search_fields = ['name', 'code']
