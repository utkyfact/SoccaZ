import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { sanitizeInput } from '../utils/inputSanitizer';
import { checkDDoSProtection } from '../utils/advancedRateLimiter';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase/config';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [passwordObj, setPasswordObj] = useState({ 
        password: "", 
        confirmPassword: "" 
    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isValidCode, setIsValidCode] = useState(true)
    const [passwordReset, setPasswordReset] = useState(false)

    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        if (!oobCode) {
            setIsValidCode(false);
            toast.error("Ungültiger oder fehlender Reset-Link!");
        }
    }, [oobCode]);

    const updateValue = (e) => {
        const { value, name } = e.target
        // Input'ları sanitize et
        const sanitizedValue = sanitizeInput(value);
        setPasswordObj({
            ...passwordObj,
            [name]: sanitizedValue
        })
    }

    async function handlePasswordReset(e) {
        e.preventDefault()
        
        // DDoS Protection kontrolü
        const ddosCheck = checkDDoSProtection('password-reset-confirm');
        if (!ddosCheck.allowed) {
            toast.error(ddosCheck.message);
            return;
        }
        
        if (!oobCode) {
            toast.error("Ungültiger Reset-Link!")
            return
        }

        if (!passwordObj.password || !passwordObj.confirmPassword) {
            toast.error("Bitte füllen Sie alle Felder aus!")
            return
        }

        if (passwordObj.password.length < 6) {
            toast.error("Das Passwort muss mindestens 6 Zeichen lang sein!")
            return
        }

        if (passwordObj.password !== passwordObj.confirmPassword) {
            toast.error("Passwörter stimmen nicht überein!")
            return
        }

        setLoading(true)
        try {
            await confirmPasswordReset(auth, oobCode, passwordObj.password)
            setPasswordReset(true)
            toast.success("Passwort wurde erfolgreich zurückgesetzt!")
        } catch (error) {
            console.error('Password reset error:', error)
            if (error.code === 'auth/expired-action-code') {
                toast.error("Der Reset-Link ist abgelaufen. Bitte fordern Sie einen neuen Link an.")
                setIsValidCode(false)
            } else if (error.code === 'auth/invalid-action-code') {
                toast.error("Ungültiger Reset-Link. Bitte fordern Sie einen neuen Link an.")
                setIsValidCode(false)
            } else if (error.code === 'auth/weak-password') {
                toast.error("Passwort zu schwach! Bitte wählen Sie ein stärkeres Passwort.")
            } else {
                toast.error("Beim Zurücksetzen des Passworts ist ein Fehler aufgetreten!")
            }
        } finally {
            setLoading(false)
        }
    }

    if (!isValidCode) {
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
                                Ungültiger Link! ⚠️
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Der Passwort-Reset-Link ist ungültig oder abgelaufen.
                            </p>
                        </div>

                        {/* Hata Mesajı */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="text-center space-y-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Link ist abgelaufen
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Der Link zum Zurücksetzen Ihres Passworts ist nicht mehr gültig. Bitte fordern Sie einen neuen Link an.
                                </p>
                                <div className="pt-4">
                                    <Link
                                        to="/forgot-password"
                                        className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        Neuen Link anfordern
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Giriş Yap Linki */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Zurück zur{' '}
                                <Link to="/login" className="font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
                                    Anmeldung
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    if (passwordReset) {
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
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Passwort zurückgesetzt! ✅
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Ihr Passwort wurde erfolgreich geändert. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
                            </p>
                        </div>

                        {/* Başarı Mesajı */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <div className="text-center space-y-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Passwort erfolgreich geändert
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
                                </p>
                                <div className="pt-4">
                                    <Link
                                        to="/login"
                                        className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        Zur Anmeldung
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        )
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
                            Neues Passwort festlegen 🔐
                        </h2>
                        <p className="text-gray-600">
                            Geben Sie Ihr neues Passwort ein und bestätigen Sie es
                        </p>
                    </div>

                    {/* Yeni Şifre Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Neues Passwort
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={passwordObj.password}
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
                                <p className="text-xs text-gray-500 mt-1">Mindestens 6 Zeichen</p>
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Passwort wiederholen
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={passwordObj.confirmPassword}
                                        onChange={updateValue}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? (
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

                            {/* Reset Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Wird zurückgesetzt...</span>
                                    </div>
                                ) : (
                                    'Passwort zurücksetzen'
                                )}
                            </button>
                        </form>

                        {/* Giriş Yap Linki */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Zurück zur{' '}
                                <Link to="/login" className="font-medium text-green-600 hover:text-green-700 transition-colors duration-200 cursor-pointer">
                                    Anmeldung
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Alt Bilgi */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            Haben Sie Probleme?{' '}
                            <Link to="/contact" className="text-green-600 hover:text-green-700">
                                Kontaktieren Sie uns
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ResetPassword; 