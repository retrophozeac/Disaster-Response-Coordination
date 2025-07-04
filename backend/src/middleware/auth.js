const mockUsers = {
  'user-1': { id: 'user-1', role: 'contributor', name: 'netrunnerX' },
  'user-2': { id: 'user-2', role: 'admin', name: 'reliefAdmin' },
};

const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const user = mockUsers[userId];

  if (!user) {
    // For this assignment, we'll default to a contributor if no ID is provided
    req.user = mockUsers['user-1'];
  } else {
    req.user = user;
  }
  
  next();
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
