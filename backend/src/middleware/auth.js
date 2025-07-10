const jwt = require('jsonwebtoken');
const prisma = require('../database/db');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        gaming_platforms: true,
        total_earnings: true,
        is_active: true
      }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'User not found or account deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    return res.status(403).json({ 
      error: 'Invalid token',
      message: 'Authentication failed'
    });
  }
};

const authenticateCompany = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Company authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'company') {
      return res.status(403).json({ 
        error: 'Invalid token type',
        message: 'Company token required'
      });
    }

    const company = await prisma.company.findUnique({
      where: { id: decoded.companyId },
      select: {
        id: true,
        name: true,
        email: true,
        company_type: true,
        verified: true,
        current_budget: true
      }
    });

    if (!company) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Company not found'
      });
    }

    req.company = company;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid company token',
      message: 'Company authentication failed'
    });
  }
};

module.exports = {
  authenticateToken,
  authenticateCompany
};
