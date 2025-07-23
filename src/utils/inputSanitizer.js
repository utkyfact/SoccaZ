// Input sanitization utilities
import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // DOMPurify ile XSS koruması
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Hiç HTML tag'ine izin verme
    ALLOWED_ATTR: [], // Hiç attribute'a izin verme
    KEEP_CONTENT: true // İçeriği koru, sadece tag'leri temizle
  });
  
  return cleaned.trim();
};

export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return html;
  
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

import validator from 'validator';

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  // Validator.js ile güçlü email doğrulama
  return validator.isEmail(email, {
    allow_display_name: false,
    require_display_name: false,
    allow_utf8_local_part: false,
    require_tld: true
  });
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Validator.js ile telefon doğrulama - Türkiye ve Almanya
  return validator.isMobilePhone(phone, 'tr-TR') || 
         validator.isMobilePhone(phone, 'de-DE') ||
         validator.isMobilePhone(phone, 'any');
};

// URL doğrulama (gelecek için)
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: true
  });
};

export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}; 