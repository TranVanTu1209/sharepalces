import { useRef } from 'react';
import { useState, useCallback, useEffect } from 'react';

export const useHttpClient = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
    try
    {
      const response = await fetch(url, {
        method: method,
        mode: 'cors',
        headers: headers,
        body: body,
        signal: httpAbortCtrl.signal
      });
      const data = await response.json();
      activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);
      if (!response.ok)
      {
        throw new Error(response.message || 'Error occur');
      }
      setIsLoading(false);
      return data;
    } catch (error)
    {
      setError(error.message || 'Some thing went wrong. Please try again!');
      setIsLoading(false);
      throw error;
    }
  }, []);

  const clearError = () => setError(null);

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    }
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearError
  }
}