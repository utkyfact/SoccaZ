import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

import UsersManagement from './UsersManagement';
import ContentManagement from './ContentManagement';
import ContactContentManagement from './ContactContentManagement';
import MessagesManagement from './MessagesManagement';
import MatchOrganization from './MatchOrganization';
import DDoSMonitoring from './DDoSMonitoring';
import SiteSettings from './SiteSettings';

function ContentArea({ activeTab }) {
  const [stats, setStats] = useState({
    totalMatches: 0,
    activeMatches: 0,
    totalUsers: 0,
    totalParticipants: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  // Dashboard verilerini getir
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Maçları getir
      const matchesSnapshot = await getDocs(collection(db, 'matches'));
      const matchesData = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Kullanıcıları getir
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // İstatistikleri hesapla
      const totalMatches = matchesData.length;
      const activeMatches = matchesData.filter(match => match.status === 'active').length;
      const totalUsers = usersData.length;
      
      // Toplam katılımcı sayısı
      const totalParticipants = matchesData.reduce((total, match) => {
        return total + (match.participants?.length || 0);
      }, 0);

      // Son kullanıcıları getir
      const recentUsrs = usersData
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        })
        .slice(0, 5);

      setStats({
        totalMatches,
        activeMatches,
        totalUsers,
        totalParticipants
      });
      
      setRecentUsers(recentUsrs);
      
    } catch (error) {
      console.error('Fehler beim Abrufen der Dashboard-Daten:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard aktif olduğunda verileri getir
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const getContentTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Willkommen!';
      case 'users':
        return 'Benutzerliste';
      case 'content':
        return 'Inhaltsverwaltung';
      case 'contact':
        return 'Kontaktseite';
      case 'settings':
        return 'Einstellungen';
      default:
        return 'Willkommen!';
    }
  };

  const getContentDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Hier können Sie allgemeine Statistiken und Zusammenfassungen sehen.';
      case 'users':
        return 'Hier können Sie registrierte Benutzer verwalten.';
      case 'content':
        return 'Hier können Sie Inhalte verwalten.';
      case 'contact':
        return 'Hier können Sie die Kontaktseite verwalten.';
      case 'settings':
        return 'Hier können Sie alle Einstellungen für die Website verwalten.';
      default:
        return 'Hier können Sie allgemeine Statistiken und Zusammenfassungen sehen.';
    }
  };

  // Kullanıcılar bölümü için özel component
  if (activeTab === 'users') {
    return (
      <main className='flex-1 p-4 lg:p-6'>
        <UsersManagement />
      </main>
    );
  }

  // Maç organizasyonu bölümü için özel component
  if (activeTab === 'matches') {
    return (
      <main className='flex-1 p-4 lg:p-6'>
        <MatchOrganization />
      </main>
    );
  }

  // İçerik yönetimi bölümü için özel component
  if (activeTab === 'content') {
    return (
      <main className='flex-1 p-4 lg:p-6'>
        <ContentManagement />
      </main>
    );
  }

  // Mesajlar yönetimi bölümü için özel component
  if (activeTab === 'messages') {
    return (
      <main className='flex-1 p-4 lg:p-6'>
        <MessagesManagement />
      </main>
    );
  }

  // İletişim içeriği bölümü için özel component
  if (activeTab === 'contactcontent') {
    return (
      <main className='flex-1 p-4 lg:p-6'>
        <ContactContentManagement />
      </main>
    );
  }

  // DDoS Koruması monitoring
  if (activeTab === 'ddos') {
    return (
      <main className='flex-1 p-4 lg:p-6 bg-gray-50'>
        <DDoSMonitoring />
      </main>
    );
  }

  // Site Ayarları
  if (activeTab === 'settings') {
    return (
      <main className='flex-1 p-4 lg:p-6 bg-gray-50'>
        <SiteSettings />
      </main>
    );
  }

  // Dashboard - Ana sayfa
  return (
    <main className='flex-1 p-4 lg:p-6 bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-6 lg:mb-8'>
          <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
            {getContentTitle()}
          </h1>
          <p className='text-gray-600 text-sm lg:text-base'>
            {getContentDescription()}
          </p>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600'></div>
          </div>
        ) : (
          <>
            {/* İstatistik Kartları */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8'>
              <div className='bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-blue-100 text-blue-600'>
                    <span className='text-2xl'>⚽</span>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Gesamtspiele</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.totalMatches}</p>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-green-100 text-green-600'>
                    <span className='text-2xl'>🟢</span>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Aktive Spiele</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.activeMatches}</p>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-purple-100 text-purple-600'>
                    <span className='text-2xl'>👥</span>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Registrierte Benutzer</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-sm p-4 lg:p-6 border border-gray-200'>
                <div className='flex items-center'>
                  <div className='p-3 rounded-full bg-orange-100 text-orange-600'>
                    <span className='text-2xl'>🎯</span>
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>Gesamtteilnehmer</p>
                    <p className='text-2xl font-bold text-gray-900'>{stats.totalParticipants}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Son Kullanıcılar */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
              <div className='px-4 lg:px-6 py-4 border-b border-gray-200'>
                <h3 className='text-base lg:text-lg font-medium text-gray-900'>Zuletzt registrierte Benutzer</h3>
              </div>
              <div className='p-4 lg:p-6'>
                {recentUsers.length === 0 ? (
                  <p className='text-gray-500 text-center py-4'>Noch keine Benutzerregistrierungen vorhanden.</p>
                ) : (
                  <div className='space-y-4'>
                    {recentUsers.map((user) => (
                      <div key={user.id} className='flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0'>
                        <div className='flex items-center space-x-2 lg:space-x-3 min-w-0 flex-1'>
                          <div className='w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm lg:text-base'>
                            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <h4 className='font-medium text-gray-900 text-sm lg:text-base truncate'>
                              {user.displayName || 'Unbenannter Benutzer'}
                            </h4>
                            <p className='text-xs lg:text-sm text-gray-600 truncate'>{user.email}</p>
                          </div>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <p className='text-xs lg:text-sm text-gray-500'>
                            {user.createdAt?.toDate?.()?.toLocaleDateString('de-DE') || 'Datum fehlt'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default ContentArea; 