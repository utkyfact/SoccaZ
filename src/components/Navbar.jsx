import React, { useState } from 'react'
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';
import UserAvatar from './UserAvatar';

function Navbar() {
    const { user, userProfile, logout, isAdmin, loading: authLoading } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

    // Çıkış yapma fonksiyonu
    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Başarıyla çıkış yaptınız!")
            setIsMobileMenuOpen(false);
            setIsUserDropdownOpen(false);
        } catch (error) {
            console.error('Çıkış yapılırken hata:', error);
            toast.error("Çıkış yapılırken bir hata oluştu!")
        }
    };

    // Mobil menüyü aç/kapat
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Kullanıcı dropdown'ını aç/kapat
    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
        setIsNotificationDropdownOpen(false);
    };

    // Bildirim dropdown'ını aç/kapat
    const toggleNotificationDropdown = () => {
        setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
        setIsUserDropdownOpen(false);
    };

    return (
        <nav className='relative bg-gradient-to-r from-green-600 to-green-700 shadow-lg border-b-4 border-green-800 sticky top-0 z-40'>
            {/* Futbol Sahası Çizgileri */}
            <div className='absolute inset-0 pointer-events-none'>
                {/* Orta Çizgi */}
                <div className='absolute left-1/2 top-0 bottom-0 w-0.5 bg-white opacity-60'></div>
                
                {/* Orta Daire */}
                <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full opacity-60'></div>
                
                {/* Orta Nokta */}
                <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-80'></div>
                
                {/* Sol Penaltı Sahası */}
                <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-18 h-16 border-2 border-white opacity-60'></div>
                
                {/* Sağ Penaltı Sahası */}
                <div className='absolute right-0 top-1/2 transform -translate-y-1/2 w-18 h-16 border-2 border-white opacity-60'></div>
                
                {/* Sol Kaleci Sahası */}
                <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-8 border-2 border-white opacity-60'></div>
                
                {/* Sağ Kaleci Sahası */}
                <div className='absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-8 border-2 border-white opacity-60'></div>
                
                {/* Sol Penaltı Noktası */}
                <div className='absolute left-12 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-80'></div>
                
                {/* Sağ Penaltı Noktası */}
                <div className='absolute right-12 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-80'></div>
            </div>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <div className='flex items-center justify-between py-3'>
                    
                    {/* Logo ve Marka Adı */}
                    <Link to="/" className='flex items-center space-x-3 cursor-pointer'>
                        <img src="/SoccaZ.png" alt="SoccaZ Logo" className='w-18 h-18 object-cover' />
                        <div className='hidden sm:block'>
                            <h1 className='text-xl font-bold text-white'>SoccaZ</h1>
                            <p className='text-xs text-green-200'>Halı Saha Rezervasyon</p>
                        </div>
                    </Link>
                    
                    {/* Sol Navigasyon Linkleri */}
                    <div className='hidden lg:flex items-center space-x-4'>
                        <Link 
                            to="/" 
                            className='text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1 hover:scale-105 transform'
                        >
                            <span className='text-lg'>🏠</span>
                            <span className='hidden xl:inline'>Ana Sayfa</span>
                        </Link>
                        <Link 
                            to="/fields" 
                            className='text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1 hover:scale-105 transform'
                        >
                            <span className='text-lg'>⚽</span>
                            <span className='hidden xl:inline'>Sahalar</span>
                        </Link>
                        <Link 
                            to="/contact" 
                            className='text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1 hover:scale-105 transform'
                        >
                            <span className='text-lg'>📞</span>
                            <span className='hidden xl:inline'>İletişim</span>
                        </Link>
                        {/* Rezervasyonlarım Linki */}
                        {user && (
                            <Link 
                                to="/reservations" 
                                className='text-white hover:text-green-200 transition-colors duration-200 font-medium flex items-center space-x-1 hover:scale-105 transform'
                            >
                                <span className='text-lg'>📅</span>
                                <span className='hidden xl:inline'>Rezervasyonlarım</span>
                            </Link>
                        )}
                    </div>

                    {/* Sağ Navigasyon ve Auth */}
                    <div className='hidden lg:flex items-center space-x-3'>
                        {/* Auth Loading */}
                        {authLoading ? (
                            <div className='flex items-center space-x-2 text-white'>
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                                <span className='text-sm'>Yükleniyor...</span>
                            </div>
                        ) : user ? (
                            // Giriş yapmış kullanıcı için dropdown
                            <>
                                {/* Bildirim Göstergesi */}
                                <div className='relative'>
                                    <button
                                        onClick={toggleNotificationDropdown}
                                        className='relative p-2 text-white hover:text-green-200 transition-colors duration-200 bg-green-800 bg-opacity-50 rounded-lg backdrop-blur-sm hover:bg-green-700 cursor-pointer'
                                    >
                                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l2.25 2.25V12a8.25 8.25 0 0 0-16.5 0v3.75l2.25-2.25V9.75a6 6 0 0 1 6-6z' />
                                        </svg>
                                        
                                        {/* Okunmamış bildirim sayısı badge */}
                                        {unreadCount > 0 && (
                                            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse'>
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Bildirim Dropdown */}
                                    {isNotificationDropdownOpen && (
                                        <div className='absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-96 overflow-y-auto z-50'>
                                            {/* Header */}
                                            <div className='px-4 py-2 border-b border-gray-200'>
                                                <div className='flex items-center justify-between mb-1'>
                                                    <h3 className='font-semibold text-gray-900'>Bildirimler</h3>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={markAllAsRead}
                                                            className='text-sm text-green-600 hover:text-green-700 font-medium'
                                                        >
                                                            Tümünü okundu işaretle
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bildirimler Listesi */}
                                            <div className='max-h-64 overflow-y-auto'>
                                                {notifications.length === 0 ? (
                                                    <div className='px-4 py-8 text-center text-gray-500'>
                                                        <svg className='w-12 h-12 mx-auto mb-3 text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l2.25 2.25V12a8.25 8.25 0 0 0-16.5 0v3.75l2.25-2.25V9.75a6 6 0 0 1 6-6z' />
                                                        </svg>
                                                        <p>Henüz bildiriminiz yok</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer border-l-4 ${
                                                                notification.read ? 'border-transparent' : 'border-green-500'
                                                            }`}
                                                            onClick={() => {
                                                                if (!notification.read) {
                                                                    markAsRead(notification.id);
                                                                }
                                                                setIsNotificationDropdownOpen(false);
                                                            }}
                                                            title={notification.read ? "Bildirim zaten okundu" : "Bildirimi okundu olarak işaretle"}
                                                        >
                                                            <div className='flex items-start justify-between'>
                                                                <div className='flex-1'>
                                                                    <div className='flex items-center space-x-2 mb-1'>
                                                                        <span className={`inline-block w-2 h-2 rounded-full ${
                                                                            notification.type === 'success' ? 'bg-green-500' :
                                                                            notification.type === 'warning' ? 'bg-yellow-500' :
                                                                            notification.type === 'error' ? 'bg-red-500' :
                                                                            'bg-blue-500'
                                                                        }`}></span>
                                                                        <h4 className={`text-sm font-medium ${
                                                                            notification.read ? 'text-gray-600' : 'text-gray-900'
                                                                        }`}>
                                                                            {notification.title}
                                                                        </h4>
                                                                        {!notification.read && (
                                                                            <span className='inline-block w-2 h-2 bg-green-500 rounded-full'></span>
                                                                        )}
                                                                    </div>
                                                                    <p className={`text-xs ${
                                                                        notification.read ? 'text-gray-500' : 'text-gray-700'
                                                                    }`}>
                                                                        {notification.message}
                                                                    </p>
                                                                    <p className='text-xs text-gray-400 mt-1'>
                                                                        {notification.createdAt?.toDate().toLocaleString('tr-TR')}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteNotification(notification.id);
                                                                    }}
                                                                    className='text-gray-400 hover:text-red-500 transition-colors duration-200 ml-2'
                                                                >
                                                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            {/* Footer */}
                                            {notifications.length > 0 && (
                                                <div className='px-4 py-2 border-t border-gray-200 text-center'>
                                                    <Link
                                                        to="/notifications"
                                                        onClick={() => setIsNotificationDropdownOpen(false)}
                                                        className='text-sm text-green-600 hover:text-green-700 font-medium'
                                                    >
                                                        Tüm bildirimleri görüntüle
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Kullanıcı Dropdown */}
                                <div className='relative'>
                                    <button
                                        onClick={toggleUserDropdown}
                                        className='flex items-center space-x-2 text-white hover:text-green-200 transition-colors duration-200 bg-green-800 bg-opacity-50 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-green-700 cursor-pointer'
                                    >
                                        <UserAvatar user={user} userProfile={userProfile} />
                                        <span className='font-medium'>
                                            {user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0]}
                                        </span>
                                        {isAdmin && <span className='text-yellow-300'>👑</span>}
                                        <svg className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserDropdownOpen && (
                                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2'>
                        {/* Admin Panel Linki */}
                        {isAdmin && (
                            <Link 
                                to="/admin" 
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                    className='flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200'
                            >
                                                    <span>👑</span>
                                                    <span>Admin Paneli</span>
                            </Link>
                        )}
                        
                                            {/* Profil Linki */}
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                                className='flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200'
                                            >
                                                <span>👤</span>
                                                <span>Profil</span>
                                            </Link>

                                            {/* Ayırıcı */}
                                            <div className='border-t border-gray-200 my-1'></div>

                                            {/* Çıkış Butonu */}
                                <button 
                                    onClick={handleLogout}
                                                className='w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer'
                                >
                                                <span>🚪</span>
                                                <span>Çıkış Yap</span>
                                </button>
                            </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Giriş yapmamış kullanıcı için
                            <div className='flex items-center space-x-2'>
                                <Link 
                                    to="/login" 
                                    className='bg-white text-green-600 px-3 py-1 rounded text-sm font-medium hover:bg-green-50 transition-colors duration-200 shadow-md'
                                >
                                    Giriş
                                </Link>
                                <Link 
                                    to="/register" 
                                    className='bg-green-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-400 transition-colors duration-200 shadow-md'
                                >
                                    Kayıt
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobil Menü Butonu */}
                    <div className='lg:hidden'>
                        <button 
                            onClick={toggleMobileMenu}
                            className='text-white hover:text-green-200 transition-colors duration-200 p-2'
                        >
                            {isMobileMenuOpen ? (
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            ) : (
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobil Menü Dropdown */}
                {isMobileMenuOpen && (
                    <div className='lg:hidden bg-green-700 border-t border-green-600 shadow-lg'>
                        <div className='px-2 pt-2 pb-3 space-y-1'>
                            {/* Mobil Navigasyon Linkleri */}
                            <Link 
                                to="/" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className='text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors duration-200'
                            >
                                <span className='flex items-center space-x-2'>
                                    <span>🏠</span>
                                    <span>Ana Sayfa</span>
                                </span>
                            </Link>
                            <Link 
                                to="/fields" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className='text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors duration-200'
                            >
                                <span className='flex items-center space-x-2'>
                                    <span>⚽</span>
                                    <span>Sahalar</span>
                                </span>
                            </Link>
                            {user && (
                                <Link 
                                    to="/reservations" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className='text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors duration-200'
                                >
                                    <span className='flex items-center space-x-2'>
                                        <span>📅</span>
                                        <span>Rezervasyonlarım</span>
                                    </span>
                                </Link>
                            )}
                            <Link 
                                to="/contact" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className='text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors duration-200'
                            >
                                <span className='flex items-center space-x-2'>
                                    <span>📞</span>
                                    <span>İletişim</span>
                                </span>
                            </Link>

                            {/* Mobil Auth Buttons */}
                            <div className='pt-4 pb-3 border-t border-green-600'>
                                {authLoading ? (
                                    <div className='text-white text-sm bg-green-800 bg-opacity-50 px-3 py-2 rounded-lg text-center'>
                                        <div className='flex items-center justify-center space-x-2'>
                                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                                            <span>Yükleniyor...</span>
                                        </div>
                                    </div>
                                ) : user ? (
                                    <div className='space-y-2'>
                                        {/* Mobil Bildirim Göstergesi */}
                                        <div className='flex items-center justify-between bg-green-800 bg-opacity-50 px-3 py-2 rounded-lg'>
                                            <div className='flex items-center space-x-2'>
                                                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l2.25 2.25V12a8.25 8.25 0 0 0-16.5 0v3.75l2.25-2.25V9.75a6 6 0 0 1 6-6z' />
                                                </svg>
                                                <span className='text-white text-sm font-medium'>Bildirimler</span>
                                            </div>
                                            {unreadCount > 0 && (
                                                <span className='bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold'>
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </span>
                                            )}
                                        </div>

                                        <div className='text-white text-sm bg-green-800 bg-opacity-50 px-3 py-2 rounded-lg'>
                                            <span className='font-medium'>Hoş geldin, </span>
                                            <span className='text-green-200 font-semibold'>{user.displayName || user.email}</span>
                                            {isAdmin && <span className='ml-2 text-yellow-300'>👑</span>}
                                        </div>

                                        {/* Mobil Admin Panel Linki */}
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className='text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors duration-200 bg-green-800 bg-opacity-50'
                                            >
                                                <span className='flex items-center space-x-2'>
                                                    <span>👑</span>
                                                    <span>Admin Panel</span>
                                                </span>
                                            </Link>
                                        )}

                                        {/* Mobil Profil Linki */}
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className='text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors duration-200 bg-green-800 bg-opacity-50'
                                        >
                                            <span className='flex items-center space-x-2'>
                                                <span>👤</span>
                                                <span>Profil</span>
                                            </span>
                                        </Link>

                                        {/* Mobil Profil Linki */}
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className='text-white hover:text-green-200 block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition-colors duration-200'
                                        >
                                            <span className='flex items-center space-x-2'>
                                                <span>👤</span>
                                                <span>Profil</span>
                                            </span>
                                        </Link>

                                        <button 
                                            onClick={handleLogout}
                                            className='w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-all duration-200 shadow-md cursor-pointer'
                                        >
                                            Çıkış Yap
                                        </button>
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        <Link 
                                            to="/login" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className='w-full bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 shadow-md block text-center'
                                        >
                                            Giriş
                                        </Link>
                                        <Link 
                                            to="/register" 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className='w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-400 transition-colors duration-200 shadow-md block text-center'
                                        >
                                            Kayıt
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar