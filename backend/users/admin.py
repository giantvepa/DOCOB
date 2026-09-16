from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Department


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'full_name', 'role', 'department', 'is_active', 'date_joined']
    list_filter = ['role', 'department', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'position']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительная информация', {
            'fields': ('position', 'department', 'avatar', 'role', 'phone', 'last_login_ip')
        }),
    )


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'head', 'parent', 'is_active']
    list_filter = ['is_active', 'parent']
    search_fields = ['name', 'code']
