import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export const logAuditEvent = async (action, details, userId = null) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      action,
      details,
      userId,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      ip: null // IP will be logged server-side if needed
    });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
};

// Örnek kullanım:
// logAuditEvent('USER_LOGIN', { email: user.email }, user.uid);
// logAuditEvent('ADMIN_ACCESS', { page: 'users_management' }, user.uid);
// logAuditEvent('MESSAGE_SENT', { to: 'contact' }, null); 