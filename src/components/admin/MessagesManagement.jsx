import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';
import ConfirmationModal from '../ConfirmationModal';

function MessagesManagement() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read, replied
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    messageId: null,
    messageName: ''
  });

  // Mesajları getir
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    } catch (error) {
      console.error('Fehler beim Abrufen der Nachrichten:', error);
      toast.error('Fehler beim Laden der Nachrichten.');
    } finally {
      setLoading(false);
    }
  };

  // Mesaj durumunu güncelle
  const updateMessageStatus = async (messageId, status) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: status,
        updatedAt: new Date()
      });
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      toast.success('Nachrichtenstatus aktualisiert.');
      
      // Sidebar'daki badge'i güncelle için custom event gönder
      window.dispatchEvent(new CustomEvent('messageStatusChanged'));
    } catch (error) {
      toast.error('Fehler beim Aktualisieren des Status.');
    }
  };

  // Mesaj sil modal açma
  const openDeleteModal = (messageId, messageName) => {
    setDeleteModal({
      isOpen: true,
      messageId,
      messageName
    });
  };

  // Mesaj sil modal kapama
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      messageId: null,
      messageName: ''
    });
  };

  // Mesaj sil
  const deleteMessage = async () => {
    try {
      await deleteDoc(doc(db, 'messages', deleteModal.messageId));
      setMessages(messages.filter(msg => msg.id !== deleteModal.messageId));
      if (selectedMessage && selectedMessage.id === deleteModal.messageId) {
        setSelectedMessage(null);
      }
      toast.success('Nachricht gelöscht.');
      closeDeleteModal();
      
      // Sidebar'daki badge'i güncelle için custom event gönder
      window.dispatchEvent(new CustomEvent('messageStatusChanged'));
    } catch (error) {
      toast.error('Fehler beim Löschen der Nachricht.');
    }
  };

  // Filtrelenmiş mesajlar
  const filteredMessages = messages.filter(message => {
    // Durum filtresi
    if (filter !== 'all' && message.status !== filter) return false;
    
    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        message.name?.toLowerCase().includes(searchLower) ||
        message.email?.toLowerCase().includes(searchLower) ||
        message.subject?.toLowerCase().includes(searchLower) ||
        message.message?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Nachrichten werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Nachrichten</h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Verwalten Sie Nachrichten aus dem Kontaktformular</p>
          </div>
          <button
            onClick={fetchMessages}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer text-sm lg:text-base"
          >
            🔄 Aktualisieren
          </button>
        </div>
      </div>

      {/* Filtreler */}
      <div className="border-b border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Durum Filtresi */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Alle ({messages.length})</option>
              <option value="unread">Ungelesen ({messages.filter(m => m.status === 'unread').length})</option>
              <option value="read">Gelesen ({messages.filter(m => m.status === 'read').length})</option>
              <option value="replied">Beantwortet ({messages.filter(m => m.status === 'replied').length})</option>
            </select>
          </div>

          {/* Arama */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Suche</label>
            <input
              type="text"
              placeholder="Suche nach Name, E-Mail, Betreff oder Nachricht..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mesaj Listesi */}
        <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-3">
              {filteredMessages.length} Nachrichten gefunden
            </h3>
            <div className="space-y-2 max-h-64 lg:max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? 'bg-green-50 border-green-200 border'
                      : 'hover:bg-gray-50'
                  } ${message.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {message.name}
                    </h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      message.status === 'unread' ? 'bg-blue-100 text-blue-800' :
                      message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {message.status === 'unread' ? 'Ungelesen' :
                       message.status === 'read' ? 'Gelesen' : 'Beantwortet'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{message.email}</p>
                  <p className="text-sm text-gray-700 truncate">{message.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.createdAt?.toDate?.()?.toLocaleDateString('de-DE') || 'Datum unbekannt'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mesaj Detayı */}
        <div className="flex-1 p-4 lg:p-6">
          {selectedMessage ? (
            <div>
              {/* Mesaj Header */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900">{selectedMessage.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Von:</strong> {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedMessage.createdAt?.toDate?.()?.toLocaleString('de-DE') || 'Datum unbekannt'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Durum Değiştirme */}
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
                    >
                      <option value="unread">Ungelesen</option>
                      <option value="read">Gelesen</option>
                      <option value="replied">Beantwortet</option>
                    </select>
                    {/* Sil */}
                    <button
                      onClick={() => openDeleteModal(selectedMessage.id, selectedMessage.name)}
                      className="text-red-600 hover:text-red-800 text-xs px-2 py-1 cursor-pointer"
                    >
                      🗑️ Löschen
                    </button>
                  </div>
                </div>
              </div>

              {/* Mesaj İçeriği */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Hızlı Yanıt */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Hızlı Yanıt</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      const mailtoLink = `mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}&body=${encodeURIComponent(`Sehr geehrte/r ${selectedMessage.name},\n\n`)}`;
                      
                      // iPhone Safari için alternatif yöntem
                      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                        // iOS için daha detaylı e-posta bilgilerini kopyala
                        const emailInfo = `E-Mail-Adresse: ${selectedMessage.email}\nBetreff: Re: ${selectedMessage.subject}\n\nNachricht von: ${selectedMessage.name}\nUrsprüngliche Nachricht:\n${selectedMessage.message}`;
                        
                        navigator.clipboard.writeText(emailInfo).then(() => {
                          toast.success('E-Mail-Informationen in die Zwischenablage kopiert! Öffnen Sie Ihre E-Mail-App.');
                        }).catch(() => {
                          // Fallback: window.open ile dene
                          try {
                            window.open(mailtoLink, '_blank');
                          } catch (error) {
                            // Son çare: kullanıcıya manuel kopyalama seçeneği
                            const manualInfo = `E-Mail: ${selectedMessage.email}\nBetreff: Re: ${selectedMessage.subject}`;
                            navigator.clipboard.writeText(manualInfo);
                            toast.info('E-Mail-Adresse in die Zwischenablage kopiert!');
                          }
                        });
                      } else {
                        // Diğer cihazlar için normal mailto
                        try {
                          window.location.href = mailtoLink;
                        } catch (error) {
                          // Fallback
                          window.open(mailtoLink, '_blank');
                        }
                      }
                    }}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors cursor-pointer text-center"
                  >
                    📧 E-Mail senden
                  </button>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                    className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    ✅ Als beantwortet markieren
                  </button>
                </div>
                
                {/* iPhone için ek bilgi */}
                {/iPad|iPhone|iPod/.test(navigator.userAgent) && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    💡 <strong>iPhone-Nutzer:</strong> E-Mail-Informationen werden automatisch in die Zwischenablage kopiert. 
                    Öffnen Sie Ihre E-Mail-App (Mail, Gmail, Outlook) und fügen Sie die Informationen ein.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8 lg:py-12">
              <div className="text-3xl lg:text-4xl mb-4">📨</div>
              <p className="text-sm lg:text-base">Wählen Sie eine Nachricht, um die Details anzuzeigen</p>
            </div>
          )}
        </div>
      </div>

      {/* Silme Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteMessage}
        title="Nachricht löschen"
        message={`Sind Sie sicher, dass Sie die Nachricht von "${deleteModal.messageName}" löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.`}
        confirmText="Löschen"
        cancelText="Abbrechen"
        type="danger"
      />
    </div>
  );
}

export default MessagesManagement; 