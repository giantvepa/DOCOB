#!/bin/bash

echo "========================================"
echo "СЭД \"ЭСАСЫ ПИКИР\" - Установка Backend"
echo "========================================"
echo ""

# Проверка Python
if ! command -v python3 &> /dev/null; then
    echo "[ОШИБКА] Python 3 не установлен!"
    echo "Установите Python: sudo apt install python3 python3-pip python3-venv"
    exit 1
fi

echo "[1/6] Создание виртуального окружения..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Не удалось создать виртуальное окружение"
    exit 1
fi
echo "[OK] Виртуальное окружение создано"
echo ""

echo "[2/6] Активация виртуального окружения..."
source venv/bin/activate
echo "[OK] Виртуальное окружение активировано"
echo ""

echo "[3/6] Установка зависимостей..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Не удалось установить зависимости"
    exit 1
fi
echo "[OK] Зависимости установлены"
echo ""

echo "[4/6] Создание миграций..."
python manage.py makemigrations
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Не удалось создать миграции"
    exit 1
fi
echo "[OK] Миграции созданы"
echo ""

echo "[5/6] Применение миграций..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Не удалось применить миграции"
    exit 1
fi
echo "[OK] Миграции применены"
echo ""

echo "[6/6] Создание тестовых данных..."
python manage.py init_demo_data
if [ $? -ne 0 ]; then
    echo "[ПРЕДУПРЕЖДЕНИЕ] Не удалось создать тестовые данные"
    echo "Создайте их вручную через админку"
fi
echo ""

echo "========================================"
echo "[УСПЕХ] Установка завершена!"
echo "========================================"
echo ""
echo "Запустите сервер командой:"
echo "  python manage.py runserver"
echo ""
echo "Затем откройте:"
echo "  http://127.0.0.1:8000/"
echo ""
echo "Тестовые аккаунты:"
echo "  admin@demo.tm / admin123"
echo "  manager@demo.tm / manager123"
echo "  user@demo.tm / user123"
echo ""
