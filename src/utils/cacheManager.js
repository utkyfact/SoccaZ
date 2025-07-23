// Cache Management Utility

export const clearAllCaches = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      return true;
    } catch (error) {
      console.error('❌ Cache temizlenirken hata:', error);
      return false;
    }
  }
  return false;
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
      return true;
    } catch (error) {
      console.error('❌ Service Worker silinirken hata:', error);
      return false;
    }
  }
  return false;
};

export const clearStorageData = () => {
  try {
    // PWA banner cache'ini temizle
    localStorage.removeItem('pwa-banner-dismissed');
    return true;
  } catch (error) {
    console.error('❌ Storage temizlenirken hata:', error);
    return false;
  }
};

// Development mode'da cache problemlerini çözmek için
export const developmentCacheFix = async () => {
  if (import.meta.env.DEV) {
    await clearAllCaches();
    await unregisterServiceWorker();
    clearStorageData();
    return true;
  }
  return false;
};

// PWA sorunlarını debug etmek için (silent mode)
export const debugPWAStatus = () => {
  return {
    environment: import.meta.env.MODE,
    production: import.meta.env.PROD,
    serviceWorkerSupport: 'serviceWorker' in navigator,
    currentUrl: window.location.href
  };
}; 