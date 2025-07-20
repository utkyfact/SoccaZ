import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log('Form gönderildi:', formData);
    alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
                        Atatürk Mahallesi, Spor Caddesi No:123<br />
                        Merkez / İstanbul
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
                        <a href="tel:+902121234567" className="hover:text-green-600 transition-colors">
                          +90 (212) 123 45 67
                        </a>
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
                        <a href="mailto:info@soccaz.com" className="hover:text-green-600 transition-colors">
                          info@soccaz.com
                        </a>
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
                        Pazartesi - Pazar: 08:00 - 24:00<br />
                        <span className="text-sm text-gray-500">7/24 hizmet</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Sosyal Medya</h2>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="text-white text-xl">📘</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                    <span className="text-white text-xl">📷</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <span className="text-white text-xl">🐦</span>
                  </a>
                  <a href="#" className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                    <span className="text-white text-xl">📺</span>
                  </a>
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
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  📤 Mesaj Gönder
                </button>
              </form>
            </div>
          </div>

          {/* Harita */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Konum</h2>
              <div className="rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100146.95164865295!2d26.818571651220733!3d38.335272418675665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bbeae3bb1854a9%3A0x41744d8ed612d55d!2sYa%C4%9Fmurkent%20Sitesi!5e0!3m2!1str!2str!4v1752928697162!5m2!1str!2str" 
                  width="100%" 
                  height="450" 
                  style={{border:0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SoccaZ Halı Saha Konumu"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  <strong>Adres:</strong> Yağmurkent Sitesi, İzmir
                </p>
                <a 
                  href="https://maps.google.com/?q=Yağmurkent+Sitesi+İzmir" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-green-600 hover:text-green-700 font-medium"
                >
                  📍 Haritada Aç
                </a>
              </div>
            </div>
          </div>

          {/* SSS */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sıkça Sorulan Sorular</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Rezervasyon nasıl yapabilirim?</h3>
                  <p className="text-gray-600">
                    Web sitemizden online rezervasyon yapabilir veya telefon ile arayabilirsiniz.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Rezervasyon iptali mümkün mü?</h3>
                  <p className="text-gray-600">
                    Evet, rezervasyonunuzu 24 saat öncesine kadar iptal edebilirsiniz.
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Ekipman sağlıyor musunuz?</h3>
                  <p className="text-gray-600">
                    Kendi ekipmanınızı getirmeniz gerekmektedir. Top ve diğer ekipmanlar dahil değildir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Contact; 