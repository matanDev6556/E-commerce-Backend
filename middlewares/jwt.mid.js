const { expressjwt: expjwt } = require('express-jwt');
const { Token } = require('../modules/auth/token');

function authJwt() {
  const API = process.env.API_URL;
  return expjwt({
    secret: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      `${API}/auth/login`,
      `${API}/auth/login/`,

      `${API}/auth/register`,
      `${API}/auth/register/`,

      `${API}/auth/forgot-password`,
      `${API}/auth/forgot-password/`,

      `${API}/auth/verify-otp`,
      `${API}/auth/verify-otp/`,

      `${API}/auth/reset-password`,
      `${API}/auth/reset-password/`,
    ],
  });
}

async function isRevoked(req, jwt) {
  const authHeader = req.header('Authorization');
  console.log('authHeader', authHeader);
  if (!authHeader) {
    return false;
  }

  if (!authHeader.startsWith('Bearer')) {
    return true;
  }

  const accessToken = authHeader.replace('Bearer', '').trim();
  const token = await Token.findOne({ accessToken });

  const adminRouteRegex = /^\/api\/admin\//i;
  const adminFault =
    !jwt.payload.isAdmin && adminRouteRegex.test(req.originalUrl);

  return adminFault || !token;
}

module.exports = authJwt;
