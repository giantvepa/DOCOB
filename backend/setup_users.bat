@echo off
echo ========================================
echo Настройка пользователей для СЭД ЭСАСЫ ПИКИР
echo ========================================
echo.

echo [1/4] Активация виртуального окружения...
call venv\Scripts\activate
echo [OK]
echo.

echo [2/4] Создание миграций...
python manage.py makemigrations
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать миграции
    pause
    exit /b 1
)
echo [OK]
echo.

echo [3/4] Применение миграций...
python manage.py migrate
if errorlevel 1 (
    echo [ОШИБКА] Не удалось применить миграции
    pause
    exit /b 1
)
echo [OK]
echo.

echo [4/4] Создание тестовых пользователей...
python manage.py setup_users
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать пользователей
    pause
    exit /b 1
)
echo.

echo ========================================
echo [УСПЕХ] Настройка завершена!
echo ========================================
echo.
echo Теперь вы можете войти в админку:
echo   URL: http://127.0.0.1:8000/admin/
echo   Email: admin@demo.tm
echo   Пароль: admin123
echo.
echo Запустите сервер:
echo   python manage.py runserver
echo.
pause
