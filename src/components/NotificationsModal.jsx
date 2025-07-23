import React from 'react';
import { useNotifications } from '../context/NotificationContext';

function NotificationsModal({ isOpen, onClose }) {
  const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-fade-in">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none cursor-pointer"
          aria-label="Schließen"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-800">Benachrichtigungen</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-sm">Gesamt: {notifications.length}</span>
          <button
            onClick={markAllAsRead}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm disabled:opacity-50 cursor-pointer"
            disabled={notifications.every(n => n.read) || loading}
          >
            Alle als gelesen markieren
          </button>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Benachrichtigungen werden geladen...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-2">🔔</div>
            <p>Sie haben noch keine Benachrichtigungen</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row sm:items-center gap-2 cursor-pointer transition-colors duration-200 ${
                  notification.read ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-300'
                }`}
                onClick={() => {
                  if (!notification.read) markAsRead(notification.id);
                  if (notification.link) window.location.href = notification.link;
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></span>
                    <span className={`font-medium text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>{notification.title}</span>
                    {!notification.read && <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>}
                  </div>
                  <div className={`text-xs ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>{notification.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{notification.createdAt?.toDate().toLocaleString('tr-TR')}</div>
                  {notification.link && (
                    <div className="mt-1">
                      <span className="inline-block text-green-700 text-xs bg-green-100 px-2 py-0.5 rounded">Verlinkt</span>
                    </div>
                  )}
                </div>
                {!notification.read && (
                  <button
                    onClick={e => { e.stopPropagation(); markAsRead(notification.id); }}
                    className="text-xs text-green-700 border border-green-300 rounded px-2 py-1 hover:bg-green-100"
                  >
                    Als gelesen markieren
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsModal; 