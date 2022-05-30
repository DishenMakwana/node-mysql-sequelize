const { Op } = require('sequelize');
const UserRole = require('../models/user_role');
const User = require('../models/user');
const Role = require('../models/role');
const {
  PATIENT,
  MODEL,
  BRAND,
  role,
  CUSTOM_PRICE,
  DEFAULT_PRICE,
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

const addUserWisePricing = async (user_id, userwise_pricings, custom) => {
  for (const userwise_pricing of userwise_pricings) {
    await Userwise_Pricing.create({
      user_id: user_id,
      productable_id: userwise_pricing.productable_id,
      productable_type: userwise_pricing.productable_type,
      price: userwise_pricing.price,
      custom_price: custom,
    });
  }
};

const deleteUserWise = async (user_id) => {
  await Userwise_Pricing.destroy({
    where: { user_id: user_id },
  });
};

const updateUserWisePrice = async (
  user_id,
  productable_id,
  productable_type,
  price
) => {
  await Userwise_Pricing.update(
    {
      price: price,
      custom_price: CUSTOM_PRICE,
    },
    {
      where: {
        user_id: user_id,
        productable_id: productable_id,
        productable_type: productable_type,
      },
    }
  );
};

const deleteUserWisePrice = async (
  user_id,
  productable_id,
  productable_type
) => {
  await Userwise_Pricing.destroy({
    where: {
      user_id: user_id,
      productable_id: productable_id,
      productable_type: productable_type,
    },
  });

  let defaultPrice;
  if (productable_type === MODEL) {
    defaultPrice = await findModelById(productable_id);
  } else if (productable_type === BRAND) {
    defaultPrice = await findBrandById(productable_id);
  }

  await Userwise_Pricing.create({
    user_id: user_id,
    productable_id: productable_id,
    productable_type: productable_type,
    price: defaultPrice.price,
    custom: CUSTOM_PRICE,
  });
};

const addNewBrand = async (id, brandId, price) => {
  await Userwise_Pricing.create({
    user_id: id,
    productable_id: brandId,
    productable_type: BRAND,
    price: price,
    custom_price: DEFAULT_PRICE,
  });
};

const deleteBrandModelUserWise = async (id, type) => {
  await Userwise_Pricing.destroy({
    where: {
      productable_id: id,
      productable_type: type,
    },
  });
};

const updateBrandModelPriceUserwise = async (modelId, price, type) => {
  await Userwise_Pricing.update(
    {
      price: price,
    },
    {
      where: {
        productable_id: modelId,
        productable_type: type,
        custom_price: DEFAULT_PRICE,
      },
    }
  );
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

const addNewModel = async (id, modelId, price) => {
  await Userwise_Pricing.create({
    user_id: id,
    productable_id: modelId,
    productable_type: MODEL,
    price: price,
    custom_price: DEFAULT_PRICE,
  });
};

const addRemainingUserWisePricing = async (id) => {
  const userwise_pricing = await Userwise_Pricing.findAll({
    where: { user_id: id, productable_type: MODEL },
    attributes: ['productable_id'],
    raw: true,
  });

  let model_ids = [];
  for (let i = 0; i < userwise_pricing.length; i++) {
    model_ids[i] = userwise_pricing[i].productable_id;
  }

  const models = await Model_Type.findAll({
    where: { id: { [Op.notIn]: model_ids } },
    attributes: ['id', 'price'],
    raw: true,
  });

  for (const model of models) {
    await Userwise_Pricing.create({
      user_id: id,
      productable_id: model.id,
      productable_type: MODEL,
      price: model.price,
      custom_price: DEFAULT_PRICE,
    });
  }

  const userwise_pricing_brand = await Userwise_Pricing.findAll({
    where: { user_id: id, productable_type: BRAND },
    attributes: ['productable_id'],
    raw: true,
  });

  let brand_ids = [];
  for (let i = 0; i < userwise_pricing_brand.length; i++) {
    brand_ids[i] = userwise_pricing_brand[i].productable_id;
  }

  const brands = await Brand.findAll({
    where: { id: { [Op.notIn]: brand_ids } },
    attributes: ['id', 'price'],
    raw: true,
  });

  for (const brand of brands) {
    await Userwise_Pricing.create({
      user_id: id,
      productable_id: brand.id,
      productable_type: BRAND,
      price: brand.price,
      custom_price: DEFAULT_PRICE,
    });
  }
};

const getuserpricings = async (id, type) => {
  return Userwise_Pricing.findAll({
    where: { user_id: id, productable_type: type },
    attributes: ['id', 'productable_id', 'price'],
    raw: true,
  });
};

const getcustomuserpricing = async (id) => {
  return Userwise_Pricing.findAll({
    where: { user_id: id, custom_price: CUSTOM_PRICE },
    attributes: ['productable_id', 'productable_type', 'price'],
    raw: true,
  });
};

const createPatient = async (name, mobile, id) => {
  return Patient.create({
    name: name,
    mobile: mobile,
    user_id: id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
};

const addPatientAttachments = async (id, attachment_url, patient_uuid) => {
  return Patient_Attachment.create({
    patient_id: id,
    attachment_url: attachment_url,
    patient_uuid: patient_uuid,
  });
};

const getPatientAttachmentsDao = async (id) => {
  return Patient_Attachment.findAll({
    where: { patient_id: id },
    attributes: ['id', 'attachment_url', 'patient_uuid', 'createdAt'],
    raw: true,
  });
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

const findPatientById = async (id) => {
  return Patient.findOne({
    include: [
      {
        model: Patient_Attachment,
        attributes: ['id', 'attachment_url', 'patient_uuid'],
      },
    ],
    where: { id: id },
    attributes: ['id', 'name', 'mobile', 'user_id'],
  });
};

const deletePatientById = async (id) => {
  return Patient.destroy({
    where: {
      id: id,
    },
  });
};

const blockUnblockUser = async (id, blockStatus) => {
  const registeredUsers = await User.update(
    { is_blocked: !blockStatus.is_blocked },
    { where: { id: id } }
  );

  return { registeredUsers, blockStatus: !blockStatus.is_blocked };
};

const checkIfAlreadyAdmin = async (id) => {
  const admin_already_assigned = await UserRole.findOne({
    where: { user_id: id },
    attributes: ['role_id', 'user_id'],
    raw: true,
  });

  if (admin_already_assigned.role_id === 2) {
    return 1;
  } else if (admin_already_assigned.role_id === 3) {
    return 0;
  }
};

const assignAdmin = async (id) => {
  return UserRole.create({
    role_id: role.ADMIN,
    user_id: id,
  });
};

const updateUserAprroval = async (id, method) => {
  return User.update(
    { is_approved: true, payment_method: method },
    { where: { id: id } }
  );
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

const getCityAndState = async (id) => {
  return Pincode.findOne({
    include: [
      {
        model: City,
        include: {
          model: State,
          attributes: ['id', 'name'],
        },
        attributes: ['id', 'name'],
      },
    ],
    where: { pincode: id },
    attributes: ['id', 'pincode'],
    raw: true,
    nest: true,
  });
};

const getDataBasedOnPincode = async (pincode_id) => {
  return Pincode.findAll({
    where: {
      pincode: {
        [Op.like]: `${pincode_id}%`,
      },
    },
    attributes: ['pincode'],
    raw: true,
  });
};

const findPatients = async (id, term) => {
  return Patient.findAll({
    where: {
      user_id: id,
      [Op.and]: [
        {
          name: { [Op.like]: '%' + term + '%' },
        },
      ],
    },
    attributes: ['id', 'name', 'mobile'],
    raw: true,
  });
};

const findAddressOfPatient = async (id) => {
  return Address.findOne({
    include: [
      {
        model: Pincode,
        include: {
          model: City,
          include: {
            model: State,
            attributes: ['id', 'name'],
          },
          attributes: ['id', 'name'],
        },
        attributes: ['id', 'pincode'],
      },
    ],
    where: { addressable_id: id, addressable_type: PATIENT },
    attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
  });
};

const findUserByEmailReturnId = async (email) => {
  return User.findOne({
    where: { email: email },
    attributes: ['id', 'email'],
    raw: true,
  });
};

const editPatientById = async (id, name, mobile) => {
  await Patient.update({ name: name, mobile: mobile }, { where: { id: id } });
};

const totalPatientOfUser = async (id) => {
  return Patient.count({
    where: { user_id: id },
  });
};

const totalDoctorsDao = async () => {
  return UserRole.count({
    where: { role_id: role.USER },
  });
};

const getDataForAllUsers = async () => {
  let users = await UserRole.findAndCountAll({
    include: [
      {
        model: User,
        attributes: [
          'id',
          'name',
          'email',
          'mobile',
          'payment_method',
          'gst_number',
        ],
      },
    ],
    where: { role_id: role.USER },
    attributes: ['id', 'user_id'],
    order: [['id', 'DESC']],
  });

  users = JSON.parse(JSON.stringify(users));

  return users;
};

const getUserPricings = async (id, type) => {
  return Userwise_Pricing.findAll({
    where: { user_id: id, productable_type: type, custom_price: CUSTOM_PRICE },
    attributes: ['id', 'productable_id', 'price', 'custom_price'],
    raw: true,
  });
};

const getBrandNameById = async (id) => {
  return Brand.findOne({
    where: { id: id },
    attributes: ['name'],
    raw: true,
  });
};

const getModelNameById = async (id) => {
  return Model_Type.findOne({
    where: { id: id },
    attributes: ['name'],
    raw: true,
  });
};

const getUserPricingByProductableId = async (user_id, p_id, type) => {
  return Userwise_Pricing.findOne({
    where: { user_id: user_id, productable_id: p_id, productable_type: type },
    attributes: ['id', 'productable_id', 'price'],
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
    attributes: ['id', 'name', 'email', 'mobile', 'is_blocked'],
    raw: true,
  });
};

const updateAdmin = async (id, userData, password) => {
  await User.update(
    {
      name: userData.name,
      mobile: userData.mobile,
      password: password,
    },
    { where: { id: id } }
  );
};

const getAdminById = async (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'email', 'mobile', 'is_blocked'],
    raw: true,
  });
};

const getUserPaymentMethodDao = async (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['id', 'payment_method', 'is_blocked'],
    raw: true,
  });
};

const getCustomerByIdForSMS = async (id) => {
  return User.findOne({
    where: { id: id },
    attributes: ['id', 'name', 'mobile'],
    raw: true,
  });
};

module.exports = {
  createUser,
  addUserRole,
  findUserByEmail,
  findUserById,
  assignAdmin,
  updateUserAprroval,
  checkIfAlreadyAdmin,
  findPatientById,
  createPatient,
  findRoleByUserId,
  allUsers,
  getUser,
  findRoleById,
  getCityAndState,
  findPatients,
  getDataBasedOnPincode,
  findAddressOfPatient,
  deletePatientById,
  findUserByEmailReturnId,
  editPatientById,
  addUserWisePricing,
  addRemainingUserWisePricing,
  getAllUsersId,
  addNewBrand,
  addNewModel,
  updateBrandModelPriceUserwise,
  deleteBrandModelUserWise,
  getuserpricings,
  getcustomuserpricing,
  updateUserWisePrice,
  deleteUserWisePrice,
  deleteUserWise,
  blockUnblockUser,
  updateUser,
  totalPatientOfUser,
  totalDoctorsDao,
  getDataForAllUsers,
  getUserPricings,
  getBrandNameById,
  getModelNameById,
  addPatientAttachments,
  getPatientAttachmentsDao,
  getUserPricingByProductableId,
  findUserPermissions,
  getAllAdmins,
  updateAdmin,
  getAdminById,
  getUserPaymentMethodDao,
  getCustomerByIdForSMS,
};
