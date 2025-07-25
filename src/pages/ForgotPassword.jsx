import React, { useState } from 'react'
import { Link } from 'react-router';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { validateEmail, sanitizeInput } from '../utils/inputSanitizer';
import { checkDDoSProtection } from '../utils/advancedRateLimiter';

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const { resetEmail } = useAuth()

    const updateEmail = (e) => {
        const { value } = e.target
        // Input'u sanitize et
        const sanitizedValue = sanitizeInput(value);
        setEmail(sanitizedValue)
    }

    async function handleResetPassword(e) {
        e.preventDefault()
        
        // DDoS Protection kontrolü
        const ddosCheck = checkDDoSProtection('password-reset');
        if (!ddosCheck.allowed) {
            toast.error(ddosCheck.message);
            return;
        }
        
        if (!email) {
            toast.error("Bitte geben Sie Ihre E-Mail-Adresse ein!")
            return
        }

        if (!validateEmail(email)) {
            toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein!")
            return
        }

        setLoading(true)
        try {
            await resetEmail({ email })
            setEmailSent(true)
            toast.success("Passwort-Reset-E-Mail wurde gesendet! Bitte überprüfen Sie Ihren Posteingang.")
        } catch (error) {
            console.error('Password reset error:', error)
            if (error.code === 'auth/user-not-found') {
                toast.error("Kein Benutzer mit dieser E-Mail-Adresse gefunden!")
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Ungültige E-Mail-Adresse!")
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Zu viele Anfragen. Bitte versuchen Sie es später erneut!")
            } else {
                toast.error("Beim Senden der Passwort-Reset-E-Mail ist ein Fehler aufgetreten!")
            }
        } finally {
            setLoading(false)
        }
    }

    if (emailSent) {
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
                                E-Mail gesendet! 📧
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Wir haben Ihnen eine E-Mail mit einem Link zum Zurücksetzen Ihres Passworts gesendet.
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
                                    Überprüfen Sie Ihren Posteingang
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Bitte überprüfen Sie Ihre E-Mail-Adresse <strong>{email}</strong> und klicken Sie auf den Link in der E-Mail, um Ihr Passwort zurückzusetzen.
                                </p>
                                <div className="pt-4">
                                    <p className="text-xs text-gray-500 mb-4">
                                        Haben Sie keine E-Mail erhalten? Überprüfen Sie Ihren Spam-Ordner.
                                    </p>
                                    <button
                                        onClick={() => setEmailSent(false)}
                                        className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors duration-200 cursor-pointer"
                                    >
                                        Erneut versuchen
                                    </button>
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
                            Passwort vergessen? 🔐
                        </h2>
                        <p className="text-gray-600">
                            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts
                        </p>
                    </div>

                    {/* Şifre Sıfırlama Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    E-Mail-Adresse
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={updateEmail}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-gray-400"
                                        placeholder="Beispiel@email.com"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
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
                                        <span>Wird gesendet...</span>
                                    </div>
                                ) : (
                                    'Passwort-Reset-E-Mail senden'
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

export default ForgotPassword; 