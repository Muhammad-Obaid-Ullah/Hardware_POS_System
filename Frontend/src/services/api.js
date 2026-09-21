export const API_BASE_URL = "https://hardware-pos-system-98ei.onrender.com";

export function buildApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
