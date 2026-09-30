// Orphaned/unused (live pages import ../config), but derive from VITE_API_URL
// anyway so a hardcoded localhost can't break prod if this ever gets wired up.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const API_BASE_URL = `${BASE}/api`;

export const API_ENDPOINTS = {
    COUNTRIES: `${API_BASE_URL}/countries/`,
    STATES: `${API_BASE_URL}/states/`,
    BUSINESSES: `${API_BASE_URL}/businesses/`,
    // Add other endpoints if your minimal version needs them
}; 