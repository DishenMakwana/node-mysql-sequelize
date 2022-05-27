require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = async (user, role) => {
  return jwt.sign(
    { email: user.email, id: user.id, role: role.role_id },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME }
  );
};

module.exports = { generateToken };
