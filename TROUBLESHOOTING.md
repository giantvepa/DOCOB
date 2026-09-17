# 🔧 Диагностика проблемы с белым экраном

## Что было исправлено

✅ Добавлено логирование в AuthContext  
✅ Добавлено логирование в ProtectedRoute  
✅ Добавлено логирование при загрузке данных  
✅ Улучшена обработка ошибок  

## Как проверить работу приложения

### Шаг 1: Откройте консоль браузера

1. Откройте фронтенд в браузере
2. Нажмите **F12** (или правая кнопка мыши → "Просмотреть код")
3. Перейдите на вкладку **Console**

### Шаг 2: Проверьте логи

Вы должны увидеть следующие сообщения:

```
🔐 Checking authentication...
🔑 Token found: false
🏁 Setting isLoading to false
🛡️ ProtectedRoute: { isLoading: false, isAuthenticated: false }
🔒 Showing login screen...
```

Это означает, что приложение работает правильно и показывает экран входа.

### Шаг 3: Войдите в систему

Используйте тестовые данные:
- **Email:** `admin@demo.tm`
- **Пароль:** `admin123`

После входа вы должны увидеть:

```
📡 Fetching user data...
✅ User data loaded: { ... }
🛡️ ProtectedRoute: { isLoading: false, isAuthenticated: true }
✅ Showing protected content
🔄 Loading data from Django API...
✅ Data loaded: { docs: X, tasks: X, meetings: X, users: X }
```

## Возможные проблемы и решения

### Проблема 1: Белый экран без ошибок в консоли

**Решение:**
1. Очистите кэш браузера: `Ctrl + Shift + Delete`
2. Жёсткая перезагрузка: `Ctrl + Shift + R`
3. Перезапустите dev-сервер: `npm run dev`

### Проблема 2: Ошибка "Failed to fetch"

**Причина:** Django backend не запущен

**Решение:**
```bash
cd backend
python manage.py runserver
```

### Проблема 3: Ошибка CORS

**Причина:** Backend не разрешает запросы с фронтенда

**Решение:**
Проверьте `backend/sed_project/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]
```

### Проблема 4: Ошибка 401 Unauthorized

**Причина:** Токен недействителен или истёк

**Решение:**
1. Очистите localStorage в консоли браузера:
   ```javascript
   localStorage.clear();
   ```
2. Перезагрузите страницу
3. Войдите снова

### Проблема 5: Ошибка 404 Not Found

**Причина:** API endpoint не найден

**Решение:**
1. Проверьте, что Django backend запущен
2. Проверьте URL в `src/api/djangoClient.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```
3. Откройте http://localhost:8000/api/ в браузере

## Проверка подключения

### Через тестовый файл

Откройте `test_connection.html` в браузере и нажмите "Проверить подключение".

### Через curl

```bash
curl http://localhost:8000/api/auth/login/ \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.tm","password":"admin123"}'
```

### Через консоль браузера

```javascript
fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@demo.tm', password: 'admin123' })
})
.then(r => r.json())
.then(data => console.log('✅ Успех:', data))
.catch(err => console.error('❌ Ошибка:', err));
```

## Чеклист диагностики

- [ ] Django backend запущен (`python manage.py runserver`)
- [ ] Фронтенд запущен (`npm run dev`)
- [ ] Backend доступен на http://localhost:8000
- [ ] Фронтенд доступен на http://localhost:5173
- [ ] CORS настроен правильно
- [ ] Тестовые пользователи созданы (`python manage.py setup_users`)
- [ ] Консоль браузера открыта (F12)
- [ ] Логи отображаются в консоли
- [ ] Экран входа отображается
- [ ] Вход в систему работает

## Если ничего не помогло

1. **Полная переустановка:**
   ```bash
   # Удалите node_modules и пересоберите
   rm -rf node_modules
   npm install
   npm run dev
   ```

2. **Проверьте версию Node.js:**
   ```bash
   node --version  # Должна быть 18+
   npm --version   # Должна быть 9+
   ```

3. **Проверьте порт:**
   - Backend: 8000
   - Frontend: 5173 (или 3000)

4. **Покажите логи:**
   Откройте консоль браузера (F12) и скопируйте все сообщения.

## Контакты для поддержки

Если проблема не решена, покажите:
1. Скриншот консоли браузера (F12 → Console)
2. Вывод команды `npm run dev`
3. Вывод команды `python manage.py runserver`

---

**Удачи! 🚀**
