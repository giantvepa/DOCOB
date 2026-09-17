# 🔐 РЕШЕНИЕ ПРОБЛЕМЫ: Не могу войти в админку Django

## ❌ Проблема

Вы видите ошибку:
```
Пожалуйста, введите корректные имя пользователя и пароль учётной записи. 
Оба поля могут быть чувствительны к регистру.
```

## 🔍 Причина

Тестовые пользователи созданы как **обычные пользователи**, а не как **суперпользователи**.

Для входа в админку Django пользователь должен иметь:
- ✅ `is_staff = True` (доступ к админке)
- ✅ `is_superuser = True` (полные права)
- ✅ `is_active = True` (активен)

---

## ✅ РЕШЕНИЕ 1: Быстрая настройка (Windows)

### Шаг 1: Запустите скрипт настройки

1. Откройте папку `backend`
2. Дважды кликните на файл **`setup_users.bat`**
3. Дождитесь завершения
4. Готово!

### Шаг 2: Войдите в админку

Откройте: **http://127.0.0.1:8000/admin/**

Войдите с данными:
- **Email:** `admin@demo.tm`
- **Пароль:** `admin123`

---

## ✅ РЕШЕНИЕ 2: Ручная настройка

### Шаг 1: Откройте командную строку в папке `backend`

### Шаг 2: Активируйте виртуальное окружение

```bash
venv\Scripts\activate
```

### Шаг 3: Создайте суперпользователя

```bash
python manage.py create_superuser
```

Вы увидите:
```
✅ Суперпользователь создан!

📧 Данные для входа в админку:
  Email: admin@demo.tm
  Пароль: admin123

🌐 Откройте: http://127.0.0.1:8000/admin/
```

### Шаг 4: Или создайте всех тестовых пользователей

```bash
python manage.py setup_users
```

Вы увидите:
```
✅ Создан: admin@demo.tm (суперпользователь)
✅ Создан: manager@demo.tm
✅ Создан: user@demo.tm

📧 Данные для входа:
  Админка (суперпользователь):
    Email: admin@demo.tm
    Пароль: admin123
    URL: http://127.0.0.1:8000/admin/

  API (все пользователи):
    admin@demo.tm / admin123
    manager@demo.tm / manager123
    user@demo.tm / user123
```

### Шаг 5: Запустите сервер

```bash
python manage.py runserver
```

### Шаг 6: Войдите в админку

Откройте: **http://127.0.0.1:8000/admin/**

Войдите:
- **Email:** `admin@demo.tm`
- **Пароль:** `admin123`

---

## ✅ РЕШЕНИЕ 3: Через Django shell

Если команды не работают, создайте суперпользователя вручную:

```bash
python manage.py shell
```

Затем введите:

```python
from users.models import User

# Создаем суперпользователя
admin = User.objects.get(email='admin@demo.tm')
admin.is_staff = True
admin.is_superuser = True
admin.is_active = True
admin.set_password('admin123')
admin.save()

print('✅ Суперпользователь создан!')
print('Email: admin@demo.tm')
print('Пароль: admin123')

exit()
```

---

## ✅ РЕШЕНИЕ 4: Создать нового суперпользователя

Если ничего не помогает, создайте нового суперпользователя:

```bash
python manage.py createsuperuser
```

Введите:
- **Username:** `superadmin`
- **Email:** `superadmin@demo.tm`
- **Password:** `super123`
- **Password (again):** `super123`

Затем войдите в админку с этими данными.

---

## 📋 Проверка прав пользователя

Чтобы проверить права пользователя:

```bash
python manage.py shell
```

```python
from users.models import User

# Показать всех пользователей и их права
for user in User.objects.all():
    print(f"\n{user.email}:")
    print(f"  is_active: {user.is_active}")
    print(f"  is_staff: {user.is_staff}")
    print(f"  is_superuser: {user.is_superuser}")
    print(f"  role: {user.role}")

exit()
```

---

## 🔧 Исправить всех пользователей

Чтобы сделать всех пользователей staff:

```bash
python manage.py shell
```

```python
from users.models import User

# Сделать всех пользователей активными и staff
User.objects.all().update(is_active=True, is_staff=True)

print('✅ Все пользователи активированы и имеют доступ к админке')

exit()
```

---

## 🎯 Итоговые данные для входа

### Админка Django (только суперпользователь):
- **URL:** http://127.0.0.1:8000/admin/
- **Email:** `admin@demo.tm`
- **Пароль:** `admin123`

### API (все пользователи):
- **admin@demo.tm** / admin123 (суперпользователь)
- **manager@demo.tm** / manager123 (менеджер)
- **user@demo.tm** / user123 (обычный пользователь)

---

## 🐛 Если ничего не помогло

### Полная переустановка:

```bash
# Удалить базу данных
del db.sqlite3

# Создать миграции
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py create_superuser

# Запустить сервер
python manage.py runserver
```

---

## ✅ Чеклист

- [ ] Виртуальное окружение активировано
- [ ] Миграции созданы: `python manage.py makemigrations`
- [ ] Миграции применены: `python manage.py migrate`
- [ ] Суперпользователь создан: `python manage.py create_superuser`
- [ ] Сервер запущен: `python manage.py runserver`
- [ ] Открыт URL: http://127.0.0.1:8000/admin/
- [ ] Введены данные: admin@demo.tm / admin123

---

**Готово! Теперь вы можете войти в админку!** 🎉
