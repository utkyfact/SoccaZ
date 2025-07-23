// Rate limiter utility
class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }

  isRateLimited(key, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Eski girişimleri temizle
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return true;
    }
    
    // Yeni girişimi ekle
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return false;
  }
  
  clearAttempts(key) {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Form submission rate limiter
export const checkFormRateLimit = (formType, userEmail) => {
  const key = `${formType}_${userEmail}`;
  return rateLimiter.isRateLimited(key, 3, 300000); // 3 attempts per 5 minutes
}; 