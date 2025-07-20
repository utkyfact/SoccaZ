import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import { sendEmailVerification } from 'firebase/auth'
import { toast } from 'react-toastify'

function Layout({ children }) {
    const { user, isAdmin } = useAuth();
    const [showEmailVerificationBanner, setShowEmailVerificationBanner] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // Email doğrulama kontrolü (admin kullanıcılar için değil)
    useEffect(() => {
        if (user && !user.emailVerified && !isAdmin) {
            setShowEmailVerificationBanner(true);
        } else {
            setShowEmailVerificationBanner(false);
        }
    }, [user, isAdmin]);

    const handleSendVerificationEmail = async () => {
        if (user) {
            try {
                await sendEmailVerification(user, {
                    url: window.location.origin + window.location.pathname,
                    handleCodeInApp: true,
                });
                setEmailSent(true);
                setTimeout(() => setEmailSent(false), 5000);
            } catch (error) {
                console.error('Email gönderilirken hata:', error);
                toast.error('Email gönderilirken bir hata oluştu.');
            }
        }
    };

    return (
        <div className='flex flex-col min-h-screen'>
            {/* Email Doğrulama Banner */}
            {showEmailVerificationBanner && (
                <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white z-50 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">⚠️</span>
                                <div>
                                    <p className="font-medium">
                                        Email adresinizi doğrulamanız gerekmektedir.
                                    </p>
                                    <p className="text-sm opacity-90">
                                        Doğrulama yapmadan bazı özellikleri kullanamazsınız.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                {emailSent && (
                                    <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
                                        ✅ Email gönderildi!
                                    </span>
                                )}
                                <button
                                    onClick={handleSendVerificationEmail}
                                    className="bg-white text-orange-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium text-sm cursor-pointer"
                                >
                                    Doğrulama Emaili Gönder
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium text-sm cursor-pointer"
                                >
                                    Sayfayı Yenile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={showEmailVerificationBanner ? 'mt-16' : ''}>
                <Navbar />
                {children}
                <Footer />
            </div>
        </div>
    )
}

export default Layout;