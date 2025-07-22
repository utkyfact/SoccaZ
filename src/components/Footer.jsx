import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

function Footer() {
    const currentYear = new Date().getFullYear();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Sayfa en üstteyse butonu gizle, değilse göster
            setShowScrollTop(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <footer className="bg-gradient-to-r from-green-600 to-green-900 text-white">
            {/* Ana Footer İçeriği */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Logo ve Açıklama */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                                <img src="/SoccaZ.png" alt="logo" className="w-16 h-16 object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Halı Saha Rezervasyon</h3>
                                <p className="text-green-200 text-sm">Profesyonel Futbol Sahaları</p>
                            </div>
                        </div>
                        <p className="text-green-100 mb-6 leading-relaxed">
                            Profesyonel halı sahalarımızda unutulmaz futbol deneyimleri yaşayın.
                            Modern tesislerimiz ve uygun fiyatlarımızla sizleri bekliyoruz.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-green-200 hover:text-white transition-colors duration-200 group">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6 hover:scale-110 transition-all duration-200 hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-green-200 hover:text-white transition-colors duration-200 group">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6 hover:scale-110 transition-all duration-200 group-hover:text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-green-200 hover:text-white transition-colors duration-200 group">
                                <span className="sr-only">TikTok</span>
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
                            </a>
                            <a href="#" className="text-green-200 hover:text-white transition-colors duration-200">
                                <span className="sr-only">X</span>
                                <svg className="h-6 w-6 hover:scale-110 transition-all duration-200 hover:text-black" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Hızlı Linkler */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-green-200 hover:text-white transition-colors duration-200 flex items-center">
                                    <span className="mr-2">🏠</span>
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link to="/matches" className="text-green-200 hover:text-white transition-colors duration-200 flex items-center">
                                    <span className="mr-2">⚽</span>
                                    Maçlar
                                </Link>
                            </li>

                            <li>
                                <Link to="/contact" className="text-green-200 hover:text-white transition-colors duration-200 flex items-center">
                                    <span className="mr-2">📞</span>
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <span className="text-green-300 mr-3 mt-1">📍</span>
                                <span className="text-green-100">
                                    Futbol Caddesi No:123<br />
                                    Spor Mahallesi, İzmir
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-300 mr-3">📞</span>
                                <span className="text-green-100">+90 (232) 555 0123</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-300 mr-3">✉️</span>
                                <span className="text-green-100">info@halisaha.com</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-300 mr-3">🕒</span>
                                <span className="text-green-100">Her gün 08:00 - 24:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Alt Footer */}
            <div className="border-t border-green-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-green-200 text-sm">
                            © {currentYear} SoccaZ. Tüm hakları saklıdır.
                        </div>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="text-green-200 hover:text-white text-sm transition-colors duration-200">
                                Gizlilik Politikası
                            </Link>
                            <Link to="/terms" className="text-green-200 hover:text-white text-sm transition-colors duration-200">
                                Kullanım Şartları
                            </Link>
                            <Link to="/cookies" className="text-green-200 hover:text-white text-sm transition-colors duration-200">
                                Çerez Tercihleri
                            </Link>
                        </div>
                    </div>
            </div>
        </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 opacity-100 cursor-pointer"
                    aria-label="Yukarı çık"
                    style={{
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}
        </footer>
    );
}

export default Footer;