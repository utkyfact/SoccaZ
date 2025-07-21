import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

const SOCIAL_ICONS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x', label: 'X' }
];

function ContactContentManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('contact');
  const [contentData, setContentData] = useState({
    contactInfo: {
      address: '',
      phone: '',
      email: '',
      workingHours: ''
    },
    socialMedia: [], // {icon: '', label: '', url: ''}
    location: {
      mapEmbed: '',
      address: ''
    },
    faq: [] // {question: '', answer: ''}
  });

  // İçerik verilerini Firebase'den yükle
  const loadContent = async () => {
    try {
      setLoading(true);
      const contentDoc = await getDoc(doc(db, 'settings', 'contactpage'));
      if (contentDoc.exists()) {
        setContentData(contentDoc.data());
      } else {
        setContentData({
          contactInfo: { address: '', phone: '', email: '', workingHours: '' },
          socialMedia: [],
          location: { mapEmbed: '', address: '' },
          faq: []
        });
      }
    } catch (error) {
      toast.error('İçerik yüklenirken hata oluştu.');
      setContentData({
        contactInfo: { address: '', phone: '', email: '', workingHours: '' },
        socialMedia: [],
        location: { mapEmbed: '', address: '' },
        faq: []
      });
    } finally {
      setLoading(false);
    }
  };

  // İçeriği kaydet
  const saveContent = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'settings', 'contactpage'), {
        ...contentData,
        updatedAt: new Date()
      });
      toast.success('İçerik başarıyla kaydedildi!');
    } catch (error) {
      toast.error('İçerik kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Alan güncelleyiciler
  const updateContactInfo = (field, value) => {
    setContentData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  // Sosyal medya
  const updateSocialMedia = (index, field, value) => {
    setContentData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };
  const addSocialMedia = () => {
    setContentData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { icon: '', label: '', url: '' }]
    }));
  };
  const removeSocialMedia = (index) => {
    setContentData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  // Konum
  const updateLocation = (field, value) => {
    setContentData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  // SSS
  const updateFaq = (index, field, value) => {
    setContentData(prev => ({
      ...prev,
      faq: prev.faq.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };
  const addFaq = () => {
    setContentData(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };
  const removeFaq = (index) => {
    setContentData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">İçerik yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">İletişim Sayfası İçeriği</h2>
            <p className="text-gray-600 mt-1">İletişim sayfasındaki alanları düzenleyin</p>
          </div>
          <button
            onClick={saveContent}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6">
          {[
            { id: 'contact', label: 'İletişim Bilgileri', icon: '📞' },
            { id: 'social', label: 'Sosyal Medya', icon: '🌐' },
            { id: 'location', label: 'Konum', icon: '📍' },
            { id: 'faq', label: 'SSS', icon: '❓' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-4 px-2 cursor-pointer border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeSection === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">İletişim Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <input type="text" value={contentData.contactInfo.address} onChange={e => updateContactInfo('address', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                <input type="text" value={contentData.contactInfo.phone} onChange={e => updateContactInfo('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input type="email" value={contentData.contactInfo.email} onChange={e => updateContactInfo('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Çalışma Saatleri</label>
                <input type="text" value={contentData.contactInfo.workingHours} onChange={e => updateContactInfo('workingHours', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'social' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Sosyal Medya</h3>
              <button onClick={addSocialMedia} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm cursor-pointer">+ Sosyal Medya Ekle</button>
            </div>
            <div className="grid gap-6">
              {contentData.socialMedia.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">İkon</label>
                    <select
                      value={item.icon || ''}
                      onChange={e => updateSocialMedia(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Seçiniz</option>
                      {SOCIAL_ICONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                    <input type="text" value={item.label} onChange={e => updateSocialMedia(index, 'label', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Örn: Facebook" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                    <input type="text" value={item.url} onChange={e => updateSocialMedia(index, 'url', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="https://..." />
                  </div>
                  <button onClick={() => removeSocialMedia(index)} className="text-red-500 hover:text-red-700 text-sm cursor-pointer mt-2 md:mt-0">Sil</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'location' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Konum</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed Linki</label>
              <input type="text" value={contentData.location.mapEmbed} onChange={e => updateLocation('mapEmbed', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="https://www.google.com/maps/embed?..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adres (Altında gösterilecek)</label>
              <input type="text" value={contentData.location.address} onChange={e => updateLocation('address', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Sıkça Sorulan Sorular</h3>
              <button onClick={addFaq} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm cursor-pointer">+ Soru Ekle</button>
            </div>
            <div className="grid gap-6">
              {contentData.faq.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soru</label>
                    <input type="text" value={item.question} onChange={e => updateFaq(index, 'question', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cevap</label>
                    <textarea value={item.answer} onChange={e => updateFaq(index, 'answer', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <button onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700 text-sm cursor-pointer mt-2">Sil</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactContentManagement; 