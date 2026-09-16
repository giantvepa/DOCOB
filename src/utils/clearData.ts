// Утилиты для управления данными

export function clearAllData() {
  // Очистка localStorage
  localStorage.clear();
  
  // Очистка IndexedDB
  const request = indexedDB.deleteDatabase('esasy_pikir_db');
  
  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Database blocked'));
  });
}

export function resetApp() {
  if (confirm('Вы уверены? Все данные будут удалены!')) {
    clearAllData().then(() => {
      window.location.reload();
    });
  }
}
