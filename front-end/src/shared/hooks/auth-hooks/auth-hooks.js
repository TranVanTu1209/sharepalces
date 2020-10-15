import { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState('');
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((id, token, expirationDate) => {
    setUserId(id);
    setToken(token);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 3600 * 1000);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify({
      userId: id,
      token: token,
      expiration: tokenExpirationDate
    }));
  }, []);

  const logout = useCallback(() => {
    setUserId('');
    setTokenExpirationDate(null);
    setToken(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.token && new Date(userData.expiration) > new Date())
    {
      login(userData.userId, userData.token, new Date(userData.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate)
    {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else
    {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);
  return {
    token, login, logout, userId
  }
}