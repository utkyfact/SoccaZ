import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router';

function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gizlilik Politikası 🔒
            </h1>
            <p className="text-lg text-gray-600">
              SoccaZ halı saha rezervasyon sistemi gizlilik politikası
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Giriş */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Giriş</h2>
                <p className="text-gray-700 mb-4">
                  SoccaZ olarak, kişisel verilerinizin gizliliğini korumayı taahhüt ediyoruz. 
                  Bu gizlilik politikası, hangi bilgileri topladığımızı, nasıl kullandığımızı ve 
                  koruduğumuzu açıklar.
                </p>
                <p className="text-gray-700">
                  Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve 
                  Avrupa Birliği Genel Veri Koruma Yönetmeliği (GDPR) uyumlu olarak hazırlanmıştır.
                </p>
              </section>

              {/* Toplanan Veriler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Topladığımız Veriler</h2>
                <div className="space-y-6 text-gray-700">
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">👤 Kişisel Bilgiler:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Ad ve soyad</li>
                      <li>E-posta adresi</li>
                      <li>Telefon numarası</li>
                      <li>Doğum tarihi (opsiyonel)</li>
                      <li>Profil fotoğrafı (opsiyonel)</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">📅 Rezervasyon Verileri:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Rezervasyon tarihi ve saati</li>
                      <li>Seçilen saha bilgileri</li>
                      <li>Ödeme bilgileri</li>
                      <li>Rezervasyon geçmişi</li>
                      <li>Favori sahalar</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">🌐 Teknik Veriler:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>IP adresi</li>
                      <li>Tarayıcı bilgileri</li>
                      <li>Cihaz bilgileri</li>
                      <li>Kullanım istatistikleri</li>
                      <li>Çerezler (cookies)</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">📱 Mobil Veriler:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Konum bilgileri (izin verilirse)</li>
                      <li>Push notification tercihleri</li>
                      <li>Uygulama kullanım verileri</li>
                      <li>Cihaz kimliği</li>
                    </ul>
                  </div>

                </div>
              </section>

              {/* Veri Kullanım Amaçları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Verilerin Kullanım Amaçları</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Kişisel verilerinizi aşağıdaki amaçlarla kullanırız:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">🎯 Temel Hizmetler:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Hesap oluşturma ve yönetimi</li>
                        <li>Rezervasyon işlemleri</li>
                        <li>Ödeme işlemleri</li>
                        <li>Müşteri hizmetleri</li>
                        <li>Bildirim gönderimi</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">📊 İyileştirme:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Hizmet kalitesini artırma</li>
                        <li>Kullanıcı deneyimini iyileştirme</li>
                        <li>Yeni özellikler geliştirme</li>
                        <li>Güvenlik önlemleri</li>
                        <li>Analiz ve raporlama</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Veri Paylaşımı */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Veri Paylaşımı</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Kişisel verilerinizi aşağıdaki durumlarda paylaşabiliriz:</p>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">⚠️ Zorunlu Paylaşımlar:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Yasal zorunluluklar</li>
                      <li>Mahkeme kararları</li>
                      <li>Güvenlik tehditleri</li>
                      <li>Hukuki uyuşmazlıklar</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">🤝 Hizmet Sağlayıcılar:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Ödeme işlemcileri (güvenli ödeme)</li>
                      <li>E-posta servisleri (bildirimler)</li>
                      <li>Analitik servisleri (kullanım analizi)</li>
                      <li>Bulut depolama (veri yedekleme)</li>
                      <li>Müşteri hizmetleri platformları</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Güvenli Paylaşım:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>Veri işleme anlaşmaları (DPA)</li>
                      <li>Şifreleme ve güvenlik önlemleri</li>
                      <li>Minimum veri prensibi</li>
                      <li>Düzenli güvenlik denetimleri</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Veri Güvenliği */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Veri Güvenliği</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Verilerinizi korumak için aşağıdaki önlemleri alırız:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">🔐 Teknik Önlemler:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>SSL/TLS şifreleme</li>
                        <li>Güvenli veri depolama</li>
                        <li>Düzenli güvenlik güncellemeleri</li>
                        <li>Firewall koruması</li>
                        <li>DDoS koruması</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">👥 Organizasyonel Önlemler:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Personel eğitimleri</li>
                        <li>Erişim kontrolü</li>
                        <li>Veri işleme politikaları</li>
                        <li>Düzenli denetimler</li>
                        <li>Olay müdahale planları</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Çerezler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Çerezler (Cookies)</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Web sitemizde aşağıdaki çerez türlerini kullanırız:</p>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">🍪 Çerez Türleri:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Zorunlu Çerezler:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Oturum yönetimi</li>
                          <li>Güvenlik</li>
                          <li>Temel işlevsellik</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Analitik Çerezler:</h4>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                          <li>Kullanım analizi</li>
                          <li>Performans ölçümü</li>
                          <li>Hata takibi</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">⚙️ Çerez Yönetimi:</h3>
                    <p className="text-sm">
                      Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. 
                      Ancak bazı çerezlerin devre dışı bırakılması, hizmetlerimizin düzgün 
                      çalışmamasına neden olabilir.
                    </p>
                  </div>
                </div>
              </section>

              {/* Kullanıcı Hakları */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Kullanıcı Hakları</h2>
                <div className="space-y-4 text-gray-700">
                  <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">📋 Bilgi Hakları:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
                        <li>Hangi verilerin işlendiğini öğrenme</li>
                        <li>Verilerin işlenme amacını öğrenme</li>
                        <li>Verilerin aktarıldığı üçüncü kişileri öğrenme</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">✏️ Müdahale Hakları:</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Yanlış verilerin düzeltilmesini isteme</li>
                        <li>Verilerin silinmesini isteme</li>
                        <li>İşlemeyi sınırlandırma</li>
                        <li>Veri taşınabilirliği</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">📧 Haklarınızı Kullanma:</h3>
                    <p className="text-sm mb-2">
                      Haklarınızı kullanmak için aşağıdaki kanallardan bizimle iletişime geçebilirsiniz:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li><strong>E-posta:</strong> privacy@soccaz.com</li>
                      <li><strong>Telefon:</strong> +90 (212) 555 0123</li>
                      <li><strong>Adres:</strong> İstanbul, Türkiye</li>
                      <li><strong>Online Form:</strong> Profil sayfasından</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Veri Saklama */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Veri Saklama Süreleri</h2>
                <div className="space-y-4 text-gray-700">
                  <p>Verilerinizi aşağıdaki süreler boyunca saklarız:</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc pl-6 space-y-2 text-sm">
                      <li><strong>Hesap verileri:</strong> Hesap aktif olduğu sürece</li>
                      <li><strong>Rezervasyon verileri:</strong> 5 yıl (yasal zorunluluk)</li>
                      <li><strong>Ödeme verileri:</strong> 10 yıl (mali mevzuat)</li>
                      <li><strong>İletişim verileri:</strong> 3 yıl</li>
                      <li><strong>Analitik veriler:</strong> 2 yıl</li>
                      <li><strong>Çerezler:</strong> 1 yıl (maksimum)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Çocukların Gizliliği */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Çocukların Gizliliği</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Hizmetlerimiz 18 yaş ve üzeri kullanıcılar için tasarlanmıştır. 
                    18 yaş altı kullanıcılar için veli izni gereklidir.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">⚠️ Önemli Not:</h3>
                    <p className="text-sm">
                      18 yaş altı kullanıcıların kişisel verilerini bilerek toplamayız. 
                      Eğer 18 yaş altı bir kullanıcının verisi toplandığını fark edersek, 
                      bu verileri derhal sileriz.
                    </p>
                  </div>
                </div>
              </section>

              {/* Değişiklikler */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Politika Değişiklikleri</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Bu gizlilik politikasını zaman zaman güncelleyebiliriz. 
                    Önemli değişiklikler olduğunda sizi bilgilendireceğiz.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">📢 Bildirim Yöntemleri:</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm">
                      <li>E-posta bildirimi</li>
                      <li>Platform içi duyuru</li>
                      <li>Web sitesi güncellemesi</li>
                      <li>Push notification</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* İletişim */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. İletişim</h2>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    Gizlilik politikamız hakkında sorularınız için:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Veri Sorumlusu:</strong> SoccaZ Teknoloji A.Ş.</p>
                    <p><strong>E-posta:</strong> privacy@soccaz.com</p>
                    <p><strong>Telefon:</strong> +90 (212) 555 0123</p>
                    <p><strong>Adres:</strong> İstanbul, Türkiye</p>
                    <p><strong>Çalışma Saatleri:</strong> Pazartesi - Cuma, 09:00 - 18:00</p>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="text-center text-gray-500 text-sm">
                  <p>
                    Bu gizlilik politikası {new Date().getFullYear()} yılında yayınlanmıştır ve 
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

export default Privacy; 