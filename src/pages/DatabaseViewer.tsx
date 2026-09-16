import { useState, useEffect } from 'react';
import { initDatabase } from '../backend/database/connection';
import { Database, Download, Upload, Trash2, RefreshCw, Table, Users, FileText, CheckSquare, Calendar } from 'lucide-react';

interface TableInfo {
  name: string;
  count: number;
  icon: any;
  color: string;
}

export default function DatabaseViewer() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbSize, setDbSize] = useState<string>('');

  useEffect(() => {
    loadTablesInfo();
  }, []);

  const loadTablesInfo = async () => {
    try {
      const db = await initDatabase();
      const tableNames = Array.from(db.objectStoreNames);
      
      const tableInfo: TableInfo[] = [];
      let totalRecords = 0;

      for (const name of tableNames) {
        const tx = db.transaction(name, 'readonly');
        const store = tx.objectStore(name);
        const countRequest = store.count();
        
        const count = await new Promise<number>((resolve) => {
          countRequest.onsuccess = () => resolve(countRequest.result);
        });

        totalRecords += count;

        const iconMap: Record<string, any> = {
          users: Users,
          documents: FileText,
          tasks: CheckSquare,
          meetings: Calendar,
          files: FileText,
          comments: FileText,
          history: FileText,
          approvals: CheckSquare,
          notifications: FileText,
          audit_logs: FileText,
          api_logs: FileText,
        };

        const colorMap: Record<string, string> = {
          users: 'bg-blue-100 text-blue-600',
          documents: 'bg-purple-100 text-purple-600',
          tasks: 'bg-green-100 text-green-600',
          meetings: 'bg-amber-100 text-amber-600',
          files: 'bg-pink-100 text-pink-600',
          comments: 'bg-cyan-100 text-cyan-600',
          history: 'bg-indigo-100 text-indigo-600',
          approvals: 'bg-orange-100 text-orange-600',
          notifications: 'bg-red-100 text-red-600',
          audit_logs: 'bg-slate-100 text-slate-600',
          api_logs: 'bg-gray-100 text-gray-600',
        };

        tableInfo.push({
          name,
          count,
          icon: iconMap[name] || Table,
          color: colorMap[name] || 'bg-gray-100 text-gray-600',
        });
      }

      setTables(tableInfo);
      setDbSize(`${totalRecords} записей`);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    setSelectedTable(tableName);
    
    try {
      const db = await initDatabase();
      const tx = db.transaction(tableName, 'readonly');
      const store = tx.objectStore(tableName);
      const request = store.getAll();

      const result = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      setData(result);
    } catch (error) {
      console.error('Error loading table data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const exportDatabase = async () => {
    try {
      const db = await initDatabase();
      const exportData: Record<string, any[]> = {};

      for (const tableName of Array.from(db.objectStoreNames)) {
        const tx = db.transaction(tableName, 'readonly');
        const store = tx.objectStore(tableName);
        const request = store.getAll();

        const data = await new Promise<any[]>((resolve) => {
          request.onsuccess = () => resolve(request.result);
        });

        // Convert ArrayBuffer to base64 for files
        const processedData = data.map(item => {
          const processed = { ...item };
          if (processed.data instanceof ArrayBuffer) {
            processed.data = '[Binary data - ' + processed.size + ' bytes]';
          }
          return processed;
        });

        exportData[tableName] = processedData;
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `esasy_pikir_db_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting database:', error);
      alert('Ошибка экспорта');
    }
  };

  const clearTable = async (tableName: string) => {
    if (!confirm(`Очистить таблицу "${tableName}"? Все данные будут удалены!`)) return;

    try {
      const db = await initDatabase();
      const tx = db.transaction(tableName, 'readwrite');
      const store = tx.objectStore(tableName);
      const request = store.clear();

      await new Promise<void>((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      await loadTablesInfo();
      if (selectedTable === tableName) {
        setData([]);
      }
    } catch (error) {
      console.error('Error clearing table:', error);
    }
  };

  const resetDatabase = async () => {
    if (!confirm('Полностью сбросить базу данных? Все данные будут удалены!')) return;

    try {
      const request = indexedDB.deleteDatabase('esasy_pikir_db');
      request.onsuccess = () => {
        alert('База данных сброшена. Перезагрузите страницу.');
        window.location.reload();
      };
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database size={24} className="text-blue-600" />
            Просмотр базы данных
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            IndexedDB (SQLite-like) • {dbSize}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportDatabase}
            className="btn-primary px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2"
          >
            <Download size={16} /> Экспорт
          </button>
          <button
            onClick={resetDatabase}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2 transition"
          >
            <Trash2 size={16} /> Сбросить БД
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>📍 Где находится база данных?</strong><br />
          Данные хранятся в <strong>IndexedDB</strong> браузера (встроенная БД, аналог SQLite).<br />
          Чтобы посмотреть напрямую: <code className="bg-blue-100 px-1 rounded">F12 → Application → IndexedDB → esasy_pikir_db</code>
        </p>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tables.map(table => (
          <button
            key={table.name}
            onClick={() => loadTableData(table.name)}
            className={`p-4 rounded-xl border-2 transition text-left ${
              selectedTable === table.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg ${table.color} flex items-center justify-center mb-2`}>
              <table.icon size={18} />
            </div>
            <p className="text-sm font-medium text-gray-900 truncate">{table.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{table.count} записей</p>
          </button>
        ))}
      </div>

      {/* Table Data */}
      {selectedTable && (
        <div className="bg-white rounded-2xl shadow-modern overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Таблица: <span className="text-blue-600">{selectedTable}</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => loadTableData(selectedTable)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium flex items-center gap-1 transition"
              >
                <RefreshCw size={12} /> Обновить
              </button>
              <button
                onClick={() => clearTable(selectedTable)}
                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium flex items-center gap-1 transition"
              >
                <Trash2 size={12} /> Очистить
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <RefreshCw size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-gray-500">Загрузка...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center">
              <Table size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Таблица пуста</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                  <tr>
                    {Object.keys(data[0] || {}).map(key => (
                      <th key={key} className="text-left px-3 py-2 font-semibold text-gray-600 border-r border-gray-200 whitespace-nowrap">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="px-3 py-2 text-gray-700 border-r border-gray-100 max-w-[200px] truncate">
                          {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) : String(value).slice(0, 100)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">📖 Инструкция</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• <strong>Экспорт</strong> - скачать все данные в JSON файл</li>
          <li>• <strong>Очистить таблицу</strong> - удалить все записи из выбранной таблицы</li>
          <li>• <strong>Сбросить БД</strong> - полностью удалить базу данных</li>
          <li>• <strong>Просмотр напрямую</strong> - F12 → Application → IndexedDB → esasy_pikir_db</li>
          <li>• <strong>Файлы</strong> хранятся как бинарные данные (ArrayBuffer)</li>
        </ul>
      </div>
    </div>
  );
}
