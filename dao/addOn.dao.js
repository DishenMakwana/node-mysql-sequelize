const { Op } = require('sequelize');
const AddOn = require('../models/add_on');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');

const createAddOn = async (name, slug, price) => {
  return AddOn.create({
    name: name,
    price: price,
    slug: slug,
  });
};

const findAddOns = async (term) => {
  return AddOn.findAll({
    where: {
      name: { [Op.like]: '%' + term + '%' },
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price'],
    raw: true,
  });
};

const findAddOnByName = async (id, name) => {
  return AddOn.findOne({
    where: {
      id: { [Op.ne]: id },
      name: name,
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price'],
    raw: true,
  });
};

const findAddOnById = async (id) => {
  const addOnObj = await AddOn.findOne({
    where: {
      id: id,
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price'],
    raw: true,
  });

  if (!addOnObj) {
    let error = new Error(messages.ADD_ON_NOT_FOUND);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return addOnObj;
};

const updateAddOn = async (id, name, slug, price) => {
  return AddOn.update(
    {
      name: name,
      slug: slug,
      price: price,
    },
    {
      where: {
        id: id,
      },
    }
  );
};

const deleteAddOnById = async (id) => {
  return AddOn.destroy({
    where: {
      id: id,
    },
  });
};

const getAddOnPricing = async (addOnList) => {
  let total = 0;

  const allAddOns = await AddOn.findAll({
    where: {
      id: addOnList,
    },
    attributes: ['price'],
    raw: true,
  });

  for (let addOn of allAddOns) {
    total += parseFloat(addOn.price);
  }

  return total;
};

module.exports = {
  createAddOn,
  findAddOnById,
  updateAddOn,
  findAddOns,
  findAddOnByName,
  deleteAddOnById,
  getAddOnPricing,
};
