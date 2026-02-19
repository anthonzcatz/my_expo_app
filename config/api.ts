// API Configuration - Auto-detects base URL
const getApiBaseUrl = (): string => {
  // For development on localhost
  if (__DEV__) {
    // TEMPORARY: Use online API for Expo Go testing
    // Change back to localhost after testing
    return 'https://cstdc.jdco.online/api';
    
    // Original localhost (uncomment after testing):
    // return 'http://192.168.1.46:8080/my_expo_app/api';
  }
  
  // For production - domain where /api is deployed
  return 'https://cstdc.jdco.online/api';
};

export const API_BASE_URL: string = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login.php`,
  LEAVE_TYPES: `${API_BASE_URL}/leave/types.php`,
  LEAVE_APPLY: `${API_BASE_URL}/leave/apply.php`,
  PROFILE: `${API_BASE_URL}/employee/profile.php`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
