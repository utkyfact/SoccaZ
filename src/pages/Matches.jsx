import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { FaMapMarkerAlt, FaUsers, FaClock, FaCalendarAlt } from "react-icons/fa";
import { toast } from 'react-toastify';

function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  // Maçları getir
  const fetchMatches = async () => {
    try {
      setLoading(true);

      // Aktif maçları getir - sadece gelecek tarihli olanlar
      const matchesQuery = query(
        collection(db, 'matches'),
        where('status', '==', 'active')
      );

      const matchesSnapshot = await getDocs(matchesQuery);
      const matchesData = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Gelecek tarihli maçları filtrele ve tarihe göre sırala
      const currentTime = new Date();
      const upcomingMatches = matchesData
        .filter(match => {
          // match.date string veya Firestore Timestamp olabilir
          let matchDate;
          if (typeof match.date === 'string') {
            matchDate = match.date;
          } else if (match.date?.toDate) {
            matchDate = match.date.toDate().toISOString().split('T')[0];
          } else {
            return false; // Geçersiz tarih
          }

          // Bugün veya gelecek tarihli maçları göster
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const matchDay = new Date(matchDate);
          matchDay.setHours(0, 0, 0, 0);

          return matchDay >= today;
        })
        .sort((a, b) => {
          // Basit tarih sıralaması
          const aDate = typeof a.date === 'string' ? a.date : (a.date?.toDate?.() || new Date()).toISOString().split('T')[0];
          const bDate = typeof b.date === 'string' ? b.date : (b.date?.toDate?.() || new Date()).toISOString().split('T')[0];

          if (aDate === bDate) {
            // Aynı tarihse saate göre sırala
            return (a.time || '').localeCompare(b.time || '');
          }

          return aDate.localeCompare(bDate);
        });

      setMatches(upcomingMatches);
      setError(null);
    } catch (error) {
      console.error('Maçlar getirilirken hata:', error);
      setError('Maçlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Maça katılma/ayrılma fonksiyonu
  const handleJoinMatch = async (matchId) => {
    if (!user) {
      toast.error('Maça katılmak için giriş yapmanız gerekiyor.');
      return;
    }

    // Kullanıcı profilini kontrol et
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    if (!userData?.phone) {
      toast.error('Maça katılmak için telefon numaranızı profil sayfasından eklemelisiniz.');
      return;
    }

    try {
      const match = matches.find(m => m.id === matchId);
      const isUserJoined = match.participants?.includes(user.uid);

      let updatedParticipants;
      if (isUserJoined) {
        // Maçtan ayrıl
        updatedParticipants = match.participants.filter(id => id !== user.uid);
        toast.success(`${match.title} maçından ayrıldınız.`);
      } else {
        // Kapasite kontrolü
        if (match.participants?.length >= match.maxParticipants) {
          toast.warning('Bu maç dolu. Katılamazsınız.');
          return;
        }

        // Maça katıl
        updatedParticipants = [...(match.participants || []), user.uid];
        toast.success(`${match.title} maçına katıldınız!`);
      }

      // Firestore'u güncelle
      await updateDoc(doc(db, 'matches', matchId), {
        participants: updatedParticipants,
        updatedAt: new Date()
      });

      // Local state'i güncelle
      setMatches(matches.map(m =>
        m.id === matchId
          ? { ...m, participants: updatedParticipants }
          : m
      ));

    } catch (error) {
      console.error('Maça katılım güncellenirken hata:', error);
      toast.error('Maça katılım güncellenirken bir hata oluştu.');
    }
  };

  // Konumu aç
  const openLocation = (match) => {
    if (match.locationCoords && match.locationCoords.lat && match.locationCoords.lng) {
      // Koordinat varsa koordinat ile aç
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${match.locationCoords.lat},${match.locationCoords.lng}`;
      window.open(mapsUrl, '_blank');
    } else if (match.location) {
      // Sadece text varsa text ile arama yap
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location)}`;
      window.open(mapsUrl, '_blank');
    } else {
      toast.info('Bu maç için konum bilgisi bulunmuyor.');
    }
  };

  // Maç durumunu belirle
  const getMatchStatus = (match) => {
    const participantCount = match.participants?.length || 0;
    const maxParticipants = match.maxParticipants || 0;

    if (participantCount >= maxParticipants) {
      return { text: 'Dolu', color: 'bg-red-100 text-red-800' };
    } else if (participantCount >= maxParticipants * 0.8) {
      return { text: 'Az Yer', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Müsait', color: 'bg-green-100 text-green-800' };
    }
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

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Maçlar yükleniyor...</p>
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
              onClick={fetchMatches}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Organize Edilen Maçlar</h1>
            <p className="text-gray-600 text-center">Yaklaşan maçlara katılın ve futbol keyfi yaşayın</p>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⚽</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Henüz Maç Bulunmuyor</h2>
              <p className="text-gray-600">Şu anda yaklaşan organize edilmiş maç bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => {
                const participantCount = match.participants?.length || 0;
                const isUserJoined = user && match.participants?.includes(user.uid);
                const matchStatus = getMatchStatus(match);
                const isFull = participantCount >= match.maxParticipants;

                return (
                  <div key={match.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Maç Görseli */}
                    <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-2">⚽</div>
                        <h3 className="text-xl font-bold">{match.title}</h3>
                      </div>
                      {/* Durum Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${matchStatus.color}`}>
                          {matchStatus.text}
                        </span>
                      </div>
                      {/* Katılım Durumu */}
                      {isUserJoined && (
                        <div className="absolute top-2 left-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Katıldınız
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Maç Bilgileri */}
                    <div className="p-6">
                      <div className="space-y-3">
                        {/* Tarih ve Saat */}
                        <div className="flex items-center text-gray-600 text-sm">
                          <FaCalendarAlt className="mr-2" />
                          <span className="mr-4">
                            {typeof match.date === 'string'
                              ? new Date(match.date).toLocaleDateString('tr-TR')
                              : match.date?.toDate?.()?.toLocaleDateString('tr-TR') || 'Tarih yok'
                            }
                          </span>
                          <FaClock className="mr-2" />
                          <span>{match.time}</span>
                        </div>

                        {/* Saha */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">Saha:</span>
                          <span className="font-semibold text-gray-900">{match.fieldName}</span>
                        </div>

                        {/* Katılımcı Sayısı */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm flex items-center">
                            <FaUsers className="mr-1" />
                            Katılımcılar:
                          </span>
                          <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                            {participantCount} / {match.maxParticipants}
                          </span>
                        </div>

                        {/* Konum */}
                        {match.location && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-sm">Konum:</span>
                            <button
                              onClick={() => openLocation(match)}
                              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                              title={match.locationCoords ? 'GPS koordinatları ile açılacak' : 'Adres ile arama yapılacak'}
                            >
                              <FaMapMarkerAlt className="mr-1" />
                              {match.locationCoords ? 'Konum' : '🔍 Arama'}
                            </button>
                          </div>
                        )}

                        {/* Açıklama */}
                        {match.description && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-600 text-sm">{match.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Katılım Butonu */}
                      <div className="mt-6">
                        {user ? (
                          <button
                            onClick={() => handleJoinMatch(match.id)}
                            disabled={!isUserJoined && isFull}
                            className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 text-center block font-medium cursor-pointer ${isUserJoined
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : isFull
                                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                          >
                            {isUserJoined ? 'Maçtan Ayrıl' : isFull ? 'Dolu' : 'Maça Katıl'}
                          </button>
                        ) : (
                          <div className="text-center">
                            <p className="text-gray-500 text-sm mb-2">Maça katılmak için giriş yapın</p>
                            <button
                              onClick={() => window.location.href = '/login'}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm cursor-pointer"
                            >
                              Giriş Yap
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bilgi Kartı */}
          {matches.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Maç Katılım Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Ücretsiz katılım
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Önceden katılım gerekli
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Kendi ekipmanınızı getirin
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Matches; 