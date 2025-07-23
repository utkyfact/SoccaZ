
import React, { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

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
                setUserProfile(userData);
            } else {
                const newUserData = {
                    email: user.email,
                    displayName: user.displayName || user.email,
                    role: 'user',
                    status: 'active',
                    phone: '',
                    createdAt: new Date(),
                    photoURL: user.photoURL || null,
                    avatarId: 'default',
                    emailVerified: user.emailVerified || false,
                    lastLogin: new Date()
                };
                
                await setDoc(doc(db, "users", user.uid), newUserData);
                setIsAdmin(false);
                setUserProfile(newUserData);
            }
        } catch (error) {
            console.error("Admin kontrolü hatası:", error);
            setIsAdmin(false);
        }
    };

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

    const updateAvatar = async (avatarId) => {
        if (!user) {
            throw new Error("Kullanıcı giriş yapmamış");
        }
        
        try {
            await setDoc(doc(db, "users", user.uid), {
                avatarId: avatarId
            }, { merge: true });
            
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

    const updateUserProfile = async (profileData) => {
        if (!user) {
            throw new Error("Kullanıcı giriş yapmamış");
        }
        
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...profileData,
                updatedAt: new Date()
            }, { merge: true });
            
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

    const deletedUser = async (password) => {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("Kullanıcı bulunamadı.");
        }

        try {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            await deleteUser(user);
        } catch (error) {
            console.error("Hesap silinirken Firebase hatası:", error);
            if (error.code === 'auth/wrong-password') {
                throw new Error("Şifre yanlış. Lütfen tekrar deneyin.");
            }
            throw new Error("Hesap silinirken bir hata oluştu.");
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
                updateUserProfile,
                deletedUser
            }}>
                {children}
            </AuthContext.Provider>
        </>
    );
}

export const useAuth = () => useContext(AuthContext);