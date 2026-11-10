/**
 * Role-Based Access Control (RBAC) middleware generator.
 * @param {Array<string>|string} allowedRoles Single role or array of allowed roles
 */
const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required prior to authorization check.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Requires one of the following roles: [${roles.join(', ')}].`
      });
    }

    next();
  };
};

module.exports = { requireRole };

