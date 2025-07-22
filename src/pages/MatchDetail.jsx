import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  // Maç detaylarını getir
  const fetchMatch = async () => {
    try {
      setLoading(true);
      const matchDoc = await getDoc(doc(db, 'matches', id));
      
      if (matchDoc.exists()) {
        setMatch({ id: matchDoc.id, ...matchDoc.data() });
      } else {
        setError('Maç bulunamadı.');
      }
    } catch (error) {
      console.error('Maç getirilirken hata:', error);
      setError('Maç yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcının katılıp katılmadığını kontrol et
  const isUserParticipant = () => {
    if (!user || !match) return false;
    // Hem string hem obje formatını destekle
    return match.participants?.some(p => 
      typeof p === 'string' ? p === user.uid : p.userId === user.uid
    ) || false;
  };

  // Maç dolup dolmadığını kontrol et
  const isMatchFull = () => {
    if (!match) return false;
    return (match.participants?.length || 0) >= match.maxParticipants;
  };

  // Maç geçmiş mi kontrol et
  const isMatchPast = () => {
    if (!match) return false;
    
    // Maç tarihini al
    let matchDate;
    if (match.date?.toDate) {
      matchDate = match.date.toDate();
    } else {
      matchDate = new Date(match.date);
    }
    
    // Maç saatini ekle
    if (match.time) {
      const [hours, minutes] = match.time.split(':');
      matchDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    
    // Şu anki zamanla karşılaştır
    const now = new Date();
    return matchDate < now;
  };

  // Maça katıl
  const joinMatch = async () => {
    if (!user) {
      toast.info('Maça katılmak için giriş yapmalısınız.');
      navigate('/login');
      return;
    }

    // Kullanıcı profilini kontrol et
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
    if (!userData?.phone) {
      toast.error('Maça katılmak için telefon numaranızı profil sayfasından eklemelisiniz.');
      navigate('/profile');
      return;
    }

    if (isUserParticipant()) {
      toast.warning('Bu maça zaten katıldınız.');
      return;
    }

    if (isMatchFull()) {
      toast.warning('Bu maç dolu.');
      return;
    }

    if (isMatchPast()) {
      toast.warning('Bu maç için katılım süresi geçmiş.');
      return;
    }

    setJoining(true);
    try {
      const participantData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        joinedAt: new Date()
      };

      await updateDoc(doc(db, 'matches', id), {
        participants: arrayUnion(participantData)
      });

      // Local state'i güncelle
      setMatch(prev => ({
        ...prev,
        participants: [...(prev.participants || []), participantData]
      }));

      toast.success('Maça başarıyla katıldınız!');
    } catch (error) {
      console.error('Maça katılırken hata:', error);
      toast.error('Maça katılırken hata oluştu.');
    } finally {
      setJoining(false);
    }
  };

  // Maçtan ayrıl
  const leaveMatch = async () => {
    if (!user || !isUserParticipant()) return;

    setJoining(true);
    try {
      // Hem string hem obje formatını destekle
      const userParticipant = match.participants.find(p => 
        typeof p === 'string' ? p === user.uid : p.userId === user.uid
      );
      
      await updateDoc(doc(db, 'matches', id), {
        participants: arrayRemove(userParticipant)
      });

      // Local state'i güncelle
      setMatch(prev => ({
        ...prev,
        participants: prev.participants.filter(p => 
          typeof p === 'string' ? p !== user.uid : p.userId !== user.uid
        )
      }));

      toast.success('Maçtan ayrıldınız.');
    } catch (error) {
      console.error('Maçtan ayrılırken hata:', error);
      toast.error('Maçtan ayrılırken hata oluştu.');
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMatch();
    }
  }, [id]);

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Maç detayları yükleniyor...</p>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Hata</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!match) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">⚽</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Maç Bulunamadı</h2>
            <p className="text-gray-600 mb-4">Aradığınız maç mevcut değil veya silinmiş olabilir.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const matchDate = match.date?.toDate ? match.date.toDate() : new Date(match.date);
  const isParticipant = isUserParticipant();
  const isFull = isMatchFull();
  const isPast = isMatchPast();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚽</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{match.title}</h1>
              
              {/* Durum Badge */}
              <div className="flex justify-center mb-4">
                {isPast ? (
                  <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    📅 Geçmiş Maç
                  </span>
                ) : isFull ? (
                  <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    🚫 Dolu
                  </span>
                ) : (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Katılım Açık
                  </span>
                )}
              </div>

              {/* Maç Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl mb-2">🏟️</div>
                  <h3 className="font-semibold text-gray-800">Saha</h3>
                  <p className="text-gray-600">{match.fieldName}</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <h3 className="font-semibold text-gray-800">Tarih & Saat</h3>
                  <p className="text-gray-600">
                    {matchDate.toLocaleDateString('tr-TR')}<br />
                    {matchDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">👥</div>
                  <h3 className="font-semibold text-gray-800">Katılımcılar</h3>
                  <p className="text-gray-600">
                    {match.participants?.length || 0} / {match.maxParticipants}
                  </p>
                </div>
              </div>

              {/* Açıklama */}
              {match.description && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Açıklama</h3>
                  <p className="text-gray-600 whitespace-pre-line">{match.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Katılım Butonu */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="text-center">
              {!user ? (
                <div>
                  <p className="text-gray-600 mb-4">Maça katılmak için giriş yapmalısınız.</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                  >
                    🔑 Giriş Yap
                  </button>
                </div>
              ) : isPast ? (
                <p className="text-gray-500">Bu maç için katılım süresi geçmiş.</p>
              ) : isParticipant ? (
                <div>
                  <p className="text-green-600 mb-4 font-medium">✅ Bu maça katıldınız!</p>
                  <button
                    onClick={leaveMatch}
                    disabled={joining}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {joining ? '⏳ İşleniyor...' : '❌ Maçtan Ayrıl'}
                  </button>
                </div>
              ) : isFull ? (
                <p className="text-red-500">Bu maç dolu. Katılım mümkün değil.</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Bu maça katılmak ister misiniz?</p>
                  <button
                    onClick={joinMatch}
                    disabled={joining}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {joining ? '⏳ Katılıyor...' : '⚽ Maça Katıl'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MatchDetail; 