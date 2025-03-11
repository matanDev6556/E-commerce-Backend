const { publicEndpoints } = require('../config/auth.config');
const authService = require('../modules/auth/authentication.service');

async function authorizePostRequests(req, res, next) {
  if (req.method !== 'POST') return next();

  const API = process.env.API_URL;
  if (req.originalUrl.startsWith(`${API}/admin`)) return next();

  const isPublicEndpoint = publicEndpoints.some((endpoint) =>
    req.originalUrl.includes(endpoint)
  );
  if (isPublicEndpoint) return next();

  const authHeader = req.header('Authorization');

  
  if (!authHeader) return next(); 

  const accessToken = authHeader.replace('Bearer', '').trim();

  try {
   
    if (req.body.user) {
       authService.verifyUserMatch(accessToken, req.body.user);
    }

    // בדיקת התאמה לפי ID ב-URL
    const userIdMatch = req.originalUrl.match(/\/users\/([^/]+)\//);
    if (userIdMatch) {
      const id = userIdMatch[1];
      if (authService.isValidId(id)) {
         authService.verifyUserMatch(accessToken, id);
      }
    }

    next();
  } catch (error) {
    return res.status(error.cause?.status || 401).json({ message: error.message });
  }
}

module.exports = authorizePostRequests;