// CSRF Protection utility
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const setCSRFToken = () => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

export const getCSRFToken = () => {
  return sessionStorage.getItem('csrf_token');
};

export const validateCSRFToken = (token) => {
  const storedToken = getCSRFToken();
  return storedToken && storedToken === token;
};

// Form'lara CSRF token eklemek için hook
export const useCSRFProtection = () => {
  const [csrfToken, setCsrfToken] = React.useState('');
  
  React.useEffect(() => {
    let token = getCSRFToken();
    if (!token) {
      token = setCSRFToken();
    }
    setCsrfToken(token);
  }, []);
  
  return csrfToken;
}; 