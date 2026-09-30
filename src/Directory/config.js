// Derive the API base from VITE_API_URL so the directory hits the right backend
// per environment (prod Cloud Run vs local dev), not a hardcoded localhost.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const API_BASE_URL = `${BASE}/api`;

export const API_ENDPOINTS = {
    COUNTRIES: `${API_BASE_URL}/businesses/countries`,
    STATES: `${API_BASE_URL}/businesses/states`,
    BUSINESSES: `${API_BASE_URL}/businesses/`,
};