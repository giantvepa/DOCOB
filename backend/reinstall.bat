@echo off
echo ========================================
echo Полная переустановка базы данных
echo ========================================
echo.

echo [1/7] Активация виртуального окружения...
call venv\Scripts\activate
echo [OK]
echo.

echo [2/7] Удаление старой базы данных...
if exist db.sqlite3 del db.sqlite3
echo [OK] База данных удалена
echo.

echo [3/7] Удаление старых миграций...
if exist users\migrations\0001_initial.py del users\migrations\0001_initial.py
if exist documents\migrations\0001_initial.py del documents\migrations\0001_initial.py
if exist tasks\migrations\0001_initial.py del tasks\migrations\0001_initial.py
if exist meetings\migrations\0001_initial.py del meetings\migrations\0001_initial.py
echo [OK] Миграции удалены
echo.

echo [4/7] Создание новых миграций для users...
python manage.py makemigrations users
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать миграции для users
    pause
    exit /b 1
)
echo [OK]
echo.

echo [5/7] Создание новых миграций для documents...
python manage.py makemigrations documents
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать миграции для documents
    pause
    exit /b 1
)
echo [OK]
echo.

echo [6/7] Создание новых миграций для tasks...
python manage.py makemigrations tasks
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать миграции для tasks
    pause
    exit /b 1
)
echo [OK]
echo.

echo [7/7] Создание новых миграций для meetings...
python manage.py makemigrations meetings
if errorlevel 1 (
    echo [ОШИБКА] Не удалось создать миграции для meetings
    pause
    exit /b 1
)
echo [OK]
echo.

echo ========================================
echo Применение миграций...
echo ========================================
python manage.py migrate
if errorlevel 1 (
    echo [ОШИБКА] Не удалось применить миграции
    pause
    exit /b 1
)
echo [OK] Миграции применены
echo.

echo ========================================
echo Создание тестовых данных...
echo ========================================
python manage.py init_demo_data
if errorlevel 1 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Не удалось создать тестовые данные
)
echo.

echo ========================================
echo [УСПЕХ] Все готово!
echo ========================================
echo.
echo Проверьте миграции:
echo   python manage.py showmigrations
echo.
echo Запустите сервер:
echo   python manage.py runserver
echo.
echo Откройте: http://127.0.0.1:8000/
echo.
pause
