const { API_URL } = process.env;

const publicEndpoints = [
  `${API_URL}/login`,
  `${API_URL}/register`,
  `${API_URL}/forgot-password`,
  `${API_URL}/verify-otp`,
  `${API_URL}/reset-password`,
];

module.exports = { publicEndpoints };