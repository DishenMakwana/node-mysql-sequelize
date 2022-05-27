const Address = require('../models/address');
const City = require('../models/city');
const Country = require('../models/country');
const Patient = require('../models/patient');
const Pincode = require('../models/pincode');
const State = require('../models/state');
const User = require('../models/user');
const UserRole = require('../models/user_role');
const { USER, USER_ADMIN } = require('../utils/constant');

City.hasMany(Pincode, { foreignKey: 'city_id' });
Pincode.belongsTo(City, { foreignKey: 'city_id' });

User.hasOne(UserRole, { foreignKey: 'user_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });

Pincode.hasMany(Address, { foreignKey: 'pincode_id' });
Address.belongsTo(Pincode, { foreignKey: 'pincode_id' });

User.hasMany(Address, {
  foreignKey: 'addressable_id',
  constraints: false,
  scope: {
    addressable_type: 'user',
  },
});
Address.belongsTo(User, { foreignKey: 'addressable_id', constraints: false });

Patient.hasMany(Address, {
  foreignKey: 'addressable_id',
  constraints: false,
  scope: {
    addressable_type: 'patient',
  },
});
Address.belongsTo(Patient, {
  foreignKey: 'addressable_id',
  constraints: false,
});

Country.hasMany(State, { foreignKey: 'country_id' });
State.belongsTo(Country, { foreignKey: 'country_id' });

State.hasMany(City, { foreignKey: 'state_id' });
City.belongsTo(State, { foreignKey: 'state_id' });

const findSingleUserAddress = async (user_id) => {
  return Address.findOne({
    include: {
      model: Pincode,
      attributes: ['id', 'pincode'],
      include: {
        model: City,
        attributes: ['name'],
        include: {
          model: State,
          attributes: ['name'],
          include: {
            model: Country,
            attributes: ['code'],
          },
        },
      },
    },
    where: { addressable_id: user_id, addressable_type: USER_ADMIN },
    attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
    raw: true,
    nest: true,
  });
};

const findUserAddress = async (user_id) => {
  return User.findAll({
    include: {
      model: Address,
      include: {
        model: Pincode,
        attributes: ['pincode'],
        include: {
          model: City,
          attributes: ['name'],
          include: {
            model: State,
            attributes: ['name'],
            include: {
              model: Country,
              attributes: ['code'],
            },
          },
        },
      },
      where: { addressable_id: user_id, addressable_type: USER },
      attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
    },
    attributes: ['id', 'name', 'email', 'mobile'],
    nest: true,
  });
};

const findPatientAddress = async (patientExists) => {
  return Patient.findAll({
    include: {
      model: Address,
      include: {
        model: Pincode,
        attributes: ['pincode'],
        include: {
          model: City,
          attributes: ['name'],
          include: {
            model: State,
            attributes: ['name'],
            include: {
              model: Country,
              attributes: ['code'],
            },
          },
        },
      },
      where: { addressable_id: patientExists, addressable_type: 'patient' },
      attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
    },
    attributes: ['id', 'name'],
    nest: true,
  });
};

const createAddress = async (result, addressable_id, addressable_type) => {
  return Address.create({
    address_line_1: result.address_line_1,
    address_line_2: result.address_line_2,
    landmark: result.landmark,
    pincode_id: result.pincode_id,
    addressable_id: addressable_id,
    addressable_type: addressable_type,
  });
};

const findAddress = async (result) => {
  return Address.findOne({
    where: {
      address_line_1: result.address_line_1 || null,
      address_line_2: result.address_line_2 || null,
      landmark: result.landmark || null,
      pincode_id: result.pincode_id || null,
      addressable_id: result.addressable_id,
      addressable_type: result.addressable_type,
    },
  });
};

const deleteUserAddress = async (address_id, id, addressable_type) => {
  return Address.destroy({
    where: {
      addressable_id: id,
      id: address_id,
      addressable_type: addressable_type,
    },
  });
};

const editUserAddress = async (address_id, id, addressable_type) => {
  return Address.findOne({
    where: {
      id: address_id,
      addressable_id: id,
      addressable_type: addressable_type,
    },
  });
};

const updateUserAddress = async (result, id, address_id, addressable_type) => {
  return Address.update(
    {
      address_line_1: result.address_line_1,
      address_line_2: result.address_line_2,
      landmark: result.landmark,
      pincode_id: result.pincode_id,
    },
    {
      where: {
        addressable_id: id,
        id: address_id,
        addressable_type: addressable_type,
      },
    }
  );
};

const getAddressData = async (id, addressable_type) => {
  return Address.findAll({
    include: {
      model: Pincode,
      attributes: ['id', 'pincode'],
      include: {
        model: City,
        attributes: ['name'],
        include: {
          model: State,
          attributes: ['name'],
          include: {
            model: Country,
            attributes: ['code'],
          },
        },
      },
    },
    where: {
      addressable_id: id,
      addressable_type: addressable_type,
    },
    attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
  });
};

const findAddressById = async (id) => {
  return Address.findOne({
    where: { id: id },
    raw: true,
  });
};

const updateAddress = async (result, id) => {
  await Address.update(
    {
      address_line_1: result.address_line_1,
      address_line_2: result.address_line_2,
      landmark: result.landmark,
      pincode_id: result.pincode_id,
    },
    {
      where: {
        id: id,
      },
    }
  );
};

const deleteAddressDao = async (id) => {
  return Address.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  findUserAddress,
  createAddress,
  findAddress,
  deleteUserAddress,
  updateUserAddress,
  findPatientAddress,
  findSingleUserAddress,
  editUserAddress,
  getAddressData,
  updateAddress,
  findAddressById,
  deleteAddressDao,
};
