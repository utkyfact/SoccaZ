import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { updateProfile, updateEmail, sendEmailVerification, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import UserAvatar from '../components/UserAvatar';
import AvatarSelectionModal from '../components/AvatarSelectionModal';
import { toast } from 'react-toastify';

function Profile() {
  const { user, userProfile, loading: authLoading, isAdmin, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [userStats, setUserStats] = useState({
    totalReservations: 0,
    activeReservations: 0,
    completedReservations: 0,
    cancelledReservations: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  // Avatar seçme fonksiyonu
  const handleAvatarSelect = async (avatarId) => {
    try {
      await updateAvatar(avatarId);
      // Başarı mesajı göster
    } catch (error) {
      console.error('Avatar güncellenirken hata:', error);
    }
  };

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  // Kullanıcı istatistiklerini getir
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const q = query(
          collection(db, 'reservations'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const reservations = querySnapshot.docs.map(doc => doc.data());

        const stats = {
          totalReservations: reservations.length,
          activeReservations: reservations.filter(r => r.status === 'active').length,
          completedReservations: reservations.filter(r => r.status === 'completed').length,
          cancelledReservations: reservations.filter(r => r.status === 'cancelled').length,
          totalSpent: reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0)
        };

        setUserStats(stats);
      } catch (error) {
        console.error('Kullanıcı istatistikleri getirilirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  // Sidebar menü öğeleri
  const sidebarItems = [
    {
      id: 'overview',
      title: 'Genel Bakış',
      icon: '📊',
      description: 'Profil özeti ve istatistikler'
    },
    {
      id: 'personal',
      title: 'Kişisel Bilgiler',
      icon: '👤',
      description: 'Ad, ve email değişiklikleri'
    },
    {
      id: 'reservations',
      title: 'Rezervasyonlarım',
      icon: '📅',
      description: 'Tüm rezervasyon geçmişi'
    },
    {
      id: 'favorites',
      title: 'Favori Sahalar',
      icon: '⭐',
      description: 'Beğendiğiniz sahalar'
    },
    {
      id: 'notifications',
      title: 'Bildirimler',
      icon: '🔔',
      description: 'Bildirim ayarları'
    },
    {
      id: 'security',
      title: 'Güvenlik',
      icon: '🔒',
      description: 'Hesap güvenlik ayarları'
    }
  ];

  // İçerik render fonksiyonu
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} stats={userStats} />;
      case 'personal':
        return <PersonalTab user={user} userProfile={userProfile} isAdmin={isAdmin} />;
      case 'reservations':
        return <ReservationsTab />;
      case 'favorites':
        return <FavoritesTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <OverviewTab user={user} stats={userStats} />;
    }
  };

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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil</h1>
            <p className="text-gray-600">
              Hesap bilgilerinizi yönetin ve rezervasyon geçmişinizi görüntüleyin.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Kullanıcı Bilgisi */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      onClick={() => setShowAvatarModal(true)}
                      title="Profil resmini değiştir"
                    >
                      <UserAvatar user={user} userProfile={userProfile} size="lg" showBorder={true} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {user.displayName || 'Kullanıcı'}
                      </h2>
                      <p className="text-green-100 text-sm">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menü */}
                <div className="p-4">
                  <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full cursor-pointer text-left p-4 rounded-lg group ${
                          activeTab === item.id
                            ? 'bg-green-50 border-2 border-green-200 text-green-700'
                            : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className={`text-xs ${
                              activeTab === item.id ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* İçerik Alanı */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                  </div>
                ) : (
                  renderContent()
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Seçme Modalı */}
      <AvatarSelectionModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={handleAvatarSelect}
        currentAvatarId={userProfile?.avatarId || 'default'}
      />
    </Layout>
  );
}

// Genel Bakış Tab'ı
function OverviewTab({ user, stats }) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hoş Geldiniz! 👋</h2>
        <p className="text-gray-600">
          Profil özetiniz ve aktivite istatistikleriniz aşağıda yer almaktadır.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Toplam Rezervasyon</p>
              <p className="text-3xl font-bold">{stats.totalReservations}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Aktif Rezervasyon</p>
              <p className="text-3xl font-bold">{stats.activeReservations}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tamamlanan</p>
              <p className="text-3xl font-bold">{stats.completedReservations}</p>
            </div>
            <div className="text-3xl">🏆</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Toplam Harcama</p>
              <p className="text-3xl font-bold">₺{stats.totalSpent}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Hızlı Erişim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Profil sayfasına giriş yapıldı</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <span>İstatistikler güncellendi</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔔</span>
              <span>Bildirimler aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Kişisel Bilgiler Tab'ı
function PersonalTab({ user, userProfile, isAdmin }) {
  const { updateUserProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPhone, setNewPhone] = useState(userProfile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      setMessage({ type: 'error', text: 'Ad soyad boş olamaz!' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await updateProfile(user, {
        displayName: newName.trim()
      });
      
      setMessage({ type: 'success', text: 'Ad soyad başarıyla güncellendi!' });
      setIsEditingName(false);
      
      // 3 saniye sonra mesajı otomatik temizle
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Ad soyad güncellenirken hata:', error);
      setMessage({ type: 'error', text: 'Ad soyad güncellenirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Geçerli bir email adresi girin!' });
      return;
    }

    if (!password.trim()) {
      setPasswordError('Şifre gereklidir!');
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      setPasswordError('');
      
      // Önce şifre ile yeniden doğrula
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      // Şifre doğruysa email'i güncelle
      await updateEmail(user, newEmail.trim());
      
      setMessage({ type: 'success', text: 'Email başarıyla güncellendi!' });
      setIsEditingEmail(false);
      setShowPasswordModal(false);
      setPassword('');
      
      // 3 saniye sonra mesajı otomatik temizle
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Email güncellenirken hata:', error);
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Şifre yanlış!');
      } else if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Bu email adresi zaten kullanılıyor!' });
      } else {
        setMessage({ type: 'error', text: 'Email güncellenirken bir hata oluştu.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.trim()) {
      setMessage({ type: 'error', text: 'Telefon numarası boş olamaz!' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await updateUserProfile({
        phone: newPhone.trim()
      });
      
      setMessage({ type: 'success', text: 'Telefon numarası başarıyla güncellendi!' });
      setIsEditingPhone(false);
      
      // 3 saniye sonra mesajı otomatik temizle
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Telefon numarası güncellenirken hata:', error);
      setMessage({ type: 'error', text: 'Telefon numarası güncellenirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = (type) => {
    if (type === 'name') {
      setNewName(user?.displayName || '');
      setIsEditingName(false);
    } else if (type === 'email') {
      setNewEmail(user?.email || '');
      setIsEditingEmail(false);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
    } else if (type === 'phone') {
      setNewPhone(userProfile?.phone || '');
      setIsEditingPhone(false);
    }
    setMessage({ type: '', text: '' });
  };

  const handleSendEmailVerification = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await sendEmailVerification(user, {
        url: window.location.origin + '/profile',
        handleCodeInApp: true,
      });
      
      setEmailVerificationSent(true);
      setMessage({ type: 'success', text: 'Doğrulama emaili gönderildi! Email kutunuzu kontrol edin.' });
    } catch (error) {
      console.error('Email doğrulama gönderilirken hata:', error);
      setMessage({ type: 'error', text: 'Email doğrulama gönderilirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kişisel Bilgiler</h2>
        <p className="text-gray-600">
          Hesap bilgilerinizi güncelleyin ve yönetin.
        </p>
      </div>

      {/* Mesaj Gösterimi */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ease-in-out ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800 shadow-sm' 
            : 'bg-red-50 border border-red-200 text-red-800 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{message.text}</span>
            </div>
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Ad Soyad Güncelleme */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Soyad</h3>
          <div className="space-y-4">
            {isEditingName ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Ad Soyad</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Ad soyadınızı girin"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdateName}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                  <button
                    onClick={() => cancelEdit('name')}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mevcut Ad Soyad</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user?.displayName || 'Belirtilmemiş'}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Düzenle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email Güncelleme */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">E-posta Adresi</h3>
          <div className="space-y-4">
            {isEditingEmail ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni E-posta</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Email adresinizi girin"
                  />
                </div>
                
                {/* Şifre Modal */}
                {showPasswordModal && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Güvenlik Doğrulaması</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Email adresinizi değiştirmek için mevcut şifrenizi girin.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError('');
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            passwordError ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Şifrenizi girin"
                        />
                        {passwordError && (
                          <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdateEmail}
                    disabled={loading || !password.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                  <button
                    onClick={() => cancelEdit('email')}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mevcut E-posta</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditingEmail(true);
                    setShowPasswordModal(true);
                    setPassword('');
                    setPasswordError('');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Düzenle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Telefon Numarası Güncelleme */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Telefon Numarası</h3>
          <div className="space-y-4">
            {isEditingPhone ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Telefon Numarası</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Telefon numaranızı girin"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdatePhone}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Güncelleniyor...' : 'Güncelle'}
                  </button>
                  <button
                    onClick={() => cancelEdit('phone')}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mevcut Telefon</p>
                  <p className="text-lg font-medium text-gray-900">
                    {userProfile?.phone || 'Belirtilmemiş'}
                  </p>
                  {!userProfile?.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Rezervasyon yapabilmek için telefon numarası gereklidir
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                >
                  {userProfile?.phone ? 'Düzenle' : 'Ekle'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email Doğrulama Kutusu - Sadece doğrulanmamışsa ve admin değilse göster */}
        {user && !user.emailVerified && !isAdmin && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-xl mt-1">ℹ️</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Email Doğrulama</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Email adresinizi doğrulamak için aşağıdaki butona tıklayın. 
                  Doğrulama emaili gönderilecek ve email adresinizi doğruladıktan sonra tüm özellikleri kullanabilirsiniz.
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSendEmailVerification}
                    disabled={loading || emailVerificationSent}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Gönderiliyor...' : emailVerificationSent ? 'Email Gönderildi' : 'Email Doğrula'}
                  </button>
                  {emailVerificationSent && (
                    <span className="text-green-600 text-sm font-medium">✅ Doğrulama emaili gönderildi</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Doğrulandı Bilgisi - Sadece doğrulanmışsa ve admin değilse göster */}
        {user && user.emailVerified && !isAdmin && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-xl mt-1">✅</span>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Email Doğrulandı</h3>
                <p className="text-green-700 text-sm">
                  Email adresiniz başarıyla doğrulanmıştır. Tüm özellikleri kullanabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Rezervasyonlar Tab'ı
function ReservationsTab() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rezervasyonlarım</h2>
        <p className="text-gray-600">
          Tüm rezervasyon geçmişinizi buradan görüntüleyebilirsiniz.
        </p>
      </div>

      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Rezervasyon Geçmişi</h3>
        <p className="text-gray-600 mb-6">
          Detaylı rezervasyon bilgilerinizi görüntülemek için Rezervasyonlarım sayfasını ziyaret edin.
        </p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
          Rezervasyonlarımı Görüntüle
        </button>
      </div>
    </div>
  );
}

// Favori Sahalar Tab'ı
function FavoritesTab() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Favori Sahalar</h2>
        <p className="text-gray-600">
          Beğendiğiniz sahaları favorilere ekleyin ve hızlı erişim sağlayın.
        </p>
      </div>

      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">⭐</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz Favori Sahalarınız Yok</h3>
        <p className="text-gray-600 mb-6">
          Sahalar sayfasından beğendiğiniz sahaları favorilere ekleyebilirsiniz.
        </p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
          Sahaları Keşfet
        </button>
      </div>
    </div>
  );
}

// Bildirimler Tab'ı
function NotificationsTab() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bildirim Ayarları</h2>
        <p className="text-gray-600">
          Bildirim tercihlerinizi yönetin ve güncel kalın.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Türleri</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Rezervasyon Onayları</h4>
                <p className="text-sm text-gray-600">Rezervasyonunuz onaylandığında bildirim alın</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Hatırlatmalar</h4>
                <p className="text-sm text-gray-600">Rezervasyonunuzdan önce hatırlatma alın</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Özel Teklifler</h4>
                <p className="text-sm text-gray-600">Özel fırsatlar ve indirimler hakkında bilgilendiril</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Güvenlik Tab'ı
function SecurityTab() {
  const { user, logout } = useAuth();
  const [showPasswordAccordion, setShowPasswordAccordion] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogout = async () => {
    try {
        await logout();
        toast.success("Başarıyla çıkış yaptınız!")
    } catch (error) {
        console.error('Çıkış yapılırken hata:', error);
        toast.error("Çıkış yapılırken bir hata oluştu!")
    }
};

  const handlePasswordChange = async () => {
    setMessage({ type: '', text: '' });
    if (!currentPassword || !newPassword || !newPasswordRepeat) {
      setMessage({ type: 'error', text: 'Tüm alanları doldurun.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalı.' });
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
      return;
    }
    try {
      setLoading(true);
      // Mevcut şifre ile yeniden doğrula
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      // Şifreyi güncelle
      await updatePassword(user, newPassword);
      toast.success('Şifre başarıyla değiştirildi! Güvenlik nedeniyle çıkış yapılıyor.');
      handleLogout();
      // setCurrentPassword('');
      // // setNewPassword('');
      // setNewPasswordRepeat('');
      // setShowPasswordAccordion(false);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Mevcut şifre yanlış.' });
      } else if (error.code === 'auth/weak-password') {
        setMessage({ type: 'error', text: 'Yeni şifre çok zayıf.' });
      } else {
        setMessage({ type: 'error', text: 'Şifre değiştirilirken hata oluştu.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Güvenlik Ayarları</h2>
        <p className="text-gray-600">
          Hesap güvenliğinizi artırın ve koruyun.
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ease-in-out ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800 shadow-sm' 
            : 'bg-red-50 border border-red-200 text-red-800 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {message.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{message.text}</span>
            </div>
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Güvenliği</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-gray-900">Şifre Değiştir</h4>
                <p className="text-sm text-gray-600">Hesap şifrenizi güvenli bir şekilde güncelleyin</p>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                onClick={() => setShowPasswordAccordion(!showPasswordAccordion)}
              >
                {showPasswordAccordion ? 'Kapat' : 'Değiştir'}
              </button>
            </div>
            {/* Accordion İçeriği */}
            {showPasswordAccordion && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200 animate-fade-in">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Mevcut şifrenizi girin"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Yeni şifrenizi girin"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={newPasswordRepeat}
                    onChange={e => setNewPasswordRepeat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Yeni şifrenizi tekrar girin"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordAccordion(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setNewPasswordRepeat('');
                      setMessage({ type: '', text: '' });
                    }}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">İki Faktörlü Doğrulama</h3>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div>
              <h4 className="font-medium text-gray-900">İki Faktörlü Doğrulama</h4>
              <p className="text-sm text-gray-600">Ek güvenlik katmanı ekleyin</p>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium cursor-pointer">
              Aktifleştir
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Oturum Geçmişi</h3>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div>
              <h4 className="font-medium text-gray-900">Oturum Geçmişi</h4>
              <p className="text-sm text-gray-600">Aktif oturumlarınızı görüntüleyin</p>
            </div>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium cursor-pointer">
              Görüntüle
            </button>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <span className="text-red-600 text-xl">⚠️</span>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Tehlikeli Bölge</h3>
              <p className="text-red-700 text-sm mb-4">
                Bu işlemler geri alınamaz ve hesabınızı etkileyebilir.
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium">
                Hesabı Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 