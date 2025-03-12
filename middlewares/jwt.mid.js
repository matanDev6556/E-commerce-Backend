const { expressjwt: expjwt } = require('express-jwt');
const { tokenService } = require('../modules/auth/di.auth');

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

      `${API}/checkout/webhook`,
      `${API}/checkout/webhook/`,

    
    ],
  });
}

async function isRevoked(req, jwt) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return false;
  }

  if (!authHeader.startsWith('Bearer')) {
    console.log('Invalid Auth Header format!');
    return true;
  }

  const accessToken = authHeader.replace('Bearer', '').trim();

  const token = await tokenService.findToken(accessToken);

  const adminRouteRegex = /^\/api\/admin\//i;
  const isAdminRoute = adminRouteRegex.test(req.originalUrl);

  const adminFault = !jwt.payload.isAdmin && isAdminRoute;

  return adminFault || !token;
}

module.exports = authJwt;
