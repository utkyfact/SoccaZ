import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// İlk admin kullanıcısını oluşturmak için bu fonksiyonu kullanın
export const createFirstAdmin = async (userId, userEmail, displayName) => {
    try {
        await setDoc(doc(db, "users", userId), {
            email: userEmail,
            displayName: displayName || userEmail,
            role: 'admin',
            createdAt: new Date(),
            photoURL: null,
            isFirstAdmin: true // İlk admin olduğunu belirtmek için
        });
        
        console.log("✅ İlk admin kullanıcısı başarıyla oluşturuldu!");
        return true;
    } catch (error) {
        console.error("❌ Admin oluşturma hatası:", error);
        return false;
    }
};

// Bu fonksiyonu sadece bir kez çalıştırın!
export const initializeFirstAdmin = async () => {
    // Bu fonksiyonu console'da çalıştırmak için:
    // 1. Tarayıcıda Developer Tools'u açın (F12)
    // 2. Console sekmesine gidin
    // 3. Bu kodu yapıştırın ve çalıştırın:
    
    /*
    import { createFirstAdmin } from './src/utils/createFirstAdmin.js';
    
    // Kendi kullanıcı bilgilerinizi buraya yazın:
    const userId = "SIZIN_USER_ID_NIZ"; // Firebase Auth'dan alın
    const userEmail = "admin@example.com"; // Kendi email'iniz
    const displayName = "Admin User"; // İstediğiniz isim
    
    createFirstAdmin(userId, userEmail, displayName);
    */
    
    console.log("📝 İlk admin oluşturma talimatları:");
    console.log("1. Firebase Console'da Firestore'a gidin");
    console.log("2. 'users' koleksiyonu oluşturun");
    console.log("3. Kullanıcı dokümanı ekleyin:");
    console.log(`
    {
      "email": "admin@example.com",
      "displayName": "Admin User", 
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "photoURL": null
    }
    `);
}; 