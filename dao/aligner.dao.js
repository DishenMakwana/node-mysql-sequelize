const { Op } = require('sequelize');
const Aligner = require('../models/aligner_type');
const { messages } = require('../utils/messages');
const { statusCodes } = require('../utils/statusCodes');

const createAligner = async (name, slug) => {
  return Aligner.create({
    name: name,
    slug: slug,
  });
};

const findAligners = async (term) => {
  const aligners = await Aligner.findAll({
    where: {
      name: {
        [Op.like]: '%' + term + '%',
      },
      deletedAt: null,
    },
    attributes: ['id', 'name'],
    raw: true,
  });

  if (!aligners) {
    let error = new Error(messages.ALIGNER_NOT_FOUND);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return aligners;
};

const findAlignerByName = async (name) => {
  return Aligner.findOne({
    where: {
      name: name,
      deletedAt: null,
    },
    attributes: ['id', 'name', 'slug'],
    raw: true,
  });
};

const findAlignerById = async (id) => {
  const alignerObj = await Aligner.findOne({
    where: {
      id: id,
      deletedAt: null,
    },
    attributes: ['id', 'name'],
    raw: true,
  });

  if (!alignerObj) {
    let error = new Error(messages.ALIGNER_NOT_FOUND);
    error.statusCodes = statusCodes.NOT_FOUND.code;
    throw error;
  }

  return alignerObj;
};

const updateAligner = async (id, name, slug) => {
  return Aligner.update(
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

const deleteAlignerById = async (id) => {
  return Aligner.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  createAligner,
  findAlignerById,
  updateAligner,
  findAligners,
  findAlignerByName,
  deleteAlignerById,
};
