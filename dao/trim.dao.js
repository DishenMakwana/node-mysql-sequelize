const { Op } = require('sequelize');
const Trim = require('../models/trim');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');

const createTrim = async (name, slug) => {
  return Trim.create({
    name: name,
    slug: slug,
  });
};

const findTrims = async (term) => {
  return Trim.findAll({
    where: {
      name: { [Op.like]: '%' + term + '%' },
      deletedAt: null,
    },
    attributes: ['id', 'name'],
    raw: true,
  });
};

const findTrimByName = async (name) => {
  return Trim.findOne({
    where: {
      name: name,
      deletedAt: null,
    },
  });
};

const findTrimById = async (id) => {
  const trimObj = await Trim.findOne({
    where: {
      id: id,
      deletedAt: null,
    },
    attributes: ['id', 'name'],
    raw: true,
  });

  if (!trimObj) {
    let error = new Error(messages.TRIM_NOT_FOUND);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return trimObj;
};

const updateTrim = async (id, name, slug) => {
  return Trim.update(
    {
      name: name,
      slug: slug,
    },
    {
      where: {
        id: id,
      },
    }
  );
};

const deleteTrimById = async (id) => {
  return Trim.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  createTrim,
  findTrimById,
  updateTrim,
  findTrims,
  findTrimByName,
  deleteTrimById,
};
