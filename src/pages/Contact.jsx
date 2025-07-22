import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

const SOCIAL_SVGS = {
  facebook: (
    <svg className="h-6 w-6 hover:scale-110 transition-all duration-200 hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  ),
  instagram: (
    <svg className="h-6 w-6 hover:scale-110 transition-all duration-200 group-hover:text-pink-500" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  ),
  tiktok: (
    <svg className="h-6 w-6 hover:scale-110 transition-all duration-200" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="tiktokGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#00f2ea", stopOpacity: "1" }} />
          <stop offset="50%" style={{ stopColor: "#000000", stopOpacity: "1" }} />
          <stop offset="100%" style={{ stopColor: "#ff0050", stopOpacity: "1" }} />
        </linearGradient>
      </defs>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="currentColor" className="group-hover:fill-[url(#tiktokGradient)] transition-all duration-200" />
    </svg>
  ),
  x: (
    <svg className="h-6 w-6 hover:scale-110 transition-all duration-200 hover:text-black" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
};

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const contentDoc = await getDoc(doc(db, 'settings', 'contactpage'));
        if (contentDoc.exists()) {
          setContentData(contentDoc.data());
        } else {
          setContentData(null);
        }
      } catch (error) {
        setContentData(null);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Mesajı Firestore'a kaydet
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'unread', // unread, read, replied
        createdAt: new Date(),
        ipAddress: null, // Opsiyonel
        userAgent: navigator.userAgent
      });

      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Admin panelindeki badge'i güncelle için custom event gönder
      window.dispatchEvent(new CustomEvent('messageStatusChanged'));
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      toast.error('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // FAQ açma/kapama fonksiyonu
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Sayfa yükleniyor...</p>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">İletişim</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya rezervasyon talepleriniz için bizimle iletişime geçin.
              Size en kısa sürede dönüş yapacağız.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* İletişim Bilgileri */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">İletişim Bilgileri</h2>
                <div className="space-y-6">
                  {/* Adres */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Adres</h3>
                      <p className="text-gray-600">
                        {contentData?.contactInfo?.address || 'Adres bilgisi eklenmedi.'}
                      </p>
                    </div>
                  </div>
                  {/* Telefon */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Telefon</h3>
                      <p className="text-gray-600">
                        {contentData?.contactInfo?.phone ? (
                          <a href={`tel:${contentData.contactInfo.phone}`} className="hover:text-green-600 transition-colors">
                            {contentData.contactInfo.phone}
                          </a>
                        ) : 'Telefon bilgisi eklenmedi.'}
                      </p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">E-posta</h3>
                      <p className="text-gray-600">
                        {contentData?.contactInfo?.email ? (
                          <a href={`mailto:${contentData.contactInfo.email}`} className="hover:text-green-600 transition-colors">
                            {contentData.contactInfo.email}
                          </a>
                        ) : 'E-posta bilgisi eklenmedi.'}
                      </p>
                    </div>
                  </div>
                  {/* Çalışma Saatleri */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Çalışma Saatleri</h3>
                      <p className="text-gray-600">
                        {contentData?.contactInfo?.workingHours || 'Çalışma saatleri eklenmedi.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sosyal Medya</h2>
                <div className="flex space-x-4">
                  {contentData?.socialMedia?.length > 0 ? (
                    contentData.socialMedia.map((item, idx) => (
                      <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="w-18 h-18 rounded-lg flex items-center justify-center text-green-500 transition-colors duration-200 group" title={item.label}>
                        <span className="text-xl">
                          {SOCIAL_SVGS[item.icon] || '🌐'}
                        </span>
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-400">Sosyal medya eklenmedi.</span>
                  )}
                </div>
              </div>
            </div>

            {/* İletişim Formu */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Mesajınızın konusu"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '📤 Gönderiliyor...' : '📤 Mesaj Gönder'}
                </button>
              </form>
            </div>
          </div>

          {/* Harita */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Konum</h2>
              <div className="rounded-lg overflow-hidden">
                {contentData?.location?.mapEmbed ? (
                  <iframe
                    src={contentData.location.mapEmbed}
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SoccaZ Halı Saha Konumu"
                  ></iframe>
                ) : (
                  <div className="text-gray-400 text-center py-12">Konum eklenmedi.</div>
                )}
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  <strong>Adres:</strong> {contentData?.location?.address || 'Adres eklenmedi.'}
                </p>
                {contentData?.location?.mapEmbed && contentData?.location?.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(contentData.location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    📍 Haritada Aç
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* SSS */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sıkça Sorulan Sorular</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {contentData?.faq?.length > 0 ? (
                  contentData.faq.map((item, idx) => (
                    <div key={idx} className={`${idx !== 0 ? 'border-t border-gray-200' : ''}`}>
                      {/* Soru - Tıklanabilir başlık */}
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      >
                        <h3 className="font-semibold text-gray-800 pr-4 flex-1 text-left whitespace-normal break-words">{item.question}</h3>
                        <div className={`text-green-600 transform transition-transform duration-200 flex-shrink-0 ${
                          openFaqIndex === idx ? 'rotate-180' : ''
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* Cevap - Accordion içerik */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openFaqIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="px-4 pb-4 pt-2 bg-gray-50">
                          <div className="text-gray-600 leading-relaxed whitespace-pre-line break-words text-sm">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8">Sıkça sorulan soru eklenmedi.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Contact; 