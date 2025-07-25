import React, { createContext, useContext, useState, useEffect } from 'react';

const CookieContext = createContext();

export const useCookie = () => {
    const context = useContext(CookieContext);
    if (!context) {
        throw new Error('useCookie must be used within a CookieProvider');
    }
    return context;
};

export const CookieProvider = ({ children }) => {
    const [cookieConsent, setCookieConsent] = useState(null);
    const [cookieDate, setCookieDate] = useState(null);

    // Local storage'dan çerez tercihlerini yükle
    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        const date = localStorage.getItem('cookieConsentDate');
        
        if (consent) {
            setCookieConsent(consent);
            setCookieDate(date);
        }
    }, []);

    // Çerez tercihlerini güncelle
    const updateCookieConsent = (consent) => {
        const timestamp = new Date().toISOString();
        setCookieConsent(consent);
        setCookieDate(timestamp);
        localStorage.setItem('cookieConsent', consent);
        localStorage.setItem('cookieConsentDate', timestamp);
    };

    // Çerez tercihlerini sıfırla
    const resetCookieConsent = () => {
        setCookieConsent(null);
        setCookieDate(null);
        localStorage.removeItem('cookieConsent');
        localStorage.removeItem('cookieConsentDate');
    };

    // Çerez tercihlerini kontrol et
    const hasConsent = (type) => {
        if (!cookieConsent) return false;
        
        switch (type) {
            case 'all':
                return cookieConsent === 'all';
            case 'necessary':
                return cookieConsent === 'necessary' || cookieConsent === 'all';
            case 'analytics':
                return cookieConsent === 'all';
            case 'functional':
                return cookieConsent === 'all';
            default:
                return false;
        }
    };

    // Çerez tercihlerini dışa aktar
    const exportCookiePreferences = () => {
        return {
            consent: cookieConsent,
            date: cookieDate,
            preferences: {
                necessary: hasConsent('necessary'),
                analytics: hasConsent('analytics'),
                functional: hasConsent('functional'),
                all: hasConsent('all')
            }
        };
    };

    const value = {
        cookieConsent,
        cookieDate,
        updateCookieConsent,
        resetCookieConsent,
        hasConsent,
        exportCookiePreferences
    };

    return (
        <CookieContext.Provider value={value}>
            {children}
        </CookieContext.Provider>
    );
}; 