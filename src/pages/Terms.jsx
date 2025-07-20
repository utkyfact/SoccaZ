import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router';

function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Kullanım Şartları 📋
            </h1>
            <p className="text-lg text-gray-600">
              SoccaZ halı saha rezervasyon sistemi kullanım şartları
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Genel Bilgiler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Genel Bilgiler</h2>
                <p className="text-gray-700 mb-4">
                  Bu kullanım şartları, SoccaZ halı saha rezervasyon sistemi ("Platform") kullanımını düzenler. 
                  Platform'u kullanarak bu şartları kabul etmiş sayılırsınız.
                </p>
                <p className="text-gray-700">
                  Platform, halı saha rezervasyonları için tasarlanmış bir web uygulamasıdır ve 
                  kullanıcıların saha rezervasyonu yapmasını, yönetmesini ve takip etmesini sağlar.
                </p>
              </section>

              {/* Hizmet Kapsamı */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hizmet Kapsamı</h2>
                <div className="space-y-3 text-gray-700">
                  <p>SoccaZ aşağıdaki hizmetleri sunar:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Halı saha rezervasyonu yapma ve yönetme</li>
                    <li>Rezervasyon geçmişi görüntüleme</li>
                    <li>Fiyat bilgileri ve müsaitlik kontrolü</li>
                    <li>Bildirim ve hatırlatma servisleri</li>
                    <li>Kullanıcı profil yönetimi</li>
                    <li>Mobil uygulama desteği (PWA)</li>
                  </ul>
                </div>
              </section>

              {/* Kullanıcı Sorumlulukları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Kullanıcı Sorumlulukları</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Platform'u kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">✅ Yapılması Gerekenler:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Doğru ve güncel bilgiler sağlamak</li>
                      <li>Rezervasyon saatlerine uymak</li>
                      <li>Saha kurallarına uymak</li>
                      <li>Diğer kullanıcıları rahatsız etmemek</li>
                      <li>Platform'u yasal amaçlar için kullanmak</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">❌ Yapılmaması Gerekenler:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-red-800">
                      <li>Yanlış bilgi vermek</li>
                      <li>Rezervasyon saatlerini ihlal etmek</li>
                      <li>Saha ekipmanlarına zarar vermek</li>
                      <li>Platform'u kötüye kullanmak</li>
                      <li>Başkalarının hesaplarını kullanmak</li>
                      <li>Spam veya zararlı içerik paylaşmak</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Rezervasyon Kuralları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Rezervasyon Kuralları</h2>
                <div className="space-y-4 text-gray-700">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">📅 Rezervasyon Süreci:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Rezervasyonlar en az 1 saat önceden yapılmalıdır</li>
                      <li>Maksimum rezervasyon süresi 2 saattir</li>
                      <li>Rezervasyon iptali en az 2 saat önceden yapılmalıdır</li>
                      <li>Ödeme rezervasyon sırasında yapılır</li>
                      <li>Rezervasyon onayı email ile gönderilir</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">⚠️ İptal ve Değişiklik:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>2 saatten az süre kala iptal edilen rezervasyonlar için iade yapılmaz</li>
                      <li>Hava koşulları nedeniyle iptal edilen rezervasyonlar iade edilir</li>
                      <li>Teknik sorunlar nedeniyle iptal edilen rezervasyonlar iade edilir</li>
                      <li>Rezervasyon değişiklikleri sadece müsaitlik durumunda yapılabilir</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Ödeme ve Fiyatlandırma */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Ödeme ve Fiyatlandırma</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Ödeme koşulları ve fiyatlandırma hakkında bilgiler:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">💳 Ödeme Yöntemleri:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Kredi/Banka kartı</li>
                        <li>Online bankacılık</li>
                        <li>Dijital cüzdan</li>
                        <li>Nakit (saha yerinde)</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900 mb-2">💰 Fiyatlandırma:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Fiyatlar saatlik olarak belirlenir</li>
                        <li>Peak saatlerde ek ücret uygulanabilir</li>
                        <li>Toplu rezervasyonlarda indirim</li>
                        <li>Üyelik programı avantajları</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Gizlilik ve Güvenlik */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Gizlilik ve Güvenlik</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Kişisel verilerinizin korunması bizim için önemlidir. Detaylı bilgi için{' '}
                    <Link to="/privacy" className="text-green-600 hover:text-green-700 underline">
                      Gizlilik Politikası
                    </Link>{' '}
                    sayfamızı inceleyebilirsiniz.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🔒 Güvenlik Önlemleri:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>SSL şifreleme ile güvenli veri transferi</li>
                      <li>PCI DSS uyumlu ödeme sistemi</li>
                      <li>Düzenli güvenlik denetimleri</li>
                      <li>Veri yedekleme ve felaket kurtarma</li>
                      <li>Kullanıcı verilerinin şifrelenmesi</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sorumluluk Sınırları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Sorumluluk Sınırları</h2>
                <div className="space-y-4 text-gray-700">
                  <p>SoccaZ aşağıdaki durumlarda sorumluluk kabul etmez:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Kullanıcı hatalarından kaynaklanan sorunlar</li>
                    <li>İnternet bağlantısı sorunları</li>
                    <li>Üçüncü taraf servis sağlayıcı sorunları</li>
                    <li>Doğal afetler ve olağanüstü durumlar</li>
                    <li>Kullanıcının saha kurallarına uymaması</li>
                    <li>Teknik bakım süreleri</li>
                  </ul>
                </div>
              </section>

              {/* Değişiklikler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Değişiklikler</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    SoccaZ, bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar. 
                    Değişiklikler Platform üzerinden duyurulacaktır.
                  </p>
                  <p>
                    Değişikliklerin yürürlüğe girmesinden sonra Platform'u kullanmaya devam etmeniz, 
                    yeni şartları kabul ettiğiniz anlamına gelir.
                  </p>
                </div>
              </section>

              {/* İletişim */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. İletişim</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    Bu kullanım şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> info@soccaz.com</p>
                    <p><strong>Telefon:</strong> +90 (212) 555 0123</p>
                    <p><strong>Adres:</strong> İstanbul, Türkiye</p>
                    <p><strong>Çalışma Saatleri:</strong> Pazartesi - Pazar, 08:00 - 22:00</p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="text-center text-gray-500 text-sm">
                  <p>
                    Bu kullanım şartları {new Date().getFullYear()} yılında yayınlanmıştır ve 
                    SoccaZ halı saha rezervasyon sistemi için geçerlidir.
                  </p>
                  <p className="mt-2">
                    <Link to="/" className="text-green-600 hover:text-green-700 underline">
                      Ana Sayfaya Dön
                    </Link>
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

export default Terms; 