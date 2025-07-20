import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterField, setFilterField] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

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

  // Rezervasyonları getir
  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      // Sahaları getir
      const fieldsSnapshot = await getDocs(collection(db, 'fields'));
      const fieldsData = fieldsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFields(fieldsData);

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
        setReservations(updatedReservationsData);
      } else {
        setReservations(reservationsData);
      }
      
    } catch (error) {
      console.error('Rezervasyonlar getirilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Rezervasyon durumunu değiştir
  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'reservations', reservationId), {
        status: newStatus,
        updatedAt: new Date()
      });
      fetchReservations(); // Listeyi yenile
    } catch (error) {
      console.error('Rezervasyon durumu güncellenirken hata:', error);
    }
  };

  // Rezervasyon sil
  const deleteReservation = async (reservationId) => {
    if (window.confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'reservations', reservationId));
        fetchReservations(); // Listeyi yenile
      } catch (error) {
        console.error('Rezervasyon silinirken hata:', error);
      }
    }
  };

  // Filtreleme ve arama
  const filteredReservations = reservations
    .filter(reservation => {
      // Durum filtresi
      if (filterStatus !== 'all' && reservation.status !== filterStatus) {
        return false;
      }
      
      // Saha filtresi
      if (filterField !== 'all' && reservation.fieldId !== filterField) {
        return false;
      }
      
      // Arama filtresi
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          reservation.userName?.toLowerCase().includes(searchLower) ||
          reservation.userEmail?.toLowerCase().includes(searchLower) ||
          reservation.fieldName?.toLowerCase().includes(searchLower) ||
          reservation.time?.includes(searchTerm)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = a.date.toDate ? a.date.toDate() : new Date(a.date);
          bValue = b.date.toDate ? b.date.toDate() : new Date(b.date);
          break;
        case 'userName':
          aValue = a.userName || '';
          bValue = b.userName || '';
          break;
        case 'fieldName':
          aValue = a.fieldName || '';
          bValue = b.fieldName || '';
          break;
        case 'totalPrice':
          aValue = a.totalPrice || 0;
          bValue = b.totalPrice || 0;
          break;
        default:
          aValue = a.date.toDate ? a.date.toDate() : new Date(a.date);
          bValue = b.date.toDate ? b.date.toDate() : new Date(b.date);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Tarih formatla
  const formatDate = (date) => {
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Saat formatla
  const formatTime = (time) => {
    return time || 'Belirtilmemiş';
  };

  // Durum badge'i
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Aktif</span>;
      case 'cancelled':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">İptal</span>;
      case 'completed':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Tamamlandı</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Bilinmiyor</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Rezervasyon Yönetimi</h2>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Rezervasyonlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve Yenile Butonu */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rezervasyon Yönetimi</h2>
        <button
          onClick={fetchReservations}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
        >
          {loading ? '🔄' : '🔄 Yenile'}
        </button>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kullanıcı, saha, saat..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Durum Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="cancelled">İptal</option>
              <option value="completed">Tamamlandı</option>
            </select>
          </div>

          {/* Saha Filtresi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Saha</label>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tüm Sahalar</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>
          </div>

          {/* Sıralama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="date-desc">Tarih (Yeni)</option>
              <option value="date-asc">Tarih (Eski)</option>
              <option value="userName-asc">Kullanıcı (A-Z)</option>
              <option value="userName-desc">Kullanıcı (Z-A)</option>
              <option value="fieldName-asc">Saha (A-Z)</option>
              <option value="fieldName-desc">Saha (Z-A)</option>
              <option value="totalPrice-desc">Fiyat (Yüksek)</option>
              <option value="totalPrice-asc">Fiyat (Düşük)</option>
            </select>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-medium">Toplam Rezervasyon</p>
          <p className="text-2xl font-bold text-blue-800">{reservations.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-medium">Aktif</p>
          <p className="text-2xl font-bold text-green-800">
            {reservations.filter(r => r.status === 'active').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 text-sm font-medium">İptal</p>
          <p className="text-2xl font-bold text-red-800">
            {reservations.filter(r => r.status === 'cancelled').length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-purple-600 text-sm font-medium">Tamamlandı</p>
          <p className="text-2xl font-bold text-purple-800">
            {reservations.filter(r => r.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Rezervasyon Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Rezervasyonlar ({filteredReservations.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {filteredReservations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="text-gray-400 text-4xl mb-2">📅</div>
              <p>Rezervasyon bulunamadı</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih & Saat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kişi & Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.userName || 'İsimsiz'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.fieldName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{formatDate(reservation.date)}</div>
                        <div className="text-sm text-gray-500">{formatTime(reservation.time)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{reservation.personCount || 1} kişi</div>
                        <div className="text-sm text-gray-500">₺{reservation.totalPrice}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {reservation.status === 'active' && (
                          <>
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'completed')}
                              className="text-blue-600 hover:text-blue-900 cursor-pointer"
                              title="Tamamlandı olarak işaretle"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                              title="İptal et"
                            >
                              ❌
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="text-gray-600 hover:text-gray-900 cursor-pointer"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservationsManagement; 