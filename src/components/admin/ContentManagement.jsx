import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

function ContentManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [contentData, setContentData] = useState({
    hero: {
      title: '',
      subtitle: ''
    },
    features: [],
    info: {
      title: '',
      items: []
    }
  });

  // İçerik verilerini Firebase'den yükle
  const loadContent = async () => {
    try {
      setLoading(true);
      const contentDoc = await getDoc(doc(db, 'settings', 'homepage'));
      
      if (contentDoc.exists()) {
        const data = contentDoc.data();
        setContentData(data);
      } else {
        // Hiç veri yoksa boş bırak
        setContentData({
          hero: { title: '', subtitle: '' },
          features: [],
          info: { title: '', items: [] }
        });
      }
    } catch (error) {
      console.error('İçerik yüklenirken hata:', error);
      toast.error('İçerik yüklenirken bir hata oluştu.');
      setContentData({
        hero: { title: '', subtitle: '' },
        features: [],
        info: { title: '', items: [] }
      });
    } finally {
      setLoading(false);
    }
  };

  // İçerik verilerini Firebase'e kaydet
  const saveContent = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'settings', 'homepage'), {
        ...contentData,
        updatedAt: new Date()
      });
      toast.success('İçerik başarıyla kaydedildi!');
    } catch (error) {
      console.error('İçerik kaydedilirken hata:', error);
      toast.error('İçerik kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Hero section güncelle
  const updateHero = (field, value) => {
    setContentData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
  };

  // Feature güncelle
  const updateFeature = (featureId, field, value) => {
    setContentData(prev => ({
      ...prev,
      features: prev.features.map(feature =>
        feature.id === featureId
          ? { ...feature, [field]: value }
          : feature
      )
    }));
  };

  // Yeni feature ekle
  const addFeature = () => {
    const newId = contentData.features.length > 0 ? Math.max(...contentData.features.map(f => f.id)) + 1 : 1;
    setContentData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id: newId,
          icon: '',
          title: '',
          description: ''
        }
      ]
    }));
  };

  // Feature sil
  const removeFeature = (featureId) => {
    setContentData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature.id !== featureId)
    }));
  };

  // Info section güncelle
  const updateInfo = (field, value) => {
    setContentData(prev => ({
      ...prev,
      info: {
        ...prev.info,
        [field]: value
      }
    }));
  };

  // Info item güncelle
  const updateInfoItem = (index, value) => {
    setContentData(prev => ({
      ...prev,
      info: {
        ...prev.info,
        items: prev.info.items.map((item, i) => i === index ? value : item)
      }
    }));
  };

  // Yeni info item ekle
  const addInfoItem = () => {
    setContentData(prev => ({
      ...prev,
      info: {
        ...prev.info,
        items: [...prev.info.items, '']
      }
    }));
  };

  // Info item sil
  const removeInfoItem = (index) => {
    setContentData(prev => ({
      ...prev,
      info: {
        ...prev.info,
        items: prev.info.items.filter((_, i) => i !== index)
      }
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
            <h2 className="text-xl font-semibold text-gray-800">İçerik Yönetimi</h2>
            <p className="text-gray-600 mt-1">Anasayfa içeriklerini düzenleyin</p>
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
            { id: 'hero', label: 'Ana Başlık', icon: '🏠' },
            { id: 'features', label: 'Özellikler', icon: '⭐' },
            { id: 'info', label: 'Bilgi Bölümü', icon: 'ℹ️' }
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
        {activeSection === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Ana Başlık Bölümü</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ana Başlık
              </label>
              <input
                type="text"
                value={contentData.hero.title}
                onChange={(e) => updateHero('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Başlık
              </label>
              <textarea
                rows={3}
                value={contentData.hero.subtitle}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        )}

        {activeSection === 'features' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Özellikler Bölümü</h3>
              <button
                onClick={addFeature}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm cursor-pointer"
              >
                + Özellik Ekle
              </button>
            </div>

            <div className="grid gap-6">
              {contentData.features.map((feature, index) => (
                <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-md font-medium text-gray-800">Özellik {index + 1}</h4>
                    <button
                      onClick={() => removeFeature(feature.id)}
                      className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                    >
                      Sil
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İkon (Emoji)
                      </label>
                      <input
                        type="text"
                        value={feature.icon}
                        onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="🌱"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Açıklama
                      </label>
                      <input
                        type="text"
                        value={feature.description}
                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'info' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Bilgi Bölümü</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölüm Başlığı
              </label>
              <input
                type="text"
                value={contentData.info.title}
                onChange={(e) => updateInfo('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Özellikler Listesi
                </label>
                <button
                  onClick={addInfoItem}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm cursor-pointer"
                >
                  + Özellik Ekle
                </button>
              </div>

              <div className="space-y-3">
                {contentData.info.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateInfoItem(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <button
                      onClick={() => removeInfoItem(index)}
                      className="text-red-500 hover:text-red-700 px-3 py-2 cursor-pointer"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentManagement; 