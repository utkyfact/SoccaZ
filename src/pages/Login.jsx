import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from "react-icons/fc";
import { toast } from 'react-toastify';
import { validateEmail, sanitizeInput } from '../utils/inputSanitizer';
import { checkDDoSProtection } from '../utils/advancedRateLimiter';

function Login() {
    const [loginObj, setLoginObj] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const updateValue = (e) => {
        const { value, name } = e.target
        // Input'ları sanitize et
        const sanitizedValue = sanitizeInput(value);
        setLoginObj({
            ...loginObj,
            [name]: sanitizedValue
        })
    }

    const { login, googleLogin } = useAuth()
    const navigate = useNavigate()

    async function handleEmailLogin(e) {
        e.preventDefault()
        
        // DDoS Protection kontrolü
        const ddosCheck = checkDDoSProtection('login');
        if (!ddosCheck.allowed) {
            toast.error(ddosCheck.message);
            return;
        }
        
        if (!loginObj.email || !loginObj.password) {
            toast.error("Lütfen tüm alanları doldurun!")
            return
        }

        setLoading(true)
        try {
            await login(loginObj)
            toast.success("Başarı ile giriş yaptınız!")
            navigate("/")
        } catch (error) {
            console.error('Login error:', error)
            if (error.code === 'auth/user-not-found') {
                toast.error("Bu email adresi ile kayıtlı kullanıcı bulunamadı!")
            } else if (error.code === 'auth/wrong-password') {
                toast.error("Şifre yanlış!")
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Geçersiz email adresi!")
            } else {
                toast.error("Giriş yapılırken bir hata oluştu!")
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogleLogin() {
        setLoading(true)
        try {
            await googleLogin()
            toast.success("Başarı ile giriş yaptınız!")
            navigate("/")
        } catch (error) {
            console.error('Google login error:', error)
            toast.error("Google ile giriş yapılırken bir hata oluştu!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo ve Başlık */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                                <img src="/SoccaZ.png" alt="SoccaZ Logo" className="w-16 h-16 object-cover rounded-xl" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Hoş Geldiniz! 👋
                        </h2>
                        <p className="text-gray-600">
                            Hesabınıza giriş yapın ve halı saha rezervasyonlarınızı yönetin
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <form onSubmit={handleEmailLogin} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    E-posta Adresi
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={loginObj.email}
                                        onChange={updateValue}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400"
                                        placeholder="ornek@email.com"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Şifre
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={loginObj.password}
                                        onChange={updateValue}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Şifremi Unuttum Linki */}
                            <div className="flex items-center justify-end">
                                <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200">
                                    Şifremi unuttum
                                </Link>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Giriş yapılıyor...</span>
                                    </div>
                                ) : (
                                    'Giriş Yap'
                                )}
                            </button>
                        </form>

                        {/* Ayırıcı */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">veya</span>
                                </div>
                            </div>
                        </div>

                        {/* Google Login Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="mt-6 w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center space-x-3 cursor-pointer"
                        >
                            <FcGoogle size={20} />
                            <span>Google ile Giriş Yap</span>
                        </button>

                        {/* Kayıt Ol Linki */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Hesabınız yok mu?{' '}
                                <Link to="/register" className="font-medium text-green-600 hover:text-green-700 transition-colors duration-200 cursor-pointer">
                                    Hemen kayıt olun
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Alt Bilgi */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Giriş yaparak{' '}
                            <Link to="/terms" className="text-green-600 hover:text-green-700">
                                Kullanım Şartları
                            </Link>
                            {' '}ve{' '}
                            <Link to="/privacy" className="text-green-600 hover:text-green-700">
                                Gizlilik Politikası
                            </Link>
                            'nı kabul etmiş olursunuz.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Login;