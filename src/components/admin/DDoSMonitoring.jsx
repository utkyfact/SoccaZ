import React, { useState, useEffect } from 'react';
import { ddosProtection } from '../../utils/advancedRateLimiter';

function DDoSMonitoring() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    blockedIPs: 0,
    suspiciousActivities: 0,
    activeRateLimits: 0
  });
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    // İlk yüklemede stats'ı al
    updateStats();
    
    // Her 5 saniyede bir güncelle
    const interval = setInterval(updateStats, 5000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const updateStats = () => {
    const currentStats = ddosProtection.getStats();
    setStats(currentStats);
  };

  const getThreatLevel = () => {
    const { suspiciousActivities, blockedIPs } = stats;
    
    if (blockedIPs > 5 || suspiciousActivities > 20) {
      return { level: 'HIGH', color: 'red', icon: '🚨' };
    } else if (blockedIPs > 0 || suspiciousActivities > 5) {
      return { level: 'MEDIUM', color: 'yellow', icon: '⚠️' };
    } else {
      return { level: 'LOW', color: 'green', icon: '✅' };
    }
  };

  const threat = getThreatLevel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">DDoS Koruması Monitoring</h2>
        <div className={`px-4 py-2 rounded-lg bg-${threat.color}-100 text-${threat.color}-800 font-semibold`}>
          {threat.icon} Tehdit Seviyesi: {threat.level}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam İstek</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalRequests}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bloklu IP</p>
              <p className="text-2xl font-bold text-red-600">{stats.blockedIPs}</p>
            </div>
            <div className="text-3xl">🚫</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Şüpheli Aktivite</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.suspiciousActivities}</p>
            </div>
            <div className="text-3xl">🔍</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aktif Rate Limit</p>
              <p className="text-2xl font-bold text-purple-600">{stats.activeRateLimits}</p>
            </div>
            <div className="text-3xl">⏱️</div>
          </div>
        </div>
      </div>

      {/* DDoS Protection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Koruma Durumu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">✅ Application Rate Limiting</span>
              <span className="text-green-600 text-sm">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">✅ IP Blocking</span>
              <span className="text-green-600 text-sm">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">✅ Bot Detection</span>
              <span className="text-green-600 text-sm">Aktif</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">✅ Input Sanitization</span>
              <span className="text-green-600 text-sm">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-800 font-medium">✅ Firebase Security Rules</span>
              <span className="text-green-600 text-sm">Aktif</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-800 font-medium">⚠️ Cloudflare CDN</span>
              <span className="text-yellow-600 text-sm">Önerilen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limit Konfigürasyonu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Rate Limit Ayarları</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Aksiyon</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Limit</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Zaman Penceresi</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2">Login</td>
                <td className="px-4 py-2">5 istek</td>
                <td className="px-4 py-2">15 dakika</td>
                <td className="px-4 py-2"><span className="text-green-600">✅ Aktif</span></td>
              </tr>
              <tr>
                <td className="px-4 py-2">Register</td>
                <td className="px-4 py-2">3 istek</td>
                <td className="px-4 py-2">1 saat</td>
                <td className="px-4 py-2"><span className="text-green-600">✅ Aktif</span></td>
              </tr>
              <tr>
                <td className="px-4 py-2">Contact</td>
                <td className="px-4 py-2">3 istek</td>
                <td className="px-4 py-2">5 dakika</td>
                <td className="px-4 py-2"><span className="text-green-600">✅ Aktif</span></td>
              </tr>
              <tr>
                <td className="px-4 py-2">Form Submit</td>
                <td className="px-4 py-2">10 istek</td>
                <td className="px-4 py-2">1 dakika</td>
                <td className="px-4 py-2"><span className="text-green-600">✅ Aktif</span></td>
              </tr>
              <tr>
                <td className="px-4 py-2">API Call</td>
                <td className="px-4 py-2">100 istek</td>
                <td className="px-4 py-2">1 dakika</td>
                <td className="px-4 py-2"><span className="text-green-600">✅ Aktif</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Manuel Kontroller</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              ddosProtection.cleanup();
              updateStats();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🧹 Cache Temizle
          </button>
          <button
            onClick={updateStats}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            🔄 Yenile
          </button>
          <button
            onClick={() => {
              // Test amaçlı şüpheli aktivite ekle
              ddosProtection.recordSuspiciousActivity('127.0.0.1', 'test_activity');
              updateStats();
            }}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            🧪 Test Şüpheli Aktivite
          </button>
        </div>
      </div>

      {/* Öneriler */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Güvenlik Önerileri</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Cloudflare CDN kullanarak infrastructure level DDoS koruması ekleyin</li>
          <li>• Firebase Security Rules'ı düzenli olarak güncelleyin</li>
          <li>• Şüpheli IP adreslerini manuel olarak takip edin</li>
          <li>• Rate limit değerlerini trafiğinize göre ayarlayın</li>
          <li>• Monitoring alertleri kurun (email/SMS)</li>
        </ul>
      </div>
    </div>
  );
}

export default DDoSMonitoring; 