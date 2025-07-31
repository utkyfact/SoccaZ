import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toast } from 'react-toastify';

function FooterContentManagement() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [footerData, setFooterData] = useState({
    address: {
      street: '',
      city: '',
      region: ''
    },
    contact: {
      phone: '',
      email: '',
      workingHours: ''
    },
    social: {
      facebook: '',
      instagram: '',
      tiktok: '',
      twitter: ''
    },
    company: {
      name: '',
      description: '',
      longDescription: ''
    }
  });

  // Footer verilerini Firebase'den yükle
  const loadFooterData = async () => {
    try {
      setLoading(true);
      const footerDoc = await getDoc(doc(db, 'settings', 'footer'));

      if (footerDoc.exists()) {
        const data = footerDoc.data();
        setFooterData(data);
      } else {
        // Varsayılan veriler
        setFooterData({
          address: {
            street: 'Fußballstraße 123',
            city: 'Spor Mahallesi',
            region: 'İzmir'
          },
          contact: {
            phone: '+90 (232) 555 0123',
            email: 'info@halisaha.com',
            workingHours: 'Her gün 08:00 - 24:00'
          },
          social: {
            facebook: '',
            instagram: '',
            tiktok: '',
            twitter: ''
          },
          company: {
            name: 'Kleinfeld buchen',
            description: 'Professionelle Fußballplätze',
            longDescription: 'Erleben Sie unvergessliche Fußballmomente auf unseren professionellen Kunstrasenplätzen. Unsere modernen Anlagen und fairen Preise warten auf Sie!'
          }
        });
      }
    } catch (error) {
      console.error('Fehler beim Laden der Footer-Daten:', error);
      toast.error('Fehler beim Laden der Footer-Daten.');
    } finally {
      setLoading(false);
    }
  };

  // Footer verilerini Firebase'e kaydet
  const saveFooterData = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, 'settings', 'footer'), {
        ...footerData,
        updatedAt: new Date()
      });
      toast.success('Footer-Inhalt erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Footer-Daten:', error);
      toast.error('Fehler beim Speichern der Footer-Daten.');
    } finally {
      setSaving(false);
    }
  };

  // Adres bilgilerini güncelle
  const updateAddress = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  // İletişim bilgilerini güncelle
  const updateContact = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  // Sosyal medya linklerini güncelle
  const updateSocial = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: value
      }
    }));
  };

  // Şirket bilgilerini güncelle
  const updateCompany = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value
      }
    }));
  };

  useEffect(() => {
    loadFooterData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Footer-Inhalt verwalten</h2>
        <p className="text-gray-600">Hier können Sie die Footer-Inhalte der Website bearbeiten.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={(e) => { e.preventDefault(); saveFooterData(); }}>
          
          {/* Şirket Bilgileri */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Firmeninformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Firmenname</label>
                <input
                  type="text"
                  value={footerData.company.name}
                  onChange={(e) => updateCompany('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Firmenname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                <input
                  type="text"
                  value={footerData.company.description}
                  onChange={(e) => updateCompany('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Kurze Beschreibung"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lange Beschreibung</label>
                <textarea
                  value={footerData.company.longDescription}
                  onChange={(e) => updateCompany('longDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Lange Beschreibung"
                />
              </div>
            </div>
          </div>

          {/* Adres Bilgileri */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adressinformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Straße & Hausnummer</label>
                <input
                  type="text"
                  value={footerData.address.street}
                  onChange={(e) => updateAddress('street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Straße 123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stadt</label>
                <input
                  type="text"
                  value={footerData.address.city}
                  onChange={(e) => updateAddress('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Stadt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <input
                  type="text"
                  value={footerData.address.region}
                  onChange={(e) => updateAddress('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Region"
                />
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kontaktinformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefonnummer</label>
                <input
                  type="text"
                  value={footerData.contact.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+90 (232) 555 0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                <input
                  type="email"
                  value={footerData.contact.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="info@halisaha.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Öffnungszeiten</label>
                <input
                  type="text"
                  value={footerData.contact.workingHours}
                  onChange={(e) => updateContact('workingHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Täglich 08:00 - 24:00"
                />
              </div>
            </div>
          </div>

          {/* Sosyal Medya Linkleri */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <input
                  type="url"
                  value={footerData.social.facebook}
                  onChange={(e) => updateSocial('facebook', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                <input
                  type="url"
                  value={footerData.social.instagram}
                  onChange={(e) => updateSocial('instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TikTok URL</label>
                <input
                  type="url"
                  value={footerData.social.tiktok}
                  onChange={(e) => updateSocial('tiktok', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://tiktok.com/@..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X URL</label>
                <input
                  type="url"
                  value={footerData.social.twitter}
                  onChange={(e) => updateSocial('twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          {/* Kaydet Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Wird gespeichert...' : 'Inhalt speichern'}
            </button>
          </div>
        </form>
      </div>

      {/* Önizleme */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Vorschau</h3>
        <div className="bg-gradient-to-r from-green-600 to-green-900 text-white p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo ve Açıklama */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                  <img src="/SoccaZ.png" alt="logo" className="w-16 h-16 object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{footerData.company.name}</h3>
                  <p className="text-green-200 text-sm">{footerData.company.description}</p>
                </div>
              </div>
              <p className="text-green-100 mb-6 leading-relaxed">
                {footerData.company.longDescription}
              </p>
            </div>

            {/* İletişim Bilgileri */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-300 mr-3 mt-1">📍</span>
                  <span className="text-green-100">
                    {footerData.address.street}<br />
                    {footerData.address.city}, {footerData.address.region}
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">📞</span>
                  <span className="text-green-100">{footerData.contact.phone}</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">✉️</span>
                  <span className="text-green-100">{footerData.contact.email}</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-300 mr-3">🕒</span>
                  <span className="text-green-100">{footerData.contact.workingHours}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterContentManagement; 