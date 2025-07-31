import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Local storage'dan direkt kontrol et
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const decline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

          {/* Sol Taraf - İçerik */}
          <div className="flex-1">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cookie-Richtlinie 🍪
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Wir verwenden Cookies, um Ihr Erlebnis auf unserer Website zu verbessern.
                  Diese Cookies verbessern die Leistung unserer Website und bieten Ihnen personalisierte Inhalte.
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">Erforderliche Cookies</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Analytische Cookies</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">Funktionale Cookies</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Butonlar */}
          <div className="flex gap-3 flex-shrink-0">
            {/* Detaylı Bilgi */}
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors duration-200"
            >
              Detaillierte Informationen
            </Link>
            {/* Reddet */}
            <button
              onClick={decline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Ablehnen
            </button>

            {/* Tümünü Kabul Et */}
            <button
              onClick={acceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Sie können Ihre Cookie-Einstellungen jederzeit{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-700 underline">
              Datenschutzrichtlinie
            </Link>{' '}
            unserer Website ändern.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner; 