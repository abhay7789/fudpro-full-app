const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No role found' });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorize;
