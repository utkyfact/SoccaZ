// Advanced DDoS Protection Rate Limiter
class AdvancedRateLimiter {
  constructor() {
    this.requests = new Map();
    this.blockedIPs = new Map();
    this.suspiciousActivity = new Map();
    
    // Temizleme işlemi her 5 dakikada bir
    setInterval(() => this.cleanup(), 300000);
  }

  // IP tabanlı rate limiting
  checkIPRateLimit(ip, action = 'general') {
    const now = Date.now();
    const key = `${ip}_${action}`;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    const windowMs = this.getWindowMs(action);
    const maxRequests = this.getMaxRequests(action);
    
    // Eski istekleri temizle
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (validRequests.length >= maxRequests) {
      this.recordSuspiciousActivity(ip, action);
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  // Aksiyona göre limit ayarları
  getWindowMs(action) {
    const windows = {
      'login': 900000,        // 15 dakika
      'register': 3600000,    // 1 saat
      'contact': 300000,      // 5 dakika
      'form_submit': 60000,   // 1 dakika
      'api_call': 60000,      // 1 dakika
      'general': 300000       // 5 dakika
    };
    return windows[action] || windows.general;
  }

  getMaxRequests(action) {
    const limits = {
      'login': 5,           // 15 dakikada 5 giriş
      'register': 3,        // 1 saatte 3 kayıt
      'contact': 3,         // 5 dakikada 3 mesaj
      'form_submit': 10,    // 1 dakikada 10 form
      'api_call': 100,      // 1 dakikada 100 API çağrısı
      'general': 50         // 5 dakikada 50 genel istek
    };
    return limits[action] || limits.general;
  }

  // Şüpheli aktivite kaydı
  recordSuspiciousActivity(ip, action) {
    const key = `suspicious_${ip}`;
    const now = Date.now();
    
    if (!this.suspiciousActivity.has(key)) {
      this.suspiciousActivity.set(key, []);
    }
    
    const activities = this.suspiciousActivity.get(key);
    activities.push({ action, timestamp: now });
    
    // Son 1 saatte 10'dan fazla şüpheli aktivite varsa IP'yi blokla
    const recentActivities = activities.filter(a => now - a.timestamp < 3600000);
    
    if (recentActivities.length >= 10) {
      this.blockIP(ip, 3600000); // 1 saat blokla
    }
    
    this.suspiciousActivity.set(key, recentActivities);
  }

  // IP bloklama
  blockIP(ip, durationMs) {
    const unblockTime = Date.now() + durationMs;
    this.blockedIPs.set(ip, unblockTime);
    
    console.warn(`🚫 IP BLOCKED: ${ip} until ${new Date(unblockTime).toLocaleString()}`);
    
    // Firebase Analytics'e rapor gönder (opsiyonel)
    this.reportToAnalytics(ip, 'ip_blocked');
  }

  // IP bloklu mu kontrol et
  isIPBlocked(ip) {
    if (!this.blockedIPs.has(ip)) return false;
    
    const unblockTime = this.blockedIPs.get(ip);
    const now = Date.now();
    
    if (now >= unblockTime) {
      this.blockedIPs.delete(ip);
      return false;
    }
    
    return true;
  }

  // User Agent analizi (bot detection)
  isSuspiciousUserAgent(userAgent) {
    if (!userAgent) return true;
    
    const suspiciousPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /python/i, /curl/i, /wget/i, /postman/i,
      /automated/i, /script/i, /tool/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  // Genel DDoS kontrolü
  checkDDoSProtection(ip, action, userAgent = null) {
    // 1. IP bloklu mu?
    if (this.isIPBlocked(ip)) {
      return {
        allowed: false,
        reason: 'IP_BLOCKED',
        message: 'IP adresiniz geçici olarak engellenmiştir.'
      };
    }
    
    // 2. Şüpheli User Agent?
    if (userAgent && this.isSuspiciousUserAgent(userAgent)) {
      this.recordSuspiciousActivity(ip, 'suspicious_user_agent');
      return {
        allowed: false,
        reason: 'SUSPICIOUS_USER_AGENT',
        message: 'Geçersiz istemci algılandı.'
      };
    }
    
    // 3. Rate limit kontrolü
    if (!this.checkIPRateLimit(ip, action)) {
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.'
      };
    }
    
    return {
      allowed: true,
      reason: 'ALLOWED',
      message: 'İstek onaylandı.'
    };
  }

  // Analytics'e rapor gönder
  reportToAnalytics(ip, event) {
    // Firebase Analytics veya başka analytics servisine rapor
    if (typeof gtag !== 'undefined') {
      gtag('event', event, {
        custom_parameter_ip: ip.substring(0, 8) + '***', // Privacy için kısalt
        event_category: 'security',
        event_label: 'ddos_protection'
      });
    }
  }

  // Temizleme işlemi
  cleanup() {
    const now = Date.now();
    
    // Eski istekleri temizle
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => now - timestamp < 3600000);
      if (validRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRequests);
      }
    }
    
    // Eski blokları temizle
    for (const [ip, unblockTime] of this.blockedIPs.entries()) {
      if (now >= unblockTime) {
        this.blockedIPs.delete(ip);
      }
    }
    
    // Eski şüpheli aktiviteleri temizle
    for (const [key, activities] of this.suspiciousActivity.entries()) {
      const recentActivities = activities.filter(a => now - a.timestamp < 3600000);
      if (recentActivities.length === 0) {
        this.suspiciousActivity.delete(key);
      } else {
        this.suspiciousActivity.set(key, recentActivities);
      }
    }
  }

  // İstatistikler
  getStats() {
    return {
      totalRequests: Array.from(this.requests.values()).reduce((total, reqs) => total + reqs.length, 0),
      blockedIPs: this.blockedIPs.size,
      suspiciousActivities: this.suspiciousActivity.size,
      activeRateLimits: this.requests.size
    };
  }
}

// Singleton instance
export const ddosProtection = new AdvancedRateLimiter();

// IP adresi alma utility
export const getClientIP = () => {
  // Gerçek production'da reverse proxy header'larından alınır
  // Development için mock IP
  return '127.0.0.1';
};

// Kolay kullanım için wrapper fonksiyonlar
export const checkDDoSProtection = (action, userAgent = navigator.userAgent) => {
  const ip = getClientIP();
  return ddosProtection.checkDDoSProtection(ip, action, userAgent);
};

export const reportSuspiciousActivity = (action) => {
  const ip = getClientIP();
  ddosProtection.recordSuspiciousActivity(ip, action);
}; 