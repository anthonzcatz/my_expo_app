// API Configuration - Centralized Domain Settings
// ===========================================
// CHANGE ONLY THIS SECTION TO UPDATE DOMAIN
// ===========================================
const DOMAIN_SETTINGS = {
  // Set your domain here (e.g., 'https://your-domain.com')
  PRODUCTION_DOMAIN: 'https://cstdc.jdco.online',
  DEVELOPMENT_DOMAIN: 'https://cstdc.jdco.online', // Change to localhost if needed
  
  // Local development (uncomment and modify if using localhost)
  // DEVELOPMENT_DOMAIN: 'http://192.168.1.46:8080/my_expo_app',
  
  // API path (usually '/api')
  API_PATH: '/api',
  
  // User images path (usually '/admin/page/user_img')
  USER_IMAGES_PATH: '/admin/page/user_img',
};
// ===========================================
// END OF SETTINGS - DO NOT MODIFY BELOW
// ===========================================

// Auto-detects base URL
const getApiBaseUrl = (): string => {
  // For development
  if (__DEV__) {
    return `${DOMAIN_SETTINGS.DEVELOPMENT_DOMAIN}${DOMAIN_SETTINGS.API_PATH}`;
  }
  
  // For production
  return `${DOMAIN_SETTINGS.PRODUCTION_DOMAIN}${DOMAIN_SETTINGS.API_PATH}`;
};

// Get base URL for images (without /api)
const getBaseUrl = (): string => {
  if (__DEV__) {
    return DOMAIN_SETTINGS.DEVELOPMENT_DOMAIN;
  }
  return DOMAIN_SETTINGS.PRODUCTION_DOMAIN;
};

export const API_BASE_URL: string = getApiBaseUrl();
export const BASE_URL: string = getBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login.php`,
  LEAVE_TYPES: `${API_BASE_URL}/leave/types.php`,
  LEAVE_APPLY: `${API_BASE_URL}/leave/apply.php`,
  PROFILE: `${API_BASE_URL}/employee/profile.php`,
  UPLOAD_IMAGE: `${API_BASE_URL}/upload_image.php`,
  UPDATE_PROFILE: `${API_BASE_URL}/update_profile.php`,
};

// Image URLs
export const IMAGE_URLS = {
  USER_IMAGES: `${BASE_URL}${DOMAIN_SETTINGS.USER_IMAGES_PATH}`,
};

export default {
  API_BASE_URL,
  BASE_URL,
  API_ENDPOINTS,
  IMAGE_URLS,
};
