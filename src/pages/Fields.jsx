import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import ReservationModal from '../components/ReservationModal';
import Layout from '../components/Layout';

function Fields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [reservations, setReservations] = useState([]);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  // Sahaları ve rezervasyonları getir
  const fetchData = async () => {
    try {
      setLoading(true);

      // Aktif sahaları getir
      const fieldsSnapshot = await getDocs(collection(db, 'fields'));
      const fieldsData = fieldsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(field => field.isActive !== false);
      setFields(fieldsData);

      // Aktif rezervasyonları getir
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('status', '==', 'active')
      );
      const reservationsSnapshot = await getDocs(reservationsQuery);
      const reservationsData = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(reservationsData);

      setError(null);
    } catch (error) {
      console.error('Veriler getirilirken hata:', error);
      setError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Saha için müsait kapasiteyi hesapla
  const getAvailableCapacity = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return 0;

    // Bugünün tarihi
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Bugün için rezervasyonları filtrele
    const todayReservations = reservations.filter(reservation => {
      const reservationDate = reservation.date.toDate ? reservation.date.toDate() : new Date(reservation.date);
      return reservation.fieldId === fieldId &&
        reservationDate >= today &&
        reservationDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });

    // Toplam rezerve edilmiş kişi sayısı
    const totalReserved = todayReservations.reduce((sum, reservation) => {
      return sum + (reservation.personCount || 1);
    }, 0);

    return Math.max(0, field.capacity - totalReserved);
  };

  // Saha durumunu belirle
  const getFieldStatus = (fieldId) => {
    const availableCapacity = getAvailableCapacity(fieldId);
    const field = fields.find(f => f.id === fieldId);

    if (!field) return { text: 'Bilinmiyor', color: 'bg-gray-100 text-gray-800' };

    if (availableCapacity === 0) {
      return { text: 'Dolu', color: 'bg-red-100 text-red-800' };
    } else if (availableCapacity <= field.capacity * 0.3) {
      return { text: 'Az Yer', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Müsait', color: 'bg-green-100 text-green-800' };
    }
  };

  // Rezervasyon modalını aç
  const openReservationModal = (field) => {
    setSelectedField(field);
    setIsModalOpen(true);
  };

  // Modal'ı kapat
  const closeReservationModal = () => {
    setIsModalOpen(false);
    setSelectedField(null);
  };

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
            <p className="mt-4 text-gray-600">Sahalar yükleniyor...</p>
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
              onClick={fetchData}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Halı Sahalarımız</h1>
            <p className="text-gray-600">Profesyonel futbol sahalarımızı keşfedin</p>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⚽</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Henüz Saha Bulunmuyor</h2>
              <p className="text-gray-600">Şu anda müsait saha bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => {
                const availableCapacity = getAvailableCapacity(field.id);
                const fieldStatus = getFieldStatus(field.id);

                return (
                  <div key={field.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Saha Görseli */}
                    <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-2">⚽</div>
                        <h3 className="text-xl font-bold">{field.name}</h3>
                      </div>
                      {/* Durum Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${fieldStatus.color}`}>
                          {fieldStatus.text}
                        </span>
                      </div>
                    </div>

                    {/* Saha Bilgileri */}
                    <div className="p-6">
                      <div className="space-y-3">
                        {/* Kapasite */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Toplam Kapasite:</span>
                          <span className="font-semibold text-gray-900">{field.capacity} kişi</span>
                        </div>

                        {/* Müsait Kapasite */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Müsait Kapasite:</span>
                          <span className={`font-semibold ${availableCapacity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {availableCapacity} kişi
                          </span>
                        </div>

                        {/* Fiyat */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Kişi Başı Ücret:</span>
                          <span className="font-semibold text-green-600 text-lg">₺{field.pricePerPerson}</span>
                        </div>

                        {/* Durum */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Durum:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fieldStatus.color}`}>
                            {fieldStatus.text}
                          </span>
                        </div>
                      </div>

                      {/* Rezervasyon Butonu */}
                      <div className="mt-6">
                        <button
                          onClick={() => openReservationModal(field)}
                          disabled={availableCapacity === 0}
                          className={`w-full cursor-pointer py-2 px-4 rounded-lg transition-colors duration-200 text-center block font-medium ${availableCapacity > 0
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                          {availableCapacity > 0 ? 'Rezervasyon Yap' : 'Dolu'}
                        </button>
                      </div>

                      {/* Hızlı Bilgiler */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>🌱 Profesyonel Çim</span>
                          <span>💡 Aydınlatmalı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bilgi Kartı */}
          {
            fields.length > 0 && (
              <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Rezervasyon Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Minimum 1 saat rezervasyon
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Önceden rezervasyon gerekli
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Kendi ekipmanınızı getirin
                  </div>
                </div>
              </div>
            )
          }
        </div>

        {/* Rezervasyon Modal */}
        {selectedField && (
          <ReservationModal
            isOpen={isModalOpen}
            onClose={closeReservationModal}
            fieldId={selectedField.id}
            fieldName={selectedField.name}
          />
        )}
      </div>
    </Layout >
  );
}

export default Fields; 