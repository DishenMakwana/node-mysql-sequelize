const { Op } = require('sequelize');
const UserRole = require('../models/user_role');
const User = require('../models/user');
const Role = require('../models/role');
const {
  role,
} = require('../utils/constant');
const Role_Permission = require('../models/role_permission');
const Permission = require('../models/permission');

User.hasOne(UserRole, { foreignKey: 'user_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });

const createUser = async (result, password) => {
  return User.create({
    name: result.name,
    mobile: result.mobile,
    email: result.email,
    password: password,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
};

const updateUser = async (id, result) => {
  await User.update(
    {
      name: result.name,
      email: result.email,
      mobile: result.mobile,
    },
    {
      where: {
        id: id,
      },
    }
  );
};

const deleteUserDao = async (id) => {
  return User.destroy({ where: { id: id } });
};

const findUserByEmail = async (email) => {
  return User.findOne({
    where: { email: email },
    attributes: ['id', 'name', 'email', 'password', 'mobile'],
    raw: true,
  });
};

const addUserRole = async (user_id) => {
  await UserRole.create({ role_id: role.USER, user_id: user_id });
};

const findUserById = async (id) => {
  return User.findOne({ where: { id: id }, raw: true });
};

const findRoleByUserId = async (id) => {
  return UserRole.findOne({
    where: { user_id: id },
    attributes: ['role_id', 'user_id'],
    raw: true,
  });
};

const findRoleById = async (id) => {
  return Role.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'slug'],
    raw: true,
  });
};

const assignAdmin = async (id) => {
  return UserRole.create({
    role_id: role.ADMIN,
    user_id: id,
  });
};

const allUsers = async (page, size, term) => {
  const userIds = await UserRole.findAll({
    where: { role_id: role.USER },
    raw: true,
  });

  let userIdList = [];
  for (let i = 0; i < userIds.length; i++) {
    userIdList[i] = userIds[i].id;
  }

  return User.findAndCountAll({
    where: {
      id: userIdList,
      [Op.and]: [
        {
          name: { [Op.like]: '%' + term + '%' },
        },
      ],
    },
    attributes: ['id', 'name', 'email', 'mobile'],
    limit: size,
    offset: page * size,
    raw: true,
  });
};

const getUser = async (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'email', 'mobile'],
    raw: true,
  });
};

const getAllUsersId = async () => {
  const userIds = await UserRole.findAll({
    where: { role_id: role.USER },
    raw: true,
  });

  let userIdList = [];
  for (let i = 0; i < userIds.length; i++) {
    userIdList[i] = userIds[i].id;
  }

  return userIdList;
};

const findUserByEmailReturnId = async (email) => {
  return User.findOne({
    where: { email: email },
    attributes: ['id', 'email'],
    raw: true,
  });
};

const findUserPermissions = async (role_id) => {
  const permissions = await Role_Permission.findAll({
    where: { role_id: role_id },
    raw: true,
  });

  return Permission.findAll({
    where: { id: permissions.map((p) => p.permission_id) },
    group: ['group', 'name'],
    attributes: ['id', 'name', 'group'],
    raw: true,
  });
};

const getAllAdmins = async () => {
  const userIds = await UserRole.findAll({
    where: { role_id: role.ADMIN },
    raw: true,
  });

  let userIdList = [];
  for (let i = 0; i < userIds.length; i++) {
    userIdList[i] = userIds[i].id;
  }

  return User.findAndCountAll({
    where: {
      id: userIdList,
    },
    attributes: ['id', 'name', 'email', 'mobile'],
    raw: true,
  });
};

const updateAdmin = async (id, userData, password) => {
  await User.update(
    {
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      password: password,
    },
    { where: { id: id } }
  );
};

const getAdminById = async (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'email', 'mobile'],
    raw: true,
  });
};

module.exports = {
  createUser,
  addUserRole,
  findUserByEmail,
  findUserById,
  assignAdmin,
  findRoleByUserId,
  allUsers,
  getUser,
  findRoleById,
  findUserByEmailReturnId,
  getAllUsersId,
  updateUser,
  findUserPermissions,
  getAllAdmins,
  updateAdmin,
  getAdminById,
  deleteUserDao,
};
