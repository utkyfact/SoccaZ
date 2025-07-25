import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

function SiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Site Genel Ayarları
    siteName: 'Turf Field',
    siteDescription: 'Turf Field ist eine Plattform für die Organisation von Fußballspielen',
    siteLogo: '',
    siteFavicon: '',
    
    // İletişim Bilgileri
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    contactWhatsapp: '',
    
    // Sosyal Medya
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    youtubeUrl: '',
    
    // Maç Ayarları
    defaultMaxParticipants: 20,
    allowPublicMatches: true,
    requireApprovalForMatches: false,
    matchDuration: 90, // dakika
    
    // Bildirim Ayarları
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSMSNotifications: false,
    
    // Güvenlik Ayarları
    enableTwoFactorAuth: false,
    requirePhoneVerification: true,
    maxLoginAttempts: 5,
    sessionTimeout: 24, // saat
    
    // PWA Ayarları
    enablePWA: true,
    pwaThemeColor: '#16a34a',
    pwaBackgroundColor: '#ffffff',
    
    // SEO Ayarları
    metaTitle: 'Turf Field - Fußballspiel-Organisation',
    metaDescription: 'Reservieren Sie einen Fußballplatz, organisieren Sie ein Spiel und spielen Sie mit Ihren Freunden.',
    metaKeywords: 'Fußballplatz, Reservierung, Fußball, Spielorganisation',
    
    // Bakım Modu
    maintenanceMode: false,
    maintenanceMessage: 'Website im Wartung, bitte später erneut versuchen.',
    
    // Analitik
    googleAnalyticsId: '',
    facebookPixelId: '',
    
    // Ödeme Ayarları (gelecekte)
    enablePayments: false,
    currency: 'EUR',
    
    // Dil ve Bölge
    defaultLanguage: 'de',
    timezone: 'Europe/Berlin',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24'
  });

  // Ayarları yükle
  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
      
      if (settingsDoc.exists()) {
        setSettings(prev => ({
          ...prev,
          ...settingsDoc.data()
        }));
      } else {
        // İlk kez oluştur
        await setDoc(doc(db, 'settings', 'site'), settings);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error);
      toast.error('Fehler beim Laden der Einstellungen.');
    } finally {
      setLoading(false);
    }
  };

  // Ayarları kaydet
  const saveSettings = async () => {
    try {
      setSaving(true);
      await updateDoc(doc(db, 'settings', 'site'), settings);
      toast.success('Einstellungen erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error);
      toast.error('Fehler beim Speichern der Einstellungen.');
    } finally {
      setSaving(false);
    }
  };

  // Input değişikliklerini handle et
  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Component mount olduğunda ayarları yükle
  useEffect(() => {
    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Einstellungen</h1>
        <p className="text-gray-600">Alle Einstellungen für die Website können hier verwaltet werden.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Allgemeine Einstellungen</h2>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Speichern...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>Speichern</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Site Genel Ayarları */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Website-Informationen</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website-Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website-Beschreibung</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo-URL</label>
                <input
                  type="url"
                  value={settings.siteLogo}
                  onChange={(e) => handleInputChange('siteLogo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Kontaktinformationen</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefonnummer</label>
                <input
                  type="tel"
                  value={settings.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp-Nummer</label>
                <input
                  type="tel"
                  value={settings.contactWhatsapp}
                  onChange={(e) => handleInputChange('contactWhatsapp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="017xxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea
                  value={settings.contactAddress}
                  onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Sozial Media</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook-URL</label>
                <input
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram-URL</label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter-URL</label>
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube-URL</label>
                <input
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Maç Ayarları */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Spiel-Einstellungen</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard-Maximale Teilnehmer</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.defaultMaxParticipants}
                  onChange={(e) => handleInputChange('defaultMaxParticipants', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spieldauer (Minuten)</label>
                <input
                  type="number"
                  min="30"
                  max="180"
                  value={settings.matchDuration}
                  onChange={(e) => handleInputChange('matchDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="allowPublicMatches"
                  checked={settings.allowPublicMatches}
                  onChange={(e) => handleInputChange('allowPublicMatches', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="allowPublicMatches" className="text-sm font-medium text-gray-700">
                  Öffentliche Spiele erlauben
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="requireApprovalForMatches"
                  checked={settings.requireApprovalForMatches}
                  onChange={(e) => handleInputChange('requireApprovalForMatches', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="requireApprovalForMatches" className="text-sm font-medium text-gray-700">
                  Zustimmung für Spiele erforderlich
                </label>
              </div>
            </div>

            {/* Bildirim Ayarları */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Benachrichtigungseinstellungen</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableEmailNotifications"
                  checked={settings.enableEmailNotifications}
                  onChange={(e) => handleInputChange('enableEmailNotifications', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="enableEmailNotifications" className="text-sm font-medium text-gray-700">
                  E-Mail-Benachrichtigungen
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enablePushNotifications"
                  checked={settings.enablePushNotifications}
                  onChange={(e) => handleInputChange('enablePushNotifications', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="enablePushNotifications" className="text-sm font-medium text-gray-700">
                  Push-Benachrichtigungen
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableSMSNotifications"
                  checked={settings.enableSMSNotifications}
                  onChange={(e) => handleInputChange('enableSMSNotifications', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="enableSMSNotifications" className="text-sm font-medium text-gray-700">
                  SMS-Benachrichtigungen
                </label>
              </div>
            </div>

            {/* Güvenlik Ayarları */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Sicherheits-Einstellungen</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableTwoFactorAuth"
                  checked={settings.enableTwoFactorAuth}
                  onChange={(e) => handleInputChange('enableTwoFactorAuth', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="enableTwoFactorAuth" className="text-sm font-medium text-gray-700">
                  Zwei-Faktor-Authentifizierung
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="requirePhoneVerification"
                  checked={settings.requirePhoneVerification}
                  onChange={(e) => handleInputChange('requirePhoneVerification', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="requirePhoneVerification" className="text-sm font-medium text-gray-700">
                  Telefon-Authentifizierung erforderlich
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximale Anmeldeversuche</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sitzungsdauer (Stunden)</label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* SEO Ayarları */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">SEO-Einstellungen</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta-Titel</label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta-Beschreibung</label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics-ID</label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>

            {/* Bakım Modu */}
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-gray-800 border-b border-gray-200 pb-2">Wartungsmodus</h3>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
                  Wartungsmodus aktivieren
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wartungsmeldung</label>
                <textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteSettings; 