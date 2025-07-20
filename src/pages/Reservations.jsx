import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, past, cancelled
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null
  });
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

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
        return true; // Güncelleme yapıldı
      } catch (error) {
        console.error('Otomatik tamamlama hatası:', error);
        return false;
      }
    }
    
    return false;
  };

  // Rezervasyonları getir
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'reservations'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const reservationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Geçmiş rezervasyonları kontrol et ve güncelle
      const wasUpdated = await autoCompletePastReservations(reservationsData);
      
      // Eğer güncelleme yapıldıysa rezervasyonları tekrar getir
      if (wasUpdated) {
        const updatedQuerySnapshot = await getDocs(q);
        const updatedReservationsData = updatedQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservations(updatedReservationsData);
      } else {
        setReservations(reservationsData);
      }
      
      setError(null);
    } catch (error) {
      console.error('Rezervasyonlar getirilirken hata:', error);
      setError('Rezervasyonlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  // Rezervasyon iptal et
  const handleCancelReservation = (reservationId) => {
    setConfirmationModal({
      isOpen: true,
      type: 'warning',
      title: 'Rezervasyon İptali',
      message: 'Bu rezervasyonu iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      onConfirm: async () => {
        try {
          await updateDoc(doc(db, 'reservations', reservationId), {
            status: 'cancelled',
            cancelledAt: new Date()
          });
          fetchReservations();
          toast.success('Rezervasyon başarıyla iptal edildi.');
        } catch (error) {
          console.error('Rezervasyon iptal edilirken hata:', error);
          toast.error('Rezervasyon iptal edilirken bir hata oluştu.');
        }
      }
    });
  };

  // Rezervasyon sil
  const handleDeleteReservation = (reservationId) => {
    setConfirmationModal({
      isOpen: true,
      type: 'danger',
      title: 'Rezervasyon Silme',
      message: 'Bu rezervasyonu kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'reservations', reservationId));
          fetchReservations();
          toast.success('Rezervasyon başarıyla silindi.');
        } catch (error) {
          console.error('Rezervasyon silinirken hata:', error);
          toast.error('Rezervasyon silinirken bir hata oluştu.');
        }
      }
    });
  };

  // Tarih formatla
  const formatDate = (date) => {
    return new Date(date.toDate()).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Durum rengi
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Durum metni
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  // Modal kapatma fonksiyonu
  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: 'warning',
      title: '',
      message: '',
      onConfirm: null
    });
  };

  // Filtreleme
  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  // Auth loading durumunda loading göster
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Kullanıcı giriş yapmamışsa loading göster
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yönlendiriliyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Rezervasyonlar yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Hata Oluştu</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchReservations}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasyonlarım</h1>
            <p className="text-gray-600">
              Tüm rezervasyonlarınızı buradan görüntüleyebilir ve yönetebilirsiniz.
            </p>
          </div>

          {/* Filtreler */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tümü ({reservations.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Aktif ({reservations.filter(r => r.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tamamlanan ({reservations.filter(r => r.status === 'completed').length})
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'cancelled' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                İptal Edilen ({reservations.filter(r => r.status === 'cancelled').length})
              </button>
            </div>
          </div>

          {/* Rezervasyonlar Listesi */}
          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {filter === 'all' ? 'Henüz rezervasyonunuz yok' : 'Bu kategoride rezervasyon bulunamadı'}
              </h2>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'İlk rezervasyonunuzu yapmak için sahalar sayfasını ziyaret edin.'
                  : 'Bu kategoride rezervasyon bulunmuyor.'
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => navigate('/fields')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium cursor-pointer"
                >
                  🏟️ Sahaları Görüntüle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Saha Bilgisi */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                    <h3 className="text-lg font-semibold">{reservation.fieldName || 'Saha'}</h3>
                    <p className="text-green-100 text-sm">
                      {reservation.fieldCapacity} kişi kapasite
                    </p>
                  </div>

                  {/* Rezervasyon Detayları */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {/* Tarih ve Saat */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Tarih:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(reservation.date)}
                        </span>
                      </div>

                      {/* Süre */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Süre:</span>
                        <span className="font-medium text-gray-900">
                          {reservation.duration} saat
                        </span>
                      </div>

                      {/* Kişi Sayısı */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Kişi:</span>
                        <span className="font-medium text-gray-900">
                          {reservation.personCount} kişi
                        </span>
                      </div>

                      {/* Toplam Ücret */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Toplam:</span>
                        <span className="font-bold text-green-600 text-lg">
                          ₺{reservation.totalPrice}
                        </span>
                      </div>

                      {/* Durum */}
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Durum:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </div>
                    </div>

                    {/* İşlem Butonları */}
                    <div className="mt-6 space-y-2">
                      {reservation.status === 'active' && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium cursor-pointer"
                        >
                          ❌ Rezervasyonu İptal Et
                        </button>
                      )}
                      
                      {reservation.status === 'cancelled' && (
                        <button
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium cursor-pointer"
                        >
                          🗑️ Kalıcı Olarak Sil
                        </button>
                      )}

                      {reservation.status === 'completed' && (
                        <button
                          onClick={() => navigate('/fields')}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                        >
                          🏟️ Yeni Rezervasyon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* İstatistikler */}
          {reservations.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Rezervasyon İstatistikleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{reservations.length}</div>
                  <div className="text-sm text-gray-600">Toplam Rezervasyon</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {reservations.filter(r => r.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Aktif</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {reservations.filter(r => r.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Tamamlanan</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {reservations.filter(r => r.status === 'cancelled').length}
                  </div>
                  <div className="text-sm text-gray-600">İptal Edilen</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        confirmText="Evet, Onayla"
        cancelText="İptal"
      />
    </Layout>
  );
}

export default Reservations; 