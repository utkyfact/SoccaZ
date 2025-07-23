// Security Testing Utility
import { validateEmail, validatePhone, sanitizeInput } from './inputSanitizer';

// XSS Test Patterns
const XSS_PATTERNS = [
  '<script>alert("XSS")</script>',
  'javascript:alert("XSS")',
  '<img src=x onerror=alert("XSS")>',
  '"><script>alert("XSS")</script>',
  "'; alert('XSS'); //",
  '<iframe src="javascript:alert(`XSS`)"></iframe>',
  '<svg onload=alert("XSS")>',
  '<body onload=alert("XSS")>',
  'eval("alert(\'XSS\')")',
  '<script src="http://evil.com/xss.js"></script>'
];

// Test Email Patterns
const EMAIL_TESTS = [
  { email: 'test@example.com', should: true },
  { email: 'user.name@domain.co.uk', should: true },
  { email: 'user+tag@example.com', should: true },
  { email: 'invalid.email', should: false },
  { email: '@example.com', should: false },
  { email: 'test@', should: false },
  { email: '<script>alert("xss")</script>@test.com', should: false },
  { email: 'test@example@com', should: false },
  { email: '', should: false },
  { email: null, should: false }
];

// Test Phone Patterns
const PHONE_TESTS = [
  // Türkiye telefon numaraları
  { phone: '+90 532 123 4567', should: true },
  { phone: '0532 123 4567', should: true },
  { phone: '5321234567', should: true },
  
  // Almanya telefon numaraları
  { phone: '+49 151 12345678', should: true },
  { phone: '+49 170 1234567', should: true },
  { phone: '0151 12345678', should: true },
  
  // Diğer ülkeler
  { phone: '+1234567890', should: true },
  
  // Geçersiz numaralar
  { phone: '123', should: false },
  { phone: 'abc123def', should: false },
  { phone: '<script>alert("xss")</script>', should: false },
  { phone: '', should: false },
  { phone: null, should: false }
];

// XSS Sanitization Test
export const testXSSSanitization = () => {
  console.log('🧪 XSS Sanitization Test başlıyor...');
  let passed = 0;
  let failed = 0;

  XSS_PATTERNS.forEach((pattern, index) => {
    const sanitized = sanitizeInput(pattern);
    const isSafe = !sanitized.includes('<script') && 
                   !sanitized.includes('javascript:') && 
                   !sanitized.includes('onerror=') &&
                   !sanitized.includes('onload=');
    
    if (isSafe) {
      console.log(`✅ XSS Test ${index + 1}: PASSED`);
      passed++;
    } else {
      console.log(`❌ XSS Test ${index + 1}: FAILED - "${sanitized}"`);
      failed++;
    }
  });

  console.log(`🧪 XSS Test Sonuçları: ${passed} PASSED, ${failed} FAILED`);
  return { passed, failed, total: XSS_PATTERNS.length };
};

// Email Validation Test
export const testEmailValidation = () => {
  console.log('📧 Email Validation Test başlıyor...');
  let passed = 0;
  let failed = 0;

  EMAIL_TESTS.forEach((test, index) => {
    const result = validateEmail(test.email);
    const isCorrect = result === test.should;
    
    if (isCorrect) {
      console.log(`✅ Email Test ${index + 1}: PASSED`);
      passed++;
    } else {
      console.log(`❌ Email Test ${index + 1}: FAILED - "${test.email}" expected ${test.should}, got ${result}`);
      failed++;
    }
  });

  console.log(`📧 Email Test Sonuçları: ${passed} PASSED, ${failed} FAILED`);
  return { passed, failed, total: EMAIL_TESTS.length };
};

// Phone Validation Test
export const testPhoneValidation = () => {
  console.log('📱 Phone Validation Test başlıyor...');
  let passed = 0;
  let failed = 0;

  PHONE_TESTS.forEach((test, index) => {
    const result = validatePhone(test.phone);
    const isCorrect = result === test.should;
    
    if (isCorrect) {
      console.log(`✅ Phone Test ${index + 1}: PASSED`);
      passed++;
    } else {
      console.log(`❌ Phone Test ${index + 1}: FAILED - "${test.phone}" expected ${test.should}, got ${result}`);
      failed++;
    }
  });

  console.log(`📱 Phone Test Sonuçları: ${passed} PASSED, ${failed} FAILED`);
  return { passed, failed, total: PHONE_TESTS.length };
};

// Tüm Güvenlik Testlerini Çalıştır
export const runAllSecurityTests = () => {
  console.log('🚀 TÜM GÜVENLİK TESTLERİ BAŞLIYOR...');
  console.log('=' * 50);
  
  const xssResults = testXSSSanitization();
  const emailResults = testEmailValidation();
  const phoneResults = testPhoneValidation();
  
  const totalPassed = xssResults.passed + emailResults.passed + phoneResults.passed;
  const totalFailed = xssResults.failed + emailResults.failed + phoneResults.failed;
  const totalTests = xssResults.total + emailResults.total + phoneResults.total;
  
  console.log('=' * 50);
  console.log(`🎯 GENEL SONUÇ: ${totalPassed}/${totalTests} TEST PASSED`);
  console.log(`📊 Başarı Oranı: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  
  if (totalFailed === 0) {
    console.log('🎉 TÜM TESTLER BAŞARILI! Güvenlik seviyeniz yüksek.');
  } else {
    console.log(`⚠️ ${totalFailed} test başarısız. Güvenlik iyileştirmesi gerekiyor.`);
  }
  
  return {
    total: totalTests,
    passed: totalPassed,
    failed: totalFailed,
    successRate: (totalPassed / totalTests) * 100
  };
};

// Development'ta console'dan çalıştırılabilir
if (typeof window !== 'undefined') {
  window.runSecurityTests = runAllSecurityTests;
  window.testXSS = testXSSSanitization;
  window.testEmail = testEmailValidation;
  window.testPhone = testPhoneValidation;
} 