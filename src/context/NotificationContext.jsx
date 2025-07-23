import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Bildirimleri dinle
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setLoading(true);
        
        const notificationsRef = collection(db, 'notifications');
        const q = query(
            notificationsRef,
            where('userId', '==', user.uid),
            where('deleted', '==', false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notificationsList = [];
            let unread = 0;

            snapshot.forEach((doc) => {
                const notification = { id: doc.id, ...doc.data() };
                notificationsList.push(notification);
                if (!notification.read) {
                    unread++;
                }
            });

            // Tarihe göre sırala (en yeni üstte)
            notificationsList.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
            
            setNotifications(notificationsList);
            setUnreadCount(unread);
            setLoading(false);
        }, (error) => {
            console.error('Fehler beim Laden der Benachrichtigungen:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Bildirimi okundu olarak işaretle
    const markAsRead = async (notificationId) => {
        if (!user) return;

        try {
            const notificationRef = doc(db, 'notifications', notificationId);
            await updateDoc(notificationRef, {
                read: true,
                readAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Fehler beim Markieren der Benachrichtigung als gelesen:', error);
        }
    };

    // Tüm bildirimleri okundu olarak işaretle
    const markAllAsRead = async () => {
        if (!user || unreadCount === 0) return;

        try {
            const unreadNotifications = notifications.filter(n => !n.read);
            const updatePromises = unreadNotifications.map(notification => {
                const notificationRef = doc(db, 'notifications', notification.id);
                return updateDoc(notificationRef, {
                    read: true,
                    readAt: serverTimestamp()
                });
            });

            await Promise.all(updatePromises);
        } catch (error) {
            console.error('Fehler beim Markieren aller Benachrichtigungen als gelesen:', error);
        }
    };

    // Bildirimi sil
    const deleteNotification = async (notificationId) => {
        if (!user) return;

        try {
            const notificationRef = doc(db, 'notifications', notificationId);
            await updateDoc(notificationRef, {
                deleted: true,
                deletedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Fehler beim Löschen der Benachrichtigung:', error);
        }
    };

    // Yeni bildirim oluştur (admin için)
    const createNotification = async (userId, title, message, type = 'info', link = null) => {
        try {
            await addDoc(collection(db, 'notifications'), {
                userId,
                title,
                message,
                type, // 'info', 'success', 'warning', 'error'
                link,
                read: false,
                deleted: false,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Fehler beim Erstellen der Benachrichtigung:', error);
        }
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        createNotification
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}; 