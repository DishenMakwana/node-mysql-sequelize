const Product = require('../models/product');
const Category = require('../models/category');
const Sub_Product = require('../models/sub_products');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');
const { Op } = require('sequelize');

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Sub_Product.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Sub_Product, { foreignKey: 'product_id' });

const Products = async (term) => {
  return Product.findAll(
    {
      include: [
        {
          model: Category,
          where: {
            deletedAt: null,
          },
          attributes: ['id', 'category_name'],
        },
      ],
    },
    {
      where: {
        name: { [Op.like]: '%' + term + '%' },
        deletedAt: null,
      },
      attributes: ['id', 'name', 'category_id', 'amount'],
      raw: true,
    }
  );
};

const AddProducts = async (product_name, category_id, amount) => {
  return Product.create({
    name: product_name,
    category_id: category_id,
    amount: amount,
  });
};

const findProduct = async (product_name, category_id, amount) => {
  return Product.findOne({
    where: {
      name: product_name,
      category_id: category_id,
      amount: amount,
    },
  });
};

const findProductByName = async (product_name) => {
  return Product.findOne({
    where: { name: product_name, deletedAt: null },
  });
};

const findProductById = async (product_id) => {
  const productExists = await Product.findOne({
    where: { id: product_id, deletedAt: null },
    attributes: ['id', 'name', 'amount', 'category_id'],
  });

  if (!productExists) {
    let error = new Error(messages.PRODUCT_DOESNOT_EXISTS);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return productExists;
};

const updateProduct = async (product_name, category_id, amount, product_id) => {
  await Product.update(
    { name: product_name, amount: amount, category_id: category_id },
    { where: { id: product_id } }
  );
};

const deleteProducts = async (product_id) => {
  return Product.destroy({ where: { id: product_id } });
};

const getSubProduct = async (term) => {
  return Sub_Product.findAll(
    {
      include: [
        {
          model: Product,
          where: {
            deletedAt: null,
          },
          attributes: ['id', 'name'],
        },
      ],
    },
    {
      where: {
        name: { [Op.like]: '%' + term + '%' },
        deletedAt: null,
      },
      attributes: ['id', 'name'],
      raw: true,
    }
  );
};

const findSubProductById = async (subproduct_id) => {
  const subproductExists = await Sub_Product.findOne({
    where: { id: subproduct_id, deletedAt: null },
    attributes: ['id', 'name', 'product_id'],
  });

  if (!subproductExists) {
    let error = new Error(messages.SUBPRODUCT_DOESNOT_EXISTS);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return subproductExists;
};

const findAllSubProductByProductId = async (product_id) => {
  const subproductList = await Sub_Product.findAll({
    where: { product_id: product_id, deletedAt: null },
    attributes: ['id', 'name'],
  });

  if (!subproductList) {
    let error = new Error(messages.SUBPRODUCT_DOESNOT_EXISTS);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return subproductList;
};

const findSubProductByName = async (subproduct_name) => {
  return Sub_Product.findOne({
    where: { name: subproduct_name, deletedAt: null },
  });
};

const AddSubProducts = async (subproduct_name, product_id) => {
  return Sub_Product.create({
    name: subproduct_name,
    product_id: product_id,
  });
};

const deleteSubProducts = async (subproduct_id) => {
  return Sub_Product.destroy({
    where: { id: subproduct_id },
  });
};

const findSubProduct = async (subproduct_id, name, product_id) => {
  return Sub_Product.findOne({
    where: {
      id: subproduct_id,
      name: name,
      product_id: product_id,
    },
  });
};

const updateSubProduct = async (subproduct_id, name, product_id) => {
  await Sub_Product.update(
    { name: name, product_id: product_id },
    { where: { id: subproduct_id } }
  );
};

module.exports = {
  Products,
  AddProducts,
  findProduct,
  findProductById,
  updateProduct,
  deleteProducts,
  findProductByName,
  getSubProduct,
  findSubProductById,
  findSubProductByName,
  AddSubProducts,
  deleteSubProducts,
  findSubProduct,
  updateSubProduct,
  findAllSubProductByProductId,
};
