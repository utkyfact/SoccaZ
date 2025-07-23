import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout';
import { Link } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

function Homepage() {
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Anasayfa içeriklerini Firebase'den yükle
  const loadContent = async () => {
    try {
      const contentDoc = await getDoc(doc(db, 'settings', 'homepage'));
      if (contentDoc.exists()) {
        setContentData(contentDoc.data());
      } else {
        setContentData(null);
      }
    } catch (error) {
      console.error('İçerik yüklenirken hata:', error);
      setContentData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
    
    // PWA Install Prompt'u yakala - Sadece production'da
    if (import.meta.env.PROD) {
      const handleBeforeInstallPrompt = (e) => {
        // Varsayılan browser prompt'unu engelle
        e.preventDefault();
        
        // 24 saat içinde kapat denmiş mi kontrol et
        const dismissedTime = localStorage.getItem('pwa-banner-dismissed');
        if (dismissedTime) {
          const now = Date.now();
          const timeDiff = now - parseInt(dismissedTime);
          const hoursPassedSinceDismiss = timeDiff / (1000 * 60 * 60);
          
          // 24 saat geçmemişse banner gösterme
          if (hoursPassedSinceDismiss < 24) {
            return;
          }
        }
        
        // Event'i sakla
        setDeferredPrompt(e);
        // Banner'ı göster
        setShowInstallBanner(true);
      };

      // Event listener ekle
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Temizleme
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  // PWA Install fonksiyonu
  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      toast.info('Uygulama zaten yüklenmiş veya bu cihazda desteklenmiyor.');
      return;
    }

    // Install prompt'unu göster
    deferredPrompt.prompt();
    
    // Kullanıcının seçimini bekle
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success('SoccaZ uygulaması ana ekrana eklendi! 🎉');
    } else {
      toast.info('Uygulama yükleme iptal edildi.');
    }
    
    // Prompt'u temizle
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  // Banner'ı kapat
  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    // 24 saat sonra tekrar göster
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString());
  };

  // Loading durumunda
  if (loading) {
    return (
      <Layout>
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Sayfa yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!contentData) {
    return (
      <Layout>
        <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center'>
          <div className="text-center">
            <p className="text-gray-600 text-lg">İçerik bulunamadı. Lütfen yöneticiye başvurun.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center gap-8 px-4'>
        {/* Hero Section */}
        <div className='text-center max-w-4xl'>
          <img src="/SoccaZ.png" alt="logo" className='w-52 h-52 mx-auto' />
          <h1 className='text-5xl font-bold text-gray-800 mb-4'>
            {contentData?.hero?.title}
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            {contentData?.hero?.subtitle}
          </p>
        </div>

        {/* PWA Install Banner */}
        {showInstallBanner && (
                     <div className='w-auto max-w-md bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-2xl border border-green-300 animate-bounce-in fixed bottom-4 left-2 right-2 z-50 md:relative md:bottom-auto md:left-auto md:right-auto md:z-auto md:w-full md:max-w-md md:mx-auto'>
            <div className='p-6 text-white relative overflow-hidden'>
              {/* Arka plan dekoratif elemanlar */}
              <div className='absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-green-400 rounded-full opacity-20'></div>
              <div className='absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-green-400 rounded-full opacity-20'></div>
              
              {/* İçerik */}
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center'>
                      <img src="/SoccaZ.png" alt="SoccaZ" className='w-10 h-10' />
                    </div>
                    <div>
                      <h3 className='font-bold text-lg'>SoccaZ Uygulaması</h3>
                      <p className='text-green-100 text-sm'>Ana Ekrana Ekle</p>
                    </div>
                  </div>
                  <button
                    onClick={dismissInstallBanner}
                    className='text-green-200 hover:text-white transition-colors duration-200 p-1 cursor-pointer'
                  >
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                
                <p className='text-green-100 text-sm mb-6 leading-relaxed'>
                  📱 Lade SoccaZ auf dein Handy herunter! Nimm mit einem Klick an Fußballspielen teil, erhalte Benachrichtigungen und greife offline darauf zu.
                </p>
                
                <div className='flex space-x-3'>
                  <button
                    onClick={handleInstallApp}
                    className='flex-1 bg-white text-green-600 px-4 py-3 rounded-lg font-bold text-sm hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                    </svg>
                    <span>Installieren</span>
                  </button>
                  <button
                    onClick={dismissInstallBanner}
                    className='px-4 py-3 border-2 border-green-300 text-green-100 rounded-lg font-medium text-sm hover:bg-green-400 hover:bg-opacity-20 transition-all duration-200 cursor-pointer'
                  >
                    Später
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex justify-center'>
          <Link
            to="/matches"
            className='bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          >
            ⚽ Nimm an den Spielen teil
          </Link>
        </div>

        {/* Features */}
        {contentData?.features && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl'>
            {contentData.features.map((feature) => (
              <div key={feature.id} className='bg-white p-6 rounded-lg shadow-sm text-center'>
                <div className='text-4xl mb-4'>{feature.icon}</div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{feature.title}</h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        {contentData?.info && (
          <div className='bg-white p-8 rounded-lg shadow-sm max-w-4xl my-8'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 text-center'>
              {contentData.info.title}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* İlk yarı */}
              <div className='space-y-3'>
                {contentData.info.items.slice(0, Math.ceil(contentData.info.items.length / 2)).map((item, index) => (
                  <div key={index} className='flex items-center'>
                    <span className='text-green-600 mr-3'>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {/* İkinci yarı */}
              <div className='space-y-3'>
                {contentData.info.items.slice(Math.ceil(contentData.info.items.length / 2)).map((item, index) => (
                  <div key={index} className='flex items-center'>
                    <span className='text-green-600 mr-3'>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Homepage;