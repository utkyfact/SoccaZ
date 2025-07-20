
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    // Admin kontrolü
    const checkAdminStatus = async (user) => {
        if (!user) {
            setIsAdmin(false);
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setIsAdmin(userData.role === 'admin');
                
                // User state'ini Firestore verileriyle güncelle
                setUserProfile(userData);
            } else {
                // Kullanıcı dokümanı yoksa oluştur
                const newUserData = {
                    email: user.email,
                    displayName: user.displayName || user.email,
                    role: 'user', // Varsayılan rol
                    status: 'active', // Varsayılan durum
                    phone: '', // Boş telefon numarası
                    createdAt: new Date(),
                    photoURL: user.photoURL || null,
                    avatarId: 'default', // Varsayılan avatar
                    emailVerified: user.emailVerified || false,
                    lastLogin: new Date()
                };
                
                await setDoc(doc(db, "users", user.uid), newUserData);
                setIsAdmin(false);
                
                // User state'ini güncelle
                setUserProfile(newUserData);
            }
        } catch (error) {
            console.error("Admin kontrolü hatası:", error);
            setIsAdmin(false);
        }
    };

    // Son giriş tarihini güncelle
    const updateLastLogin = async (user) => {
        if (!user) return;
        
        try {
            await setDoc(doc(db, "users", user.uid), {
                lastLogin: new Date(),
                emailVerified: user.emailVerified
            }, { merge: true });
        } catch (error) {
            console.error("Son giriş tarihi güncellenirken hata:", error);
        }
    };

    // Avatar güncelleme fonksiyonu
    const updateAvatar = async (avatarId) => {
        if (!user) {
            throw new Error("Kullanıcı giriş yapmamış");
        }
        
        try {
            await setDoc(doc(db, "users", user.uid), {
                avatarId: avatarId
            }, { merge: true });
            
            // Firestore user verilerini güncelle
            setUserProfile(prevProfile => ({
                ...prevProfile,
                avatarId: avatarId
            }));
            
            return true;
        } catch (error) {
            console.error("Avatar güncellenirken hata:", error);
            throw error;
        }
    };

    // Kullanıcı profil güncelleme fonksiyonu
    const updateUserProfile = async (profileData) => {
        if (!user) {
            throw new Error("Kullanıcı giriş yapmamış");
        }
        
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...profileData,
                updatedAt: new Date()
            }, { merge: true });
            
            // Firestore user verilerini güncelle
            setUserProfile(prevProfile => ({
                ...prevProfile,
                ...profileData
            }));
            
            return true;
        } catch (error) {
            console.error("Profil güncellenirken hata:", error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)
            if (currentUser) {
                await checkAdminStatus(currentUser)
                await updateLastLogin(currentUser)
            } else {
                setUserProfile(null)
                setIsAdmin(false)
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const login = ({email,password}) => {
        return signInWithEmailAndPassword(auth,email,password)
    }

    const register = ({email,password}) => {
        return createUserWithEmailAndPassword(auth,email,password)
    }

    const googleLogin = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth,provider)
    }

    const logout = () => {
        return signOut(auth)
    }

    const emailVerification = () => {
        return sendEmailVerification(auth.currentUser)
    }

    const resetEmail = ({email}) => {
        return sendPasswordResetEmail(auth,email)
    }

    // Admin rolü verme fonksiyonu (sadece mevcut adminler kullanabilir)
    const makeAdmin = async (userId) => {
        if (!isAdmin) {
            throw new Error("Bu işlem için admin yetkisi gereklidir");
        }
        
        try {
            await setDoc(doc(db, "users", userId), {
                role: 'admin'
            }, { merge: true });
            return true;
        } catch (error) {
            console.error("Admin yapma hatası:", error);
            throw error;
        }
    };

    return (
        <>
            <AuthContext.Provider value={{ 
                user, 
                userProfile,
                loading,
                login, 
                googleLogin, 
                register, 
                logout, 
                emailVerification, 
                resetEmail, 
                isAdmin, 
                makeAdmin,
                updateAvatar,
                updateUserProfile
            }}>
                {children}
            </AuthContext.Provider>
        </>
    );
}

export const useAuth = () => useContext(AuthContext);