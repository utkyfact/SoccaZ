import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import { useNotifications } from '../../context/NotificationContext';
import QRCode from 'qrcode';
import ConfirmationModal from '../ConfirmationModal';

function MatchOrganization() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedMatchForParticipants, setSelectedMatchForParticipants] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState(null);
  const { createNotification } = useNotifications();
  const qrCanvasRef = useRef(null);
  const mapRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fieldName: '',
    date: '',
    time: '',
    maxParticipants: 20,
    location: '',
    locationCoords: null, // {lat, lng, address}
    sendNotification: false
  });

  // Maçları getir
  const fetchData = async () => {
    try {
      setLoading(true);

      // Maçları getir
      const matchesQuery = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
      const matchesSnapshot = await getDocs(matchesQuery);
      const matchesData = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMatches(matchesData);

    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      toast.error('Fehler beim Laden der Daten.');
    } finally {
      setLoading(false);
    }
  };

  // Aktif maçları filtrele (bugünden sonraki maçlar)
  const getActiveMatches = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün başlangıcı
    
    return matches.filter(match => {
      if (!match.date) return false;
      
      const matchDate = new Date(match.date);
      matchDate.setHours(0, 0, 0, 0);
      
      return matchDate >= today;
    });
  };

  // Süresi biten maçları filtrele (bugünden önceki maçlar)
  const getExpiredMatches = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün başlangıcı
    
    return matches.filter(match => {
      if (!match.date) return false;
      
      const matchDate = new Date(match.date);
      matchDate.setHours(0, 0, 0, 0);
      
      return matchDate < today;
    });
  };

  // QR kod oluştur
  const generateQRCode = async (matchId) => {
    try {
      const matchUrl = `${window.location.origin}/match/${matchId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(matchUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#16a34a',
          light: '#ffffff'
        }
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Fehler beim Generieren des QR-Codes:', error);
      return null;
    }
  };

  // Tüm kullanıcılara bildirim gönder
  const sendNotificationToAllUsers = async (matchData) => {
    try {
      // Tüm kullanıcıları getir
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Her kullanıcıya bildirim gönder
      const notificationPromises = users.map(user =>
        createNotification(
          user.id,
          '🏆 Neue Match-Organisation!',
          `${matchData.title} - ${new Date(matchData.date).toLocaleDateString('de-DE')} ${matchData.time}. Um teilzunehmen, scannen Sie den QR-Code!`,
          'info',
          `/match/${matchData.id}`
        )
      );

      await Promise.all(notificationPromises);
      toast.success(`${users.length} Benutzer benachrichtigt!`);
    } catch (error) {
      console.error('Fehler beim Senden der Benachrichtigungen:', error);
      toast.error('Fehler beim Senden der Benachrichtigungen.');
    }
  };

  // Yeni maç oluştur
  const createMatch = async (e) => {
    e.preventDefault();
    if (!formData.fieldName || !formData.date || !formData.time) {
      toast.warning('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    setCreating(true);
    try {
      // Tarih ve saati birleştir
      const matchDateTime = new Date(`${formData.date}T${formData.time}`);

      const matchData = {
        title: formData.title,
        description: formData.description,
        fieldName: formData.fieldName,
        date: formData.date, // String olarak kaydet
        time: formData.time,
        maxParticipants: parseInt(formData.maxParticipants),
        location: formData.location,
        locationCoords: formData.locationCoords, // Koordinat bilgisi
        participants: [],
        status: 'active',
        createdAt: new Date()
      };

      // Maçı oluştur
      const docRef = await addDoc(collection(db, 'matches'), matchData);
      const newMatch = { id: docRef.id, ...matchData };

      // QR kod oluştur
      const qrCode = await generateQRCode(docRef.id);
      if (qrCode) {
        await updateDoc(doc(db, 'matches', docRef.id), { qrCode });
        newMatch.qrCode = qrCode;
      }

      setMatches([newMatch, ...matches]);

      // Bildirim gönder
      if (formData.sendNotification) {
        await sendNotificationToAllUsers({ ...newMatch, id: docRef.id });
      }

      toast.success('Match erfolgreich erstellt!');

      // Formu temizle
      setFormData({
        title: '',
        description: '',
        fieldName: '',
        date: '',
        time: '',
        maxParticipants: 20,
        location: '',
        locationCoords: null,
        sendNotification: false
      });
      setShowCreateForm(false);

    } catch (error) {
      console.error('Fehler beim Erstellen des Matches:', error);
      toast.error('Fehler beim Erstellen des Matches.');
    } finally {
      setCreating(false);
    }
  };

  // Maç silme modalını aç
  const openDeleteModal = (matchId) => {
    setMatchToDelete(matchId);
    setShowDeleteModal(true);
  };

  // Maç sil onayı
  const confirmDeleteMatch = async () => {
    if (!matchToDelete) return;

    try {
      await deleteDoc(doc(db, 'matches', matchToDelete));
      setMatches(matches.filter(m => m.id !== matchToDelete));
      if (selectedMatch?.id === matchToDelete) setSelectedMatch(null);
      toast.success('Match erfolgreich gelöscht.');
    } catch (error) {
      toast.error('Fehler beim Löschen des Matches.');
    } finally {
      setShowDeleteModal(false);
      setMatchToDelete(null);
    }
  };

  // Maç silme modalını kapat
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setMatchToDelete(null);
  };

  // QR kod göster
  const showQRCode = (match) => {
    setSelectedMatch(match);
    setQrCodeUrl(match.qrCode || '');
  };

  // QR kod indirme
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `mac-qr-${selectedMatch?.title || 'maç'}.png`;
    link.click();
  };

  // Web Share API ile paylaş
  const shareMatch = async () => {
    if (!selectedMatch) return;

    const matchUrl = `${window.location.origin}/match/${selectedMatch.id}`;
    const shareData = {
      title: `⚽ ${selectedMatch.title}`,
      text: `${selectedMatch.title} - ${selectedMatch.date?.toDate?.()?.toLocaleDateString('de-DE')} ${selectedMatch.date?.toDate?.()?.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - ${selectedMatch.fieldName}`,
      url: matchUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Match geteilt!');
      } else {
        // Web Share API desteklenmiyorsa URL'i kopyala
        await navigator.clipboard.writeText(matchUrl);
        toast.success('Match-Link kopiert!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fehler beim Teilen:', error);
        // Fallback: URL'i kopyala
        try {
          await navigator.clipboard.writeText(matchUrl);
          toast.success('Match-Link kopiert!');
        } catch (copyError) {
          toast.error('Teilen fehlgeschlagen.');
        }
      }
    }
  };

  // Sosyal medya paylaşım linkleri
  const getSocialShareLinks = () => {
    if (!selectedMatch) return {};

    const matchUrl = `${window.location.origin}/match/${selectedMatch.id}`;

    // Tarih ve saat formatını düzelt
    const formatDateTime = (dateString, timeString) => {
      try {
        // Eğer date string formatında geliyorsa
        if (typeof dateString === 'string' && timeString) {
          // Tarih formatı: "2025-07-23" -> "23.07.2025"
          const [year, month, day] = dateString.split('-');
          const formattedDate = `${day}.${month}.${year}`;

          // Saat formatı zaten doğru: "18:30"
          return { date: formattedDate, time: timeString };
        }

        // Eğer Firestore Timestamp formatında geliyorsa (fallback)
        if (dateString?.toDate) {
          const date = dateString.toDate();
          return {
            date: date.toLocaleDateString('de-DE'),
            time: date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
          };
        }

        // Eğer hiçbiri değilse
        return { date: 'Datum unbekannt', time: 'Uhrzeit unbekannt' };

      } catch (error) {
        console.error('Fehler beim Formatieren des Datums:', error);
        return { date: 'Datum unbekannt', time: 'Uhrzeit unbekannt' };
      }
    };

    // Formatlanmış tarih ve saati al
    const { date: formattedDate, time: formattedTime } = formatDateTime(selectedMatch.date, selectedMatch.time);
    const text = `⚽ ${selectedMatch.title} - ${formattedDate} ${formattedTime} - ${selectedMatch.fieldName}`;

    return {
      instagram: `https://www.instagram.com/`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${matchUrl}`)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(matchUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(matchUrl)}&quote=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(matchUrl)}&text=${encodeURIComponent(text)}`
    };
  };

  const openSocialShare = (platform) => {
    const links = getSocialShareLinks();
    if (links[platform]) {
      if (platform === 'instagram') {
        toast.info('Sie können den QR-Code herunterladen und in Ihren Instagram-Story einfügen!');
        downloadQRCode();
      } else {
        window.open(links[platform], '_blank', 'width=600,height=400');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Harita modalını aç
  const openLocationModal = () => {
    setShowLocationModal(true);
  };

  // Harita modalını kapat
  const closeLocationModal = () => {
    setShowLocationModal(false);
    setSelectedLocation(null);
  };

  // Mevcut konumu al
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Ihr Browser unterstützt keine Standortdienste.');
      return;
    }

    toast.info('Standort wird abgerufen...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setSelectedLocation({
          lat,
          lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });

        toast.success('Aktueller Standort abgerufen! Sie können den Adressen optional bearbeiten.');
      },
      (error) => {
        console.error('Fehler beim Abrufen des Standorts:', error);
        toast.error('Standort konnte nicht abgerufen werden. Bitte geben Sie manuell ein.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Konumu seç ve form'a ekle
  const selectLocation = () => {
    if (selectedLocation && selectedLocation.address.trim()) {
      setFormData({
        ...formData,
        location: selectedLocation.address,
        locationCoords: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address: selectedLocation.address
        }
      });
      closeLocationModal();
      toast.success('Standort ausgewählt!');
    } else {
      toast.warning('Bitte geben Sie eine gültige Adresse ein.');
    }
  };

  // Manuel koordinat girişi ile preview
  const previewLocation = () => {
    if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`;
      window.open(mapsUrl, '_blank');
    } else {
      toast.info('Bitte wählen Sie zuerst einen Standort oder geben Sie Koordinaten manuell ein.');
    }
  };

  // Katılımcıları getir ve modal aç
  const showParticipants = async (match) => {
    setSelectedMatchForParticipants(match);
    setShowParticipantsModal(true);

    if (!match.participants || match.participants.length === 0) {
      setParticipants([]);
      return;
    }

    setLoadingParticipants(true);
    try {
      // Katılımcı ID'lerini kullanarak kullanıcı bilgilerini getir
      const participantPromises = match.participants.map(async (p) => {
        const userId = typeof p === 'string' ? p : (p.userId || p.id);
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            return {
              id: userId,
              ...userDoc.data(),
              joinedAt: new Date() // Katılım tarihini maç oluşturma tarihi olarak varsay
            };
          }
          return {
            id: userId,
            displayName: 'Benutzer nicht gefunden',
            email: 'Unbekannt',
            joinedAt: new Date()
          };
        } catch (error) {
          console.error('Fehler beim Abrufen der Benutzerinformationen:', error);
          return {
            id: userId,
            displayName: 'Fehler: Benutzer konnte nicht geladen werden',
            email: 'Unbekannt',
            joinedAt: new Date()
          };
        }
      });
      const participantDetails = await Promise.all(participantPromises);
      setParticipants(participantDetails);
    } catch (error) {
      console.error('Fehler beim Abrufen der Teilnehmer:', error);
      toast.error('Fehler beim Laden der Teilnehmerinformationen.');
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Katılımcılar modalını kapat
  const closeParticipantsModal = () => {
    setShowParticipantsModal(false);
    setSelectedMatchForParticipants(null);
    setParticipants([]);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Matches werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Match-Organisation</h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Erstellen und verwalten Sie Matches</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer text-sm lg:text-base"
          >
            {showCreateForm ? '❌ Abbrechen' : '⚽ Neues Match organisieren'}
          </button>
        </div>
      </div>

      {/* Maç Oluşturma Formu */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-medium text-gray-800 mb-4">Neues Match erstellen</h3>
          <form onSubmit={createMatch} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match-Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Beispiel: Samstag Match"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schaftitel *</label>
                <input
                  type="text"
                  value={formData.fieldName}
                  onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Beispiel: A-Schaft, Zentral-Schaft, Ost-Schaft"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uhrzeit *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximale Teilnehmer</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="2"
                  max="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Standort</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Geben Sie eine Adresse manuell ein oder wählen Sie sie auf der Karte"
                />
                <button
                  type="button"
                  onClick={openLocationModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  🗺️ Harita
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                📍 Die Benutzer können auf Google Maps auf diesen Standort zugreifen
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Details zum Match..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="sendNotification"
                checked={formData.sendNotification}
                onChange={(e) => setFormData({ ...formData, sendNotification: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="sendNotification" className="text-sm text-gray-700">
                🔔 Alle Benutzer benachrichtigen
              </label>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {creating ? '⚽ Match wird erstellt...' : '⚽ Match erstellen'}
            </button>
          </form>
        </div>
      )}

      {/* Aktif Maçlar Listesi */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Aktive Matches ({getActiveMatches().length})</h3>
          <p className="text-sm text-gray-600 mt-1">Matches ab heute</p>
        </div>

        {getActiveMatches().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Keine aktiven Matches</h3>
            <p className="text-gray-600">Erstellen Sie einen neuen Match!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {getActiveMatches().map((match) => (
              <div key={match.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{match.title}</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>🏟️ <strong>Saha:</strong> {match.fieldName}</p>
                      <p>📅 <strong>Datum:</strong> {match.date ? new Date(match.date).toLocaleDateString('de-DE') : 'Datum unbekannt'}</p>
                      <p>🕐 <strong>Uhrzeit:</strong> {match.time || 'Uhrzeit unbekannt'}</p>
                      <p>👥 <strong>Teilnehmer:</strong>
                        <button
                          onClick={() => showParticipants(match)}
                          className="text-blue-600 hover:text-blue-700 underline ml-1 cursor-pointer"
                          title="Teilnehmer anzeigen"
                        >
                          {match.participants?.length || 0} / {match.maxParticipants}
                        </button>
                      </p>
                      {match.location && <p>📍 <strong>Standort:</strong> {match.location}</p>}
                      {match.description && <p>📝 <strong>Beschreibung:</strong> {match.description}</p>}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {match.qrCode && (
                      <button
                        onClick={() => showQRCode(match)}
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        📱 QR-Code
                      </button>
                    )}
                    <button
                      onClick={() => openDeleteModal(match.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Süresi Biten Maçlar Listesi */}
      {getExpiredMatches().length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Abgelaufene Matches ({getExpiredMatches().length})</h3>
            <p className="text-sm text-gray-600 mt-1">Vergangene Matches</p>
          </div>

          <div className="divide-y divide-gray-200">
            {getExpiredMatches().map((match) => (
              <div key={match.id} className="p-6 hover:bg-gray-50 opacity-75">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-gray-900">{match.title}</h4>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">Vergangen</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>🏟️ <strong>Match-Schaft:</strong> {match.fieldName}</p>
                      <p>📅 <strong>Datum:</strong> {match.date ? new Date(match.date).toLocaleDateString('de-DE') : 'Datum unbekannt'}</p>
                      <p>🕐 <strong>Uhrzeit:</strong> {match.time || 'Uhrzeit unbekannt'}</p>
                      <p>👥 <strong>Teilnehmer:</strong>
                        <button
                          onClick={() => showParticipants(match)}
                          className="text-blue-600 hover:text-blue-700 underline ml-1 cursor-pointer"
                          title="Teilnehmer anzeigen"
                        >
                          {match.participants?.length || 0} / {match.maxParticipants}
                        </button>
                      </p>
                      {match.location && <p>📍 <strong>Standort:</strong> {match.location}</p>}
                      {match.description && <p>📝 <strong>Beschreibung:</strong> {match.description}</p>}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => showParticipants(match)}
                      className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                      title="Teilnehmer anzeigen"
                    >
                      👥 Teilnehmer
                    </button>
                    <button
                      onClick={() => openDeleteModal(match.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Kod Modal */}
      {selectedMatch && qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">QR-Code - {selectedMatch.title}</h3>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="text-center">
                <img src={qrCodeUrl} alt="QR Kod" className="mx-auto mb-4 border border-gray-200 rounded" />
                <p className="text-sm text-gray-600 mb-6">
                  Dieser QR-Code kann auf sozialen Medien geteilt werden, um Benutzern das Teilnehmen an Ihrem Match zu ermöglichen.
                </p>

                {/* Sosyal Medya Paylaşım Butonları */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Soziale Medien teilen</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {/* WhatsApp */}
                    <button
                      onClick={() => openSocialShare('whatsapp')}
                      className="flex flex-col items-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      title="WhatsApp teilen"
                    >
                      <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                      <span className="text-xs">WhatsApp</span>
                    </button>

                    {/* Instagram */}
                    <button
                      onClick={() => openSocialShare('instagram')}
                      className="flex flex-col items-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
                      title="Instagram teilen"
                    >
                      <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span className="text-xs">Instagram</span>
                    </button>

                    {/* Twitter/X */}
                    <button
                      onClick={() => openSocialShare('twitter')}
                      className="flex flex-col items-center p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
                      title="X teilen"
                    >
                      <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-xs">X</span>
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={() => openSocialShare('facebook')}
                      className="flex flex-col items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      title="Facebook teilen"
                    >
                      <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-xs">Facebook</span>
                    </button>

                    {/* Telegram */}
                    <button
                      onClick={() => openSocialShare('telegram')}
                      className="flex flex-col items-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      title="Telegram teilen"
                    >
                      <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                      <span className="text-xs">Telegram</span>
                    </button>
                  </div>
                </div>

                {/* Genel Paylaşım ve İndirme Butonları */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={shareMatch}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <span className="mr-2">📤</span>
                    Teilen
                  </button>

                  <button
                    onClick={downloadQRCode}
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <span className="mr-2">📥</span>
                    Herunterladen
                  </button>

                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors cursor-pointer flex items-center justify-center"
                  >
                    <span className="mr-2">❌</span>
                    Schließen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Katılımcılar Modalı */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">👥 Teilnehmer</h2>
                <button
                  onClick={closeParticipantsModal}
                  className="text-white hover:text-green-200 transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
              {selectedMatchForParticipants && (
                <p className="text-green-100 mt-2">
                  {selectedMatchForParticipants.title} - {selectedMatchForParticipants.participants?.length || 0} / {selectedMatchForParticipants.maxParticipants} kişi
                </p>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingParticipants ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Teilnehmer werden geladen...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Noch keine Teilnehmer</h3>
                  <p className="text-gray-600">Noch keiner hat an diesem Match teilgenommen.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {participants.map((participant, index) => (
                      <div key={participant.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {(participant.displayName || participant.email || 'U').charAt(0).toUpperCase()}
                            </div>

                            {/* Kullanıcı Bilgileri */}
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {participant.displayName || 'Unbekannter Benutzer'}
                              </h4>
                              <p className="text-sm text-gray-600">{participant.email}</p>
                              {participant.phone && (
                                <p className="text-sm text-gray-500">📞 {participant.phone}</p>
                              )}
                            </div>
                          </div>

                          {/* Sıra Numarası */}
                          <div className="text-right">
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                              #{index + 1}
                            </span>
                          </div>
                        </div>

                        {/* Ek Bilgiler */}
                        {(participant.createdAt || participant.age) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-500">
                              {participant.createdAt && (
                                <span>
                                  🗓️ Registrierung: {participant.createdAt.toDate?.()?.toLocaleDateString('de-DE') || 'Unbekannt'}
                                </span>
                              )}
                              {participant.age && (
                                <span>🎂 Alter: {participant.age}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Özet Bilgiler */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">📊 Özet</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                      <div>
                        <span className="font-medium">Gesamte Teilnehmer:</span> {participants.length}
                      </div>
                      <div>
                        <span className="font-medium">Verfügbare Plätze:</span> {(selectedMatchForParticipants?.maxParticipants || 0) - participants.length}
                      </div>
                      <div>
                        <span className="font-medium">Auslastung:</span> {selectedMatchForParticipants?.maxParticipants ? Math.round((participants.length / selectedMatchForParticipants.maxParticipants) * 100) : 0}%
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {participants.length >= (selectedMatchForParticipants?.maxParticipants || 0) ? '🔴 Voll' : '🟢 Verfügbar'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Kapat Butonu */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={closeParticipantsModal}
                  className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Harita Modalı */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">📍 Standort auswählen</h2>
                <button
                  onClick={closeLocationModal}
                  className="text-white hover:text-blue-200 transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-100 mt-2">Wählen Sie Ihren aktuellen Standort oder geben Sie ihn manuell ein</p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Mevcut Konum Butonu */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center"
                  >
                    <span className="mr-2">📍</span>
                    Aktuellen Standort verwenden
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Browser-Berechtigung erforderlich. Lädt GPS-Koordinaten.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Oder geben Sie manuell ein:</p>
                </div>

                {/* Manuel Adres Girişi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={selectedLocation?.address || ''}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      address: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Beispiel: Gelsenkirchen, Veltins-Arena"
                  />
                </div>

                {/* Manuel Koordinat Girişi */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breitengrad (Latitude)</label>
                    <input
                      type="number"
                      step="any"
                      value={selectedLocation?.lat || ''}
                      onChange={(e) => setSelectedLocation({
                        ...selectedLocation,
                        lat: parseFloat(e.target.value) || null
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="51.554851"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Längengrad (Longitude)</label>
                    <input
                      type="number"
                      step="any"
                      value={selectedLocation?.lng || ''}
                      onChange={(e) => setSelectedLocation({
                        ...selectedLocation,
                        lng: parseFloat(e.target.value) || null
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="7.068550"
                    />
                  </div>
                </div>

                {/* Preview Butonu */}
                {selectedLocation && selectedLocation.lat && selectedLocation.lng && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={previewLocation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center"
                    >
                      <span className="mr-2">🔍</span>
                      Google Maps ansehen
                    </button>
                  </div>
                )}

                {/* Seçilen Konum Gösterimi */}
                {selectedLocation && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2">✅ Ausgewählter Standort:</h4>
                    <p className="text-sm text-green-700"><strong>Adres:</strong> {selectedLocation.address}</p>
                    {selectedLocation.lat && selectedLocation.lng && (
                      <p className="text-sm text-green-700">
                        <strong>Koordinaten:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Butonları */}
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeLocationModal}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={selectLocation}
                  disabled={!selectedLocation || !selectedLocation.address.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Standort auswählen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteMatch}
        title="Match löschen"
        message="Sind Sie sicher, dass Sie diesen Match löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden."
        confirmText="Löschen"
        cancelText="Abbrechen"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}

export default MatchOrganization; 