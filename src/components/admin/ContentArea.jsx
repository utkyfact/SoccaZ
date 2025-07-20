import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import FieldsManagement from './FieldsManagement';
import ReservationsManagement from './ReservationsManagement';
import UsersManagement from './UsersManagement';

function ContentArea({ activeTab }) {
  const [stats, setStats] = useState({
    totalFields: 0,
    activeFields: 0,
    totalReservations: 0,
    activeReservations: 0,
    totalUsers: 0,
    todayReservations: 0,
    thisWeekReservations: 0,
    thisMonthReservations: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentReservations, setRecentReservations] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // Geçmiş rezervasyonları otomatik tamamlandı yap
  const autoCompletePastReservations = async (reservationsData) => {
    const now = new Date();
    const pastReservations = reservationsData.filter(reservation => {
      if (reservation.status !== 'active') return false;
      
      const reservationDate = reservation.date.toDate ? reservation.date.toDate() : new Date(reservation.date);
      const reservationTime = reservation.time;
      
      if (!reservationTime) return false;
      
      // Rezervasyon tarihini ve saatini birleştir
      const [hours, minutes] = reservationTime.split(':').map(Number);
      reservationDate.setHours(hours, minutes, 0, 0);
      
      // Rezervasyon saati geçmiş mi kontrol et
      return reservationDate < now;
    });

    // Geçmiş rezervasyonları güncelle
    const updatePromises = pastReservations.map(reservation =>
      updateDoc(doc(db, 'reservations', reservation.id), {
        status: 'completed',
        updatedAt: new Date(),
        autoCompleted: true
      })
    );

    if (updatePromises.length > 0) {
      try {
        await Promise.all(updatePromises);
        return true;
      } catch (error) {
        console.error('Otomatik tamamlama hatası:', error);
        return false;
      }
    }
    
    return false;
  };

  // Dashboard verilerini getir
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Sahaları getir
      const fieldsSnapshot = await getDocs(collection(db, 'fields'));
      const fieldsData = fieldsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Rezervasyonları getir
      const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
      const reservationsData = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Geçmiş rezervasyonları kontrol et ve güncelle
      const wasUpdated = await autoCompletePastReservations(reservationsData);
      
      // Eğer güncelleme yapıldıysa rezervasyonları tekrar getir
      if (wasUpdated) {
        const updatedReservationsSnapshot = await getDocs(collection(db, 'reservations'));
        const updatedReservationsData = updatedReservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Güncellenmiş verileri kullan
        reservationsData.length = 0;
        reservationsData.push(...updatedReservationsData);
      }
      
      // Kullanıcıları getir
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Bugünün tarihi
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Bu haftanın başlangıcı (Pazartesi)
      const thisWeek = new Date(today);
      thisWeek.setDate(today.getDate() - today.getDay() + 1);
      
      // Bu ayın başlangıcı
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // İstatistikleri hesapla
      const totalFields = fieldsData.length;
      const activeFields = fieldsData.filter(field => field.isActive !== false).length;
      const totalReservations = reservationsData.length;
      const activeReservations = reservationsData.filter(res => res.status === 'active').length;
      const totalUsers = usersData.length;
      
      // Tarih bazlı rezervasyonlar
      const todayReservations = reservationsData.filter(res => {
        const resDate = res.date.toDate ? res.date.toDate() : new Date(res.date);
        return resDate >= today;
      }).length;
      
      const thisWeekReservations = reservationsData.filter(res => {
        const resDate = res.date.toDate ? res.date.toDate() : new Date(res.date);
        return resDate >= thisWeek;
      }).length;
      
      const thisMonthReservations = reservationsData.filter(res => {
        const resDate = res.date.toDate ? res.date.toDate() : new Date(res.date);
        return resDate >= thisMonth;
      }).length;

      // Son rezervasyonlar (son 5 tanesi)
      const recentRes = reservationsData
        .sort((a, b) => {
          const dateA = a.date.toDate ? a.date.toDate() : new Date(a.date);
          const dateB = b.date.toDate ? b.date.toDate() : new Date(b.date);
          return dateB - dateA;
        })
        .slice(0, 5);

      // Son kullanıcılar (son 5 tanesi)
      const recentUsrs = usersData
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        })
        .slice(0, 5);

      setStats({
        totalFields,
        activeFields,
        totalReservations,
        activeReservations,
        totalUsers,
        todayReservations,
        thisWeekReservations,
        thisMonthReservations
      });
      
      setRecentReservations(recentRes);
      setRecentUsers(recentUsrs);
      
    } catch (error) {
      console.error('Dashboard verileri getirilirken hata:', error);
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
        return 'Hoş geldiniz! 🎉';
      case 'fields':
        return 'Sahalar Listesi';
      case 'reservations':
        return 'Rezervasyon Listesi';
      case 'users':
        return 'Kullanıcı Listesi';
      case 'prices':
        return 'Fiyat Listesi';
      case 'settings':
        return 'Sistem Ayarları';
      default:
        return 'Hoş geldiniz! 🎉';
    }
  };

  const getContentDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Bu bölümde genel istatistikleri ve özet bilgileri görebilirsiniz.';
      case 'fields':
        return 'Halı sahalarınızı buradan yönetebilirsiniz.';
      case 'reservations':
        return 'Tüm rezervasyonları buradan görüntüleyebilir ve yönetebilirsiniz.';
      case 'users':
        return 'Kayıtlı kullanıcıları buradan yönetebilirsiniz.';
      case 'prices':
        return 'Saha fiyatlarını buradan ayarlayabilirsiniz.';
      case 'settings':
        return 'Sistem ayarlarını buradan yapılandırabilirsiniz.';
      default:
        return 'Bu bölümde genel istatistikleri ve özet bilgileri görebilirsiniz.';
    }
  };

  // Sahalar bölümü için özel component
  if (activeTab === 'fields') {
    return (
      <main className='flex-1 p-6'>
        <FieldsManagement />
      </main>
    );
  }

  // Rezervasyonlar bölümü için özel component
  if (activeTab === 'reservations') {
    return (
      <main className='flex-1 p-6'>
        <ReservationsManagement />
      </main>
    );
  }

  // Kullanıcılar bölümü için özel component
  if (activeTab === 'users') {
    return (
      <main className='flex-1 p-6'>
        <UsersManagement />
      </main>
    );
  }

  // Dashboard bölümü için özel içerik
  if (activeTab === 'dashboard') {
    return (
      <main className='flex-1 p-6'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex justify-between items-center mb-6'>
            <div>
              <h2 className='text-xl font-semibold text-gray-800'>
                {getContentTitle()}
              </h2>
              <p className='text-gray-600'>
                {getContentDescription()}
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer'
            >
              {loading ? '🔄' : '🔄 Yenile'}
            </button>
          </div>
          
          {loading ? (
            <div className='text-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Veriler yükleniyor...</p>
            </div>
          ) : (
            <>
              {/* Ana İstatistikler */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-blue-100 text-sm font-medium'>Toplam Saha</p>
                      <p className='text-2xl font-bold'>{stats.totalFields}</p>
                      <p className='text-blue-200 text-xs mt-1'>{stats.activeFields} aktif</p>
                    </div>
                    <div className='text-blue-200'>
                      <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-green-100 text-sm font-medium'>Rezervasyonlar</p>
                      <p className='text-2xl font-bold'>{stats.totalReservations}</p>
                      <p className='text-green-200 text-xs mt-1'>{stats.activeReservations} aktif</p>
                    </div>
                    <div className='text-green-200'>
                      <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className='bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-purple-100 text-sm font-medium'>Toplam Kullanıcı</p>
                      <p className='text-2xl font-bold'>{stats.totalUsers}</p>
                      <p className='text-purple-200 text-xs mt-1'>kayıtlı</p>
                    </div>
                    <div className='text-purple-200'>
                      <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className='bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-orange-100 text-sm font-medium'>Bugün</p>
                      <p className='text-2xl font-bold'>{stats.todayReservations}</p>
                      <p className='text-orange-200 text-xs mt-1'>rezervasyon</p>
                    </div>
                    <div className='text-orange-200'>
                      <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detay İstatistikler */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Haftalık Rezervasyon</h3>
                  <div className='text-center'>
                    <p className='text-3xl font-bold text-green-600'>{stats.thisWeekReservations}</p>
                    <p className='text-gray-600 text-sm'>Bu hafta</p>
                  </div>
                </div>
                
                <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Aylık Rezervasyon</h3>
                  <div className='text-center'>
                    <p className='text-3xl font-bold text-blue-600'>{stats.thisMonthReservations}</p>
                    <p className='text-gray-600 text-sm'>Bu ay</p>
                  </div>
                </div>

                <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Aktif Sahalar</h3>
                  <div className='text-center'>
                    <p className='text-3xl font-bold text-purple-600'>{stats.activeFields}</p>
                    <p className='text-gray-600 text-sm'>Toplam {stats.totalFields} sahadan</p>
                  </div>
                </div>
              </div>

              {/* Son Aktiviteler */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Son Rezervasyonlar */}
                <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Son Rezervasyonlar</h3>
                  {recentReservations.length === 0 ? (
                    <p className='text-gray-500 text-center py-4'>Henüz rezervasyon yok</p>
                  ) : (
                    <div className='space-y-3'>
                      {recentReservations.map((reservation) => (
                        <div key={reservation.id} className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                          <div>
                            <p className='font-medium text-gray-800'>{reservation.fieldName}</p>
                            <p className='text-sm text-gray-600'>
                              {reservation.userName} • {reservation.time}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            reservation.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {reservation.status === 'active' ? 'Aktif' : 'İptal'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Son Kullanıcılar */}
                <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Son Kayıt Olan Kullanıcılar</h3>
                  {recentUsers.length === 0 ? (
                    <p className='text-gray-500 text-center py-4'>Henüz kullanıcı yok</p>
                  ) : (
                    <div className='space-y-3'>
                      {recentUsers.map((user) => (
                        <div key={user.id} className='flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200'>
                          <div>
                            <p className='font-medium text-gray-800'>{user.name || user.email}</p>
                            <p className='text-sm text-gray-600'>{user.email}</p>
                          </div>
                          <span className='text-xs text-gray-500'>
                            {user.createdAt?.toDate ? 
                              user.createdAt.toDate().toLocaleDateString('tr-TR') : 
                              new Date(user.createdAt).toLocaleDateString('tr-TR')
                            }
                          </span>
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

  // Diğer bölümler için varsayılan içerik
  return (
    <main className='flex-1 p-6'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          {getContentTitle()}
        </h2>
        <p className='text-gray-600'>
          {getContentDescription()}
        </p>
      </div>
    </main>
  );
}

export default ContentArea; 