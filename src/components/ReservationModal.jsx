import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

function ReservationModal({ isOpen, onClose, fieldId, fieldName }) {
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fieldData, setFieldData] = useState(null);
    const [existingReservations, setExistingReservations] = useState([]);
    const [formData, setFormData] = useState({
        date: '',
        time: ''
    });

    // Saha bilgilerini ve mevcut rezervasyonları getir
    useEffect(() => {
        const fetchData = async () => {
            if (fieldId) {
                try {
                    // Saha bilgilerini getir
                    const fieldDoc = await getDoc(doc(db, 'fields', fieldId));
                    if (fieldDoc.exists()) {
                        setFieldData(fieldDoc.data());
                    }
                } catch (error) {
                    console.error('Saha bilgileri getirilirken hata:', error);
                }
            }
        };

        if (isOpen && fieldId) {
            fetchData();
        }
    }, [isOpen, fieldId]);

    // Seçilen tarih için mevcut rezervasyonları getir
    useEffect(() => {
        const fetchExistingReservations = async () => {
            if (formData.date && fieldId) {
                try {
                    // Tarih string'ini Date objesine çevir
                    const [year, month, day] = formData.date.split('-');
                    const startOfDay = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);
                    const endOfDay = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59, 999);


                    const q = query(
                        collection(db, 'reservations'),
                        where('fieldId', '==', fieldId),
                        where('date', '>=', startOfDay),
                        where('date', '<=', endOfDay),
                        where('status', '==', 'active')
                    );

                    const querySnapshot = await getDocs(q);
                    const reservations = querySnapshot.docs.map(doc => doc.data());
                    setExistingReservations(reservations);
                } catch (error) {
                    console.error('Mevcut rezervasyonlar getirilirken hata:', error);
                }
            }
        };

        fetchExistingReservations();
    }, [formData.date, fieldId]);

    // Form değişikliklerini handle et
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Saatin geçmiş olup olmadığını kontrol et
    const isTimeDisabled = (timeString) => {
        if (!formData.date) return false;
        
        const today = new Date();
        const selectedDate = new Date(formData.date);
        
        // Bugün değilse, tüm saatler tıklanabilir
        if (selectedDate.toDateString() !== today.toDateString()) {
            return false;
        }
        
        // Bugünse, geçmiş saatleri devre dışı bırak
        const [hour] = timeString.split(':');
        const currentHour = today.getHours();
        
        return parseInt(hour) <= currentHour;
    };

    // Kullanıcının aynı saatte rezervasyon yapıp yapmadığını kontrol et
    const hasUserReservation = () => {
        if (!user || !formData.date || !formData.time) return false;

        const selectedTime = formData.time;
        
        return existingReservations.some(reservation => {
            // Aynı kullanıcının rezervasyonu mu?
            if (reservation.userId !== user.uid) return false;
            
            // Aynı saat mi?
            return reservation.time === selectedTime;
        });
    };

    // Müsait kapasiteyi hesapla
    const getAvailableCapacity = () => {
        if (!fieldData || !formData.date) return fieldData?.capacity || 0;

        const selectedDate = new Date(formData.date);
        const selectedTime = formData.time;

        // Seçilen saatteki rezervasyonları filtrele
        const conflictingReservations = existingReservations.filter(reservation => {
            const reservationTime = reservation.time;
            const reservationDuration = reservation.duration;

            // Çakışma kontrolü
            const reservationStart = new Date(`2000-01-01 ${reservationTime}`);
            const reservationEnd = new Date(reservationStart.getTime() + reservationDuration * 60 * 60 * 1000);

            const selectedStart = new Date(`2000-01-01 ${selectedTime}`);
            const selectedEnd = new Date(selectedStart.getTime() + 1 * 60 * 60 * 1000); // 1 saat sabit

            return (selectedStart < reservationEnd && selectedEnd > reservationStart);
        });

        // Toplam rezerve edilmiş kişi sayısı (her rezervasyon 1 kişi)
        const totalReserved = conflictingReservations.length;
        return Math.max(0, fieldData.capacity - totalReserved);
    };

    // Rezervasyon yap
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Rezervasyon yapmak için giriş yapmalısınız.');
            return;
        }

        // Telefon numarası kontrolü
        if (!userProfile?.phone) {
            toast.error('Rezervasyon yapabilmek için telefon numaranızı profil sayfasından eklemelisiniz.');
            return;
        }

        if (!formData.date || !formData.time) {
            toast.info('Lütfen tarih ve saat seçiniz.');
            return;
        }

        // Geçmiş saat kontrolü
        if (isTimeDisabled(formData.time)) {
            toast.warning('Geçmiş bir saat seçemezsiniz.');
            return;
        }

        // Kullanıcının aynı saatte rezervasyon yapıp yapmadığını kontrol et
        if (hasUserReservation()) {
            toast.warning('Bu saatte zaten rezervasyonunuz bulunmaktadır.');
            return;
        }

        const availableCapacity = getAvailableCapacity();
        if (availableCapacity <= 0) {
            toast.warning('Seçilen tarih ve saatte müsait kapasite bulunmamaktadır.');
            return;
        }

        setLoading(true);

        try {
            // Tarih ve saati birleştir
            const [year, month, day] = formData.date.split('-');
            const [hour, minute] = formData.time.split(':');
            const reservationDate = new Date(year, month - 1, day, hour, minute);

            // Geçmiş tarih kontrolü
            if (reservationDate < new Date()) {
                toast.warning('Geçmiş bir tarih seçemezsiniz.');
                setLoading(false);
                return;
            }

            // Kişi sayısı 1 olarak sabit (kullanıcı kendisi için)
            const personCount = 1;
            const totalPrice = personCount * fieldData.pricePerPerson; // 1 saat sabit

            // Rezervasyon verisi
            const reservationData = {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || user.email,
                userPhone: userProfile.phone,
                fieldId: fieldId,
                fieldName: fieldName,
                fieldCapacity: fieldData.capacity,
                fieldPricePerPerson: fieldData.pricePerPerson,
                date: reservationDate,
                time: formData.time,
                duration: 1, // Sabit 1 saat
                personCount: personCount,
                totalPrice: totalPrice,
                status: 'active',
                createdAt: new Date()
            };

            // Firestore'a kaydet
            await addDoc(collection(db, 'reservations'), reservationData);

            toast.success('Rezervasyonunuz başarıyla oluşturuldu!');

            // Formu temizle ve modalı kapat
            setFormData({
                date: '',
                time: ''
            });
            onClose();

        } catch (error) {
            console.error('Rezervasyon oluşturulurken hata:', error);
            toast.error('Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    // Modal dışına tıklandığında kapat
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const availableCapacity = getAvailableCapacity();
    const userHasReservation = hasUserReservation();

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Rezervasyon Yap</h2>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-green-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-green-100 mt-2">{fieldName}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {fieldData ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Saha Bilgileri */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-2">Saha Bilgileri</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Toplam Kapasite:</span>
                                        <span>{fieldData.capacity} kişi</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Kişi Başı Ücret:</span>
                                        <span>₺{fieldData.pricePerPerson}</span>
                                    </div>
                                    {formData.date && formData.time && (
                                        <div className="flex justify-between">
                                            <span>Kalan Kapasite:</span>
                                            <span className={`font-semibold ${availableCapacity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {availableCapacity} kişi
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tarih */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tarih *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Saat */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${
                                    !formData.date ? 'text-gray-400' : 'text-gray-700'
                                }`}>
                                    Saat * {!formData.date && <span className="text-xs text-gray-400">(Önce tarih seçin)</span>}
                                </label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.date}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                        !formData.date ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <option value="">{formData.date ? 'Saat seçin' : 'Önce tarih seçin'}</option>
                                    {formData.date && Array.from({ length: 16 }, (_, i) => i + 8).map(hour => {
                                        const timeString = `${hour.toString().padStart(2, '0')}:00`;
                                        const isDisabled = isTimeDisabled(timeString);
                                        
                                        return (
                                            <option 
                                                key={hour} 
                                                value={timeString}
                                                disabled={isDisabled}
                                                className={isDisabled ? 'text-gray-400' : ''}
                                            >
                                                {timeString}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>



                            {/* Toplam Ücret */}
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-800">Toplam Ücret:</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        ₺{fieldData.pricePerPerson}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    1 kişi × ₺{fieldData.pricePerPerson} × 1 saat
                                </p>
                            </div>

                            {/* Kullanıcı Rezervasyon Uyarısı */}
                            {formData.date && formData.time && userHasReservation && (
                                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-orange-600 mr-2">⚠️</span>
                                        <span className="text-orange-800 font-medium">
                                            Bu saatte zaten rezervasyonunuz bulunmaktadır.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Geçmiş Saat Uyarısı */}
                            {formData.date && formData.time && isTimeDisabled(formData.time) && (
                                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-orange-600 mr-2">⏰</span>
                                        <span className="text-orange-800 font-medium">
                                            Seçilen saat geçmiş bir zamandır. Lütfen gelecek bir saat seçiniz.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Müsaitlik Uyarısı */}
                            {formData.date && formData.time && !isTimeDisabled(formData.time) && availableCapacity <= 0 && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-red-600 mr-2">⚠️</span>
                                        <span className="text-red-800 font-medium">
                                            Seçilen tarih ve saatte müsait kapasite bulunmamaktadır.
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Butonlar */}
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium cursor-pointer"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || availableCapacity <= 0 || userHasReservation || (formData.time && isTimeDisabled(formData.time))}
                                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            İşleniyor...
                                        </span>
                                    ) : (
                                        'Rezervasyon Yap'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Saha bilgileri yükleniyor...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReservationModal; 