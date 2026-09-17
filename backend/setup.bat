@echo off
echo ========================================
echo СЭД "ЭСАСЫ ПИКИР" - Установка Backend
echo ========================================
echo.

REM Проверка Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ОШИБКА] Python не установлен!
    echo Скачайте Python с https://www.python.org/
    pause
    exit /b 1
)

echo [1/6] Создание виртуального окружения...
python -m venv venv
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать виртуальное окружение
    pause
    exit /b 1
)
echo [OK] Виртуальное окружение создано
echo.

echo [2/6] Активация виртуального окружения...
call venv\Scripts\activate
echo [OK] Виртуальное окружение активировано
echo.

echo [3/6] Установка зависимостей...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ОШИБКА] Не удалось установить зависимости
    pause
    exit /b 1
)
echo [OK] Зависимости установлены
echo.

echo [4/6] Создание миграций...
python manage.py makemigrations
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать миграции
    pause
    exit /b 1
)
echo [OK] Миграции созданы
echo.

echo [5/6] Применение миграций...
python manage.py migrate
if errorlevel 1 (
    echo [ОШИБКА] Не удалось применить миграции
    pause
    exit /b 1
)
echo [OK] Миграции применены
echo.

echo [6/6] Создание тестовых данных...
python manage.py init_demo_data
if errorlevel 1 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Не удалось создать тестовые данные
    echo Создайте их вручную через админку
)
echo.

echo ========================================
echo [УСПЕХ] Установка завершена!
echo ========================================
echo.
echo Запустите сервер командой:
echo   python manage.py runserver
echo.
echo Затем откройте:
echo   http://127.0.0.1:8000/
echo.
echo Тестовые аккаунты:
echo   admin@demo.tm / admin123
echo   manager@demo.tm / manager123
echo   user@demo.tm / user123
echo.
pause
