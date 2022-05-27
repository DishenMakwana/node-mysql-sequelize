const Model = require('../models/model_type');
const { Op } = require('sequelize');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');

const createModel = async (name, price, slug) => {
  return Model.create({
    name: name,
    price: price,
    slug: slug,
  });
};

const findModels = async (term) => {
  return Model.findAll({
    where: {
      name: { [Op.like]: '%' + term + '%' },
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price'],
    raw: true,
  });
};

const findModelById = async (id) => {
  const modelObj = await Model.findOne({
    where: {
      id: id,
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price'],
    raw: true,
  });

  if (!modelObj) {
    let error = new Error(messages.MODEL_NOT_FOUND);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return modelObj;
};

const findModelByName = async (id, name) => {
  return Model.findOne({
    where: {
      id: { [Op.ne]: id },
      name: name,
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price', 'slug'],
    raw: true,
  });
};

const updateModel = async (id, name, price, slug) => {
  return Model.update(
    {
      name: name,
      price: price,
      slug: slug,
    },
    {
      where: {
        id: id,
      },
    }
  );
};

const deleteModelById = async (id) => {
  return Model.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  createModel,
  findModelById,
  findModelByName,
  updateModel,
  findModels,
  deleteModelById,
};
