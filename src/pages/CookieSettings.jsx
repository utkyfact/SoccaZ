import React, { useState } from 'react';
import { useCookie } from '../context/CookieContext';
import { toast } from 'react-toastify';

function CookieSettings() {
    const { cookieConsent, updateCookieConsent, resetCookieConsent, exportCookiePreferences } = useCookie();
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: cookieConsent === 'all',
        functional: cookieConsent === 'all',
        marketing: cookieConsent === 'all'
    });

    const handleSave = () => {
        if (preferences.analytics && preferences.functional && preferences.marketing) {
            updateCookieConsent('all');
            toast.success('Tüm çerez tercihleri kaydedildi!');
        } else if (preferences.necessary) {
            updateCookieConsent('necessary');
            toast.success('Sadece gerekli çerezler kaydedildi!');
        } else {
            updateCookieConsent('declined');
            toast.success('Çerez tercihleri güncellendi!');
        }
    };

    const handleReset = () => {
        resetCookieConsent();
        setPreferences({
            necessary: true,
            analytics: false,
            functional: false,
            marketing: false
        });
        toast.info('Çerez tercihleri sıfırlandı!');
    };

    const exportPreferences = () => {
        const data = exportCookiePreferences();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cookie-preferences.json';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Çerez tercihleri dışa aktarıldı!');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Çerez Tercihleri 🍪</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Web sitemizde kullanılan çerezler hakkında bilgi alın ve tercihlerinizi yönetin.
                    </p>
                </div>

                {/* Mevcut Durum */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Mevcut Durum</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Çerez Onayı:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                cookieConsent === 'all' ? 'bg-green-100 text-green-800' :
                                cookieConsent === 'necessary' ? 'bg-yellow-100 text-yellow-800' :
                                cookieConsent === 'declined' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {cookieConsent === 'all' ? 'Tümü Kabul Edildi' :
                                 cookieConsent === 'necessary' ? 'Sadece Gerekli' :
                                 cookieConsent === 'declined' ? 'Reddedildi' : 'Belirlenmedi'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Son Güncelleme:</span>
                            <span className="text-sm text-gray-600">
                                {cookieConsent ? new Date(localStorage.getItem('cookieConsentDate')).toLocaleDateString('tr-TR') : 'Yok'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Çerez Kategorileri */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Çerez Kategorileri</h2>
                    
                    {/* Zorunlu Çerezler */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Zorunlu Çerezler</h3>
                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Her Zaman Aktif</span>
                                </div>
                                <p className="text-gray-600 mb-3">
                                    Web sitesinin temel işlevlerini sağlamak için gerekli olan çerezlerdir. 
                                    Bu çerezler olmadan site düzgün çalışamaz.
                                </p>
                                <ul className="text-sm text-gray-500 space-y-1">
                                    <li>• Oturum yönetimi ve güvenlik</li>
                                    <li>• Dil ve bölge tercihleri</li>
                                    <li>• Form verilerinin geçici saklanması</li>
                                </ul>
                            </div>
                            <div className="ml-6">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analitik Çerezler */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Analitik Çerezler</h3>
                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">İsteğe Bağlı</span>
                                </div>
                                <p className="text-gray-600 mb-3">
                                    Site kullanımını analiz etmek ve performansı iyileştirmek için kullanılır.
                                </p>
                                <ul className="text-sm text-gray-500 space-y-1">
                                    <li>• Sayfa görüntüleme istatistikleri</li>
                                    <li>• Kullanıcı davranış analizi</li>
                                    <li>• Site performans metrikleri</li>
                                </ul>
                            </div>
                            <div className="ml-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Fonksiyonel Çerezler */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Fonksiyonel Çerezler</h3>
                                    <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">İsteğe Bağlı</span>
                                </div>
                                <p className="text-gray-600 mb-3">
                                    Kullanıcı deneyimini geliştirmek için kişiselleştirme özellikleri sağlar.
                                </p>
                                <ul className="text-sm text-gray-500 space-y-1">
                                    <li>• Tema ve görünüm tercihleri</li>
                                    <li>• Bildirim ayarları</li>
                                    <li>• Sosyal medya entegrasyonu</li>
                                </ul>
                            </div>
                            <div className="ml-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.functional}
                                        onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Pazarlama Çerezleri */}
                    <div className="pb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Pazarlama Çerezleri</h3>
                                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">İsteğe Bağlı</span>
                                </div>
                                <p className="text-gray-600 mb-3">
                                    Reklam ve pazarlama amaçlı kullanılan çerezlerdir.
                                </p>
                                <ul className="text-sm text-gray-500 space-y-1">
                                    <li>• Hedefli reklamlar</li>
                                    <li>• Sosyal medya reklamları</li>
                                    <li>• Kampanya takibi</li>
                                </ul>
                            </div>
                            <div className="ml-6">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aksiyon Butonları */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Tercihleri Yönet</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Tercihleri Kaydet
                        </button>
                        
                        <button
                            onClick={handleReset}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Sıfırla
                        </button>
                        
                        <button
                            onClick={exportPreferences}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Dışa Aktar
                        </button>
                    </div>
                </div>

                {/* Bilgilendirme */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-medium text-blue-900 mb-2">Önemli Bilgi</h3>
                            <p className="text-blue-800 text-sm leading-relaxed">
                                Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz. Değişiklikler anında uygulanır ve 
                                tarayıcınızda saklanır. Daha detaylı bilgi için{' '}
                                <a href="/privacy" className="underline font-medium">Gizlilik Politikamızı</a> inceleyebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CookieSettings; 