import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { updateProfile, updateEmail, sendEmailVerification, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword, verifyBeforeUpdateEmail } from 'firebase/auth';
import UserAvatar from '../components/UserAvatar';
import AvatarSelectionModal from '../components/AvatarSelectionModal';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import { validateEmail, validatePhone, sanitizeInput } from '../utils/inputSanitizer';

function Profile() {
  const { user, userProfile, loading: authLoading, isAdmin, updateAvatar } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [userStats, setUserStats] = useState({
    totalMatches: 0,
    activeMatches: 0
  });
  const [loading, setLoading] = useState(true);

  // Avatar seçme fonksiyonu
  const handleAvatarSelect = async (avatarId) => {
    try {
      await updateAvatar(avatarId);
      // Başarı mesajı göster
    } catch (error) {
      console.error('Beim Aktualisieren des Avatars ist ein Fehler aufgetreten:', error);
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
        
        // Kullanıcının katıldığı maçları getir
        const matchesSnapshot = await getDocs(collection(db, 'matches'));
        const allMatches = matchesSnapshot.docs.map(doc => doc.data());
        
        // Kullanıcının katıldığı maçları filtrele
        const userMatches = allMatches.filter(match => 
          match.participants && match.participants.includes(user.uid)
        );

        const stats = {
          totalMatches: userMatches.length,
          activeMatches: userMatches.filter(match => match.status === 'active').length
        };

        setUserStats(stats);
      } catch (error) {
        console.error('Beim Abrufen der Benutzerstatistiken ist ein Fehler aufgetreten:', error);
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
      title: 'Überblick',
      icon: '📊',
      description: 'Profilübersicht und Statistiken'
    },
    {
      id: 'personal',
      title: 'Persönliche Informationen',
      icon: '👤',
      description: 'Name, E-Mail und Telefonnummernänderungen'
    },
    {
      id: 'notifications',
      title: 'Benachrichtigungen',
      icon: '🔔',
      description: 'Benachrichtigungseinstellungen'
    },
    {
      id: 'security',
      title: 'Sicherheit',
      icon: '🔒',
      description: 'Kontosicherheitseinstellungen'
    }
  ];

  // İçerik render fonksiyonu
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} stats={userStats} />;
      case 'personal':
        return <PersonalTab user={user} userProfile={userProfile} isAdmin={isAdmin} />;
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
            <p className="mt-4 text-gray-600">Lädt...</p>
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
            <p className="mt-4 text-gray-600">Weiterleitung...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profilübersicht</h1>
            <p className="text-gray-600">
              Verwalten Sie Ihre Kontoinformationen und sehen Sie Ihren Reservierungsverlauf.
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
                      title="Profilbild ändern"
                    >
                      <UserAvatar user={user} userProfile={userProfile} size="lg" showBorder={true} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {user.displayName || 'Benutzer'}
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
                        className={`w-full cursor-pointer text-left p-4 rounded-lg group ${activeTab === item.id
                          ? 'bg-green-50 border-2 border-green-200 text-green-700'
                          : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                          }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{item.title}</div>
                            <div className={`text-xs ${activeTab === item.id ? 'text-green-600' : 'text-gray-500'
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
                    <p className="mt-4 text-gray-600">Lädt...</p>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Willkommen! 👋</h2>
        <p className="text-gray-600">
          Ihre Profilübersicht und Ihre Aktivitätssstatistiken sind unten zu sehen.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Teilgenommene Spiele</p>
              <p className="text-3xl font-bold">{stats.totalMatches}</p>
            </div>
            <div className="text-3xl">⚽</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Aktive Spiele</p>
              <p className="text-3xl font-bold">{stats.activeMatches}</p>
            </div>
            <div className="text-3xl">🟢</div>
          </div>
        </div>
      </div>

      {/* Hızlı Erişim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Letzte Aktivitäten</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>✅</span>
              <span>Profilseite besucht</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <span>Statistiken aktualisiert</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔔</span>
              <span>Benachrichtigungen aktiv</span>
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
      setMessage({ type: 'error', text: 'Name und Nachname dürfen nicht leer sein!' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      await updateProfile(user, {
        displayName: newName.trim()
      });

      setMessage({ type: 'success', text: 'Name und Nachname erfolgreich aktualisiert!' });
      setIsEditingName(false);

      // 3 saniye sonra mesajı otomatik temizle
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Beim Aktualisieren des Namens und Nachnames ist ein Fehler aufgetreten:', error);
      setMessage({ type: 'error', text: 'Beim Aktualisieren des Namens und Nachnames ist ein Fehler aufgetreten.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Geben Sie eine gültige E-Mail-Adresse ein!' });
      return;
    }

    if (!password.trim()) {
      setPasswordError('Passwort ist erforderlich!');
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      setPasswordError('');

      // Önce şifre ile yeniden doğrula
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Yeni email adresine doğrulama maili gönder
      await verifyBeforeUpdateEmail(user, newEmail.trim());

      setMessage({ 
        type: 'success', 
        text: `${newEmail} E-Mail-Adresse wurde erfolgreich aktualisiert. Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Link, um Ihre E-Mail-Adresse zu aktualisieren.` 
      });
      setIsEditingEmail(false);
      setShowPasswordModal(false);
      setPassword('');
      setNewEmail('');

      // 5 saniye sonra mesajı otomatik temizle
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    } catch (error) {
      console.error('Beim Aktualisieren der E-Mail-Adresse ist ein Fehler aufgetreten:', error);
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Falsches Passwort!');
      } else if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Diese E-Mail-Adresse ist bereits in Verwendung!' });
      } else if (error.code === 'auth/invalid-email') {
        setMessage({ type: 'error', text: 'Geben Sie eine gültige E-Mail-Adresse ein!' });
      } else if (error.code === 'auth/operation-not-allowed') {
        setMessage({ type: 'error', text: 'Die E-Mail-Adresse kann derzeit nicht aktualisiert werden.' });
      } else {
        setMessage({ type: 'error', text: 'Beim Aktualisieren der E-Mail-Adresse ist ein Fehler aufgetreten.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.trim()) {
      setMessage({ type: 'error', text: 'Die Telefonnummer darf nicht leer sein!' });
      return;
    }

    // Güçlü telefon validation
    if (!validatePhone(newPhone.trim())) {
      setMessage({ type: 'error', text: 'Geben Sie eine gültige Telefonnummer ein!' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      await updateUserProfile({
        phone: newPhone.trim()
      });

      setMessage({ type: 'success', text: 'Die Telefonnummer wurde erfolgreich aktualisiert!' });
      setIsEditingPhone(false);

      // 3 saniye sonra mesajı otomatik temizle
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Beim Aktualisieren der Telefonnummer ist ein Fehler aufgetreten:', error);
      setMessage({ type: 'error', text: 'Beim Aktualisieren der Telefonnummer ist ein Fehler aufgetreten.' });
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
      setMessage({ type: 'success', text: 'E-Mail-Bestätigung gesendet! Bitte überprüfen Sie Ihre E-Mail und klicken Sie auf den Link, um Ihre E-Mail-Adresse zu aktualisieren.' });
    } catch (error) {
      console.error('Beim Senden der E-Mail-Bestätigung ist ein Fehler aufgetreten:', error);
      setMessage({ type: 'error', text: 'Beim Senden der E-Mail-Bestätigung ist ein Fehler aufgetreten.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Persönliche Informationen</h2>
        <p className="text-gray-600">
          Aktualisieren und verwalten Sie Ihre Kontoinformationen.
        </p>
      </div>

      {/* Mesaj Gösterimi */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ease-in-out ${message.type === 'success'
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Name und Nachname</h3>
          <div className="space-y-4">
            {isEditingName ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neuer Name und Nachname</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Geben Sie Ihren Namen und Nachnamen ein"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdateName}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Aktualisieren...' : 'Aktualisieren'}
                  </button>
                  <button
                    onClick={() => cancelEdit('name')}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aktueller Name und Nachname</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user?.displayName || 'Belirtilmemiş'}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                >
                  Bearbeiten
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Email Güncelleme */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Mail-Adresse</h3>
          <div className="space-y-4">
            {isEditingEmail ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neue E-Mail-Adresse</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(sanitizeInput(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                  />
                </div>

                {/* Şifre Modal */}
                {showPasswordModal && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Sicherheitsbestätigung</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Um Ihre E-Mail-Adresse zu ändern, geben Sie Ihr aktuelles Passwort ein.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aktuelles Passwort</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError('');
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${passwordError ? 'border-red-300' : 'border-gray-300'
                            }`}
                          placeholder="Geben Sie Ihr Passwort ein"
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
                    {loading ? 'Aktualisieren...' : 'Aktualisieren'}
                  </button>
                  <button
                    onClick={() => cancelEdit('email')}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aktuelle E-Mail-Adresse</p>
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
                  Bearbeiten
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Telefon Numarası Güncelleme */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Telefonnummer</h3>
          <div className="space-y-4">
            {isEditingPhone ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neue Telefonnummer</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(sanitizeInput(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Geben Sie Ihre Telefonnummer ein"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdatePhone}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Aktualisieren...' : 'Aktualisieren'}
                  </button>
                  <button
                    onClick={() => cancelEdit('phone')}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aktuelle Telefonnummer</p>
                  <p className="text-lg font-medium text-gray-900">
                    {userProfile?.phone || 'Belirtilmemiş'}
                  </p>
                  {!userProfile?.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Um an einem Spiel teilzunehmen, ist eine Telefonnummer erforderlich
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                >
                  {userProfile?.phone ? 'Bearbeiten' : 'Hinzufügen'}
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
                <h3 className="text-lg font-semibold text-blue-800 mb-2">E-Mail-Bestätigung</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Um Ihre E-Mail-Adresse zu bestätigen, klicken Sie auf den folgenden Button.
                  Eine Bestätigungs-E-Mail wird gesendet, und Sie können alle Funktionen nutzen, nachdem Sie Ihre E-Mail-Adresse bestätigt haben.
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSendEmailVerification}
                    disabled={loading || emailVerificationSent}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Senden...' : emailVerificationSent ? 'E-Mail gesendet' : 'E-Mail bestätigen'}
                  </button>
                  {emailVerificationSent && (
                    <span className="text-green-600 text-sm font-medium">✅ E-Mail-Bestätigung gesendet</span>
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
                <h3 className="text-lg font-semibold text-green-800 mb-2">E-Mail bestätigt</h3>
                <p className="text-green-700 text-sm">
                  Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können alle Funktionen nutzen.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Bildirimler Tab'ı
function NotificationsTab() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Benachrichtigungseinstellungen</h2>
        <p className="text-gray-600">
          Verwalten und aktualisieren Sie Ihre Benachrichtigungseinstellungen.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Benachrichtigungstypen</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Spielbestätigungen</h4>
                <p className="text-sm text-gray-600">Sie erhalten eine Benachrichtigung, wenn Ihr Spiel bestätigt wird</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Erinnerungen</h4>
                <p className="text-sm text-gray-600">Sie erhalten eine Erinnerung, bevor Ihr Spiel beginnt</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Spezielle Angebote</h4>
                <p className="text-sm text-gray-600">Sie erhalten Informationen zu speziellen Angeboten und Rabatten</p>
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
  const { user, logout, deletedUser } = useAuth();
  const navigate = useNavigate();
  const [showPasswordAccordion, setShowPasswordAccordion] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Erfolgreich abgemeldet!")
    } catch (error) {
      console.error('Beim Abmelden ist ein Fehler aufgetreten:', error);
      toast.error("Beim Abmelden ist ein Fehler aufgetreten!")
    }
  };

  const handleDeleteUser = async () => {
    if (!password) {
      setMessage({ type: 'error', text: 'Um Ihr Konto zu löschen, müssen Sie Ihr Passwort eingeben.' });
      return;
    }
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      await deletedUser(password);
      toast.success('Ihr Konto wurde erfolgreich gelöscht.');
      navigate('/login');
    } catch (error) {
      console.error('Beim Löschen des Kontos ist ein Fehler aufgetreten:', error);
      setMessage({ type: 'error', text: error.message || 'Beim Löschen des Kontos ist ein Fehler aufgetreten.' });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setPassword('');
    }
  };


  const handlePasswordChange = async () => {
    setMessage({ type: '', text: '' });
    if (!currentPassword || !newPassword || !newPasswordRepeat) {
      setMessage({ type: 'error', text: 'Bitte füllen Sie alle Felder aus.' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Das neue Passwort muss mindestens 6 Zeichen lang sein.' });
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      setMessage({ type: 'error', text: 'Die neuen Passwörter stimmen nicht überein.' });
      return;
    }
    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success('Passwort erfolgreich geändert! Aus Sicherheitsgründen wird abgemeldet.');
      handleLogout();
      // setCurrentPassword('');
      // setNewPassword('');
      // setNewPasswordRepeat('');
      // setShowPasswordAccordion(false);
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: 'Das aktuelle Passwort ist falsch.' });
      } else if (error.code === 'auth/weak-password') {
        setMessage({ type: 'error', text: 'Das neue Passwort ist zu schwach.' });
      } else {
        setMessage({ type: 'error', text: 'Beim Ändern des Passworts ist ein Fehler aufgetreten.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sicherheitseinstellungen</h2>
        <p className="text-gray-600">
          Erhöhen und schützen Sie die Sicherheit Ihres Kontos.
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg transition-all duration-300 ease-in-out ${message.type === 'success'
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontosicherheit</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium text-gray-900">Passwort ändern</h4>
                <p className="text-sm text-gray-600">Aktualisieren Sie Ihr Passwort sicher und sicher</p>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                onClick={() => setShowPasswordAccordion(!showPasswordAccordion)}
              >
                {showPasswordAccordion ? 'Schließen' : 'Ändern'}
              </button>
            </div>
            {/* Accordion İçeriği */}
            {showPasswordAccordion && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200 animate-fade-in">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aktuelles Passwort</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Geben Sie Ihr aktuelles Passwort ein"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Neues Passwort</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Geben Sie Ihr neues Passwort ein"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Neues Passwort (Wiederholen)</label>
                  <input
                    type="password"
                    value={newPasswordRepeat}
                    onChange={e => setNewPasswordRepeat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Geben Sie Ihr neues Passwort erneut ein"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Speichern...' : 'Passwort aktualisieren'}
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
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div className="bg-gray-50 p-6 rounded-xl">
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
        </div> */}

        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sitzungsverlauf</h3>
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div>
              <h4 className="font-medium text-gray-900">Sitzungsverlauf</h4>
              <p className="text-sm text-gray-600">Sehen Sie sich Ihre aktiven Sitzungen an</p>
            </div>
            <button
              onClick={() => setShowSessionHistory(!showSessionHistory)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
            >
              {showSessionHistory ? 'Schließen' : 'Anzeigen'}
            </button>
          </div>
          {showSessionHistory && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 animate-fade-in">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Sitzungsinformationen</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Letzte Anmeldung:</span>
                  <span>{new Date(user.metadata.lastSignInTime).toLocaleString('de-DE')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Konto erstellt:</span>
                  <span>{new Date(user.metadata.creationTime).toLocaleString('de-DE')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
          >
            Konto löschen
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Konto löschen</h2>
            <p className="text-gray-600 mb-6">
              Dieser Vorgang kann nicht rückgängig gemacht werden. Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten? Geben Sie bitte Ihr Passwort ein, um fortzufahren.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ihr Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Geben Sie Ihr Passwort ein"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword('');
                  setMessage({ type: '', text: '' });
                }}
                disabled={loading}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Löschen...' : 'Konto dauerhaft löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile; 