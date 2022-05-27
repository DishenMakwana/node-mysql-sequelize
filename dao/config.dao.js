const { Op } = require('sequelize');
const Config = require('../models/config');

const getConfigs = async (key) => {
  return Config.findOne({
    where: { key: key },
    attributes: ['id', 'key', 'value'],
    raw: true,
  });
};

const getAllConfigs = async (term) => {
  return Config.findAll({
    where: {
      key: { [Op.like]: '%' + term + '%' },
    },
    attributes: ['id', 'key', 'value'],
    raw: true,
  });
};

module.exports = { getConfigs, getAllConfigs };
