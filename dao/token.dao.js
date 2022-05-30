const Token = require('../models/token');

const findTokenByUserId = async (userId) => {
  return Token.findAll({
    where: { user_id: userId },
    attributes: ['token'],
    order: [['createdAt', 'DESC']],
    raw: true,
  });
};

const createTokenByUserId = async (userId, token) => {
  return Token.create({
    user_id: userId,
    token: token,
  });
};

const removeTokesByUserId = async (userId) => {
  return Token.destroy({ where: { user_id: userId } });
};

const findTokenByToken = async (token) => {
  return Token.findOne({
    where: { token: token },
    attributes: ['token'],
    raw: true,
  });
};

module.exports = {
  findTokenByUserId,
  createTokenByUserId,
  findTokenByToken,
  removeTokesByUserId,
};
