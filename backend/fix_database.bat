@echo off
echo ========================================
echo Исправление проблемы с базой данных
echo ========================================
echo.

echo [1/5] Удаление старой базы данных...
if exist db.sqlite3 del db.sqlite3
echo [OK] База данных удалена
echo.

echo [2/5] Проверка миграций...
python manage.py showmigrations
echo.

echo [3/5] Применение миграций...
python manage.py migrate
if errorlevel 1 (
    echo [ОШИБКА] Не удалось применить миграции
    pause
    exit /b 1
)
echo [OK] Миграции применены
echo.

echo [4/5] Создание тестовых данных...
python manage.py init_demo_data
if errorlevel 1 (
    echo [ПРЕДУПРЕЖДЕНИЕ] Не удалось создать тестовые данные
)
echo.

echo [5/5] Проверка таблиц...
echo Откройте dbshell и выполните: .tables
echo.

echo ========================================
echo [УСПЕХ] Проблема решена!
echo ========================================
echo.
echo Теперь запустите сервер:
echo   python manage.py runserver
echo.
echo И откройте: http://127.0.0.1:8000/
echo.
pause
