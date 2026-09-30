import { useState, useEffect } from 'react';

export function useIsLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
    const pid   = localStorage.getItem('people_id')   || localStorage.getItem('PeopleID');
    return !!(token && pid);
  });

  useEffect(() => {
    const sync = () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('AccessToken');
      const pid   = localStorage.getItem('people_id')   || localStorage.getItem('PeopleID');
      setIsLoggedIn(!!(token && pid));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  return isLoggedIn;
}
