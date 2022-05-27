const Brand = require('../models/brand');
const { Op } = require('sequelize');
const { statusCodes } = require('../utils/statusCodes');
const { messages } = require('../utils/messages');

const createBrand = async (name, price, slug) => {
  return Brand.create({
    name: name,
    price: price,
    slug: slug,
  });
};

const findBrands = async (term) => {
  return Brand.findAll({
    where: {
      name: { [Op.like]: '%' + term + '%' },
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price'],
    raw: true,
  });
};

const findBrandById = async (id) => {
  const brandObj = await Brand.findOne({
    where: {
      id: id,
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price'],
    raw: true,
  });

  if (!brandObj) {
    let error = new Error(messages.BRAND_NOT_FOUND);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return brandObj;
};

const findBrandByName = async (id, name) => {
  return Brand.findOne({
    where: {
      id: { [Op.ne]: id },
      name: name,
      deletedAt: null,
    },
    attributes: ['id', 'name', 'price', 'slug'],
    raw: true,
  });
};

const updateBrand = async (id, name, price, slug) => {
  return Brand.update(
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

const deleteBrandById = async (id) => {
  return Brand.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  createBrand,
  findBrandById,
  findBrandByName,
  updateBrand,
  findBrands,
  deleteBrandById,
};
