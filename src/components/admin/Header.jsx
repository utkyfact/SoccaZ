import React from 'react';

function Header({ activeTab }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'fields':
        return 'Sahalar Yönetimi';
      case 'reservations':
        return 'Rezervasyonlar';
      case 'users':
        return 'Kullanıcı Yönetimi';
      case 'prices':
        return 'Fiyat Yönetimi';
      case 'settings':
        return 'Sistem Ayarları';
      default:
        return 'Dashboard';
    }
  };

  const getDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Genel istatistikler ve özet bilgiler';
      case 'fields':
        return 'Halı sahaları ekle, düzenle ve yönet';
      case 'reservations':
        return 'Tüm rezervasyonları görüntüle ve yönet';
      case 'users':
        return 'Kullanıcı hesaplarını yönet';
      case 'prices':
        return 'Saha fiyatlarını ayarla';
      case 'settings':
        return 'Sistem ayarlarını yapılandır';
      default:
        return 'Genel istatistikler ve özet bilgiler';
    }
  };

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>
            {getTitle()}
          </h1>
          <p className='text-gray-600 mt-1'>
            {getDescription()}
          </p>
        </div>
        <div className='flex items-center space-x-4'>
          <button className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200'>
            🔔 Bildirimler
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header; 