const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Address = require('../models/address');
const Brand = require('../models/brand');
const Order = require('../models/order');
const Product = require('../models/product');
const Trim = require('../models/trim');
const User = require('../models/user');
const Pincode = require('../models/pincode');
const City = require('../models/city');
const State = require('../models/state');
const Country = require('../models/country');
const Category = require('../models/category');
const Address_History = require('../models/address_history');
const Patient = require('../models/patient');
const Order_Details = require('../models/order_detail');
const Order_History = require('../models/order_history');
const {
  STATUS,
  PENDING,
  PAID,
  product,
  BRAND,
  MODEL,
  USER,
} = require('../utils/constant');
const Model_Type = require('../models/model_type');
const Aligner_Type = require('../models/aligner_type');
const Config = require('../models/config');
const Patient_Attachment = require('../models/patient_attachment');
const Invoice = require('../models/invoices');
const Add_On = require('../models/add_on');
const { getUserPricingByProductableId } = require('./user.dao');
const Order_Add_On = require('../models/order_add_on');

Order.belongsTo(Trim, { foreignKey: 'trim_id' });
Trim.hasMany(Order, { foreignKey: 'trim_id' });

User.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(User, { foreignKey: 'customer_id' });

Patient.hasMany(Order, { foreignKey: 'patient_id' });
Order.belongsTo(Patient, { foreignKey: 'patient_id' });

Product.hasMany(Order, { foreignKey: 'product_id' });
Order.belongsTo(Product, { foreignKey: 'product_id' });

Address_History.hasMany(Order, { foreignKey: 'address_id' });
Order.belongsTo(Address_History, { foreignKey: 'address_id' });

Order.hasMany(Order_History, { foreignKey: 'order_id' });
Order_History.belongsTo(Order, { foreignKey: 'order_id' });

Order.hasMany(Order_Details, { foreignKey: 'order_id' });
Order_Details.belongsTo(Order, { foreignKey: 'order_id' });

Pincode.hasMany(Address_History, { foreignKey: 'pincode_id' });
Address_History.belongsTo(Pincode, { foreignKey: 'pincode_id' });

Order_Details.belongsTo(Brand, { foreignKey: 'brand_id' });
Brand.hasMany(Order_Details, { foreignKey: 'brand_id' });

Order_Details.belongsTo(Model_Type, { foreignKey: 'model_type_id' });
Model_Type.hasMany(Order_Details, { foreignKey: 'model_type_id' });

Order_Details.belongsTo(Aligner_Type, { foreignKey: 'aligner_type_id' });
Aligner_Type.hasMany(Order_Details, { foreignKey: 'aligner_type_id' });

Patient.hasMany(Patient_Attachment, { foreignKey: 'patient_id' });
Patient_Attachment.belongsTo(Patient, { foreignKey: 'patient_id' });

Order.hasOne(Invoice, { foreignKey: 'order_id' });
Invoice.belongsTo(Order, { foreignKey: 'order_id' });

Order.hasMany(Order_Add_On, { foreignKey: 'order_id' });
Order_Add_On.belongsTo(Order, { foreignKey: 'order_id' });

Order_Add_On.belongsTo(Add_On, { foreignKey: 'add_on_id' });
Add_On.hasMany(Order_Add_On, { foreignKey: 'add_on_id' });

const getAllOrderOfPatient = async (patient_id, page, size) => {
  return Order.findAndCountAll({
    where: { patient_id: patient_id },
    attributes: ['id', 'ordered_on', 'delivered_on', 'total_amount'],
    limit: size,
    offset: page * size,
    order: [['id', 'DESC']],
  });
};

const totalOrdersOfPatient = async (patient_id) => {
  return Order.count({
    where: { patient_id: patient_id },
  });
};

const getAllOrderOfAdmin = async (page, size, term) => {
  let user = { [Op.ne]: null };

  return Order.findAndCountAll({
    include: [
      {
        model: Patient,
        attributes: ['id', 'name', 'mobile'],
      },
      {
        model: User,
        where: {
          name: { [Op.like]: '%' + term + '%' },
        },
        attributes: ['id', 'name', 'email', 'mobile', 'payment_method'],
      },
    ],
    where: { customer_id: user },
    attributes: ['id', 'ordered_on', 'delivered_on', 'total_amount', 'status'],
    limit: size,
    offset: page * size,
    order: [['id', 'DESC']],
  });
};

const totalOrdersOfAdmin = async () => {
  let user = { [Op.ne]: null };
  return Order.count({
    where: { customer_id: user },
  });
};

const getAllOrderOfUser = async (user_id, page, size, term) => {
  return Order.findAndCountAll({
    include: [
      {
        model: Patient,
        where: {
          name: { [Op.like]: '%' + term + '%' },
        },
        attributes: ['id', 'name', 'mobile'],
      },
    ],
    where: { customer_id: user_id },
    attributes: ['id', 'ordered_on', 'delivered_on', 'total_amount', 'status'],
    limit: size,
    offset: page * size,
    order: [['id', 'DESC']],
  });
};

const totalOrdersOfUser = async (user_id) => {
  return Order.count({
    where: { customer_id: user_id },
  });
};

// get all orders of user in detail
const getUserOrdersInDetail = async (order_id) => {
  return Order.findOne({
    include: [
      {
        model: Product,
        include: {
          model: Category,
          attributes: ['id', 'category_name'],
          paranoid: false,
        },
        attributes: ['id', 'name', 'amount'],
        paranoid: false,
      },
      {
        model: Trim,
        attributes: ['id', 'name'],
        paranoid: false,
      },
      {
        model: Order_History,
        attributes: ['id', 'status', 'createdAt'],
      },
      {
        model: Address_History,
        include: {
          model: Pincode,
          attributes: ['id', 'pincode'],
          include: {
            model: City,
            attributes: ['id', 'name'],
            include: {
              model: State,
              attributes: ['id', 'name'],
              include: {
                model: Country,
                attributes: ['id', 'code', 'name'],
              },
            },
          },
        },
        attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
      },
      {
        model: Patient,
        attributes: ['id', 'name', 'mobile'],
      },
      {
        model: User,
        attributes: ['id', 'name', 'email', 'mobile'],
      },
      {
        model: Order_Details,
        include: [
          {
            model: Brand,
            attributes: ['id', 'name'],
            paranoid: false,
          },
          {
            model: Aligner_Type,
            attributes: ['id', 'name'],
            paranoid: false,
          },
          {
            model: Model_Type,
            attributes: ['id', 'name'],
            paranoid: false,
          },
        ],
        attributes: [
          'id',
          'min',
          'max',
          'prefix',
          'brand_id',
          'aligner_type_id',
          'model_type_id',
        ],
      },
    ],
    where: { id: order_id },
    attributes: [
      'id',
      'quantity',
      'amount',
      'shipping_cost',
      'tax',
      'total_amount',
      'ordered_on',
      'delivered_on',
      'instructions',
      'stl_attachment',
      'file_attachment',
      'invoice_url',
    ],
    paranoid: false,
  });
};

const findAddressInHistory = async (
  address_line_1,
  address_line_2,
  landmark,
  pincode_id
) => {
  return Address_History.findOne({
    where: {
      address_line_1: address_line_1,
      address_line_2: address_line_2,
      landmark: landmark,
      pincode_id: pincode_id,
    },
  });
};

const addOrderStatus = async (order_id, status) => {
  return Order_History.create({
    status: status,
    order_id: order_id,
  });
};

const createOrderFor3DModel = async (orderObject, order_id, user_id) => {
  for (const order_detail of orderObject.order_details) {
    let productPrice = await getUserPricingByProductableId(
      user_id,
      order_detail.model_type_id,
      MODEL
    );

    await Order_Details.create({
      min: order_detail.min,
      max: order_detail.max,
      prefix: order_detail.prefix,
      model_type_id: order_detail.model_type_id,
      order_id: order_id,
      price: productPrice.price,
    });
  }
};

const createOrderForClearAligner = async (orderObject, order_id, user_id) => {
  for (const order_detail of orderObject.order_details) {
    let productPrice = await getUserPricingByProductableId(
      user_id,
      order_detail.brand_id,
      BRAND
    );

    await Order_Details.create({
      min: order_detail.min,
      max: order_detail.max,
      prefix: order_detail.prefix,
      brand_id: order_detail.brand_id,
      aligner_type_id: order_detail.aligner_type_id,
      order_id: order_id,
      price: productPrice.price,
    });
  }
};

const createOrder = async (orderObject) => {
  let address;

  if (orderObject.ship_to_clinic === true) {
    address = await Address.findOne({
      where: {
        addressable_id: orderObject.customer_id,
        addressable_type: USER,
      },
    });
  } else {
    address = await Address.findOne({
      where: { id: orderObject.address_id },
    });
  }

  const addressExists = await findAddressInHistory(
    address.address_line_1,
    address.address_line_2,
    address.landmark,
    address.pincode_id
  );

  let add_address_to_address_history = addressExists;

  if (!addressExists) {
    add_address_to_address_history = await Address_History.create({
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      landmark: address.landmark,
      pincode_id: address.pincode_id,
    });
  }

  const orderCreated = await Order.create({
    product_id: orderObject.product_id,
    quantity: orderObject.quantity,
    amount: orderObject.amount,
    shipping_cost: orderObject.shipping_cost,
    tax: orderObject.tax,
    total_amount: orderObject.total_amount,
    customer_id: orderObject.customer_id,
    ordered_on: Date.now(),
    address_id: add_address_to_address_history.id,
    patient_id: orderObject.patient_id,
    trim_id: orderObject.trim_id,
    instructions: orderObject.instructions,
    status: STATUS[0],
    stl_attachment: orderObject.stl_attachment,
    file_attachment:
      orderObject.file_attachment === null
        ? null
        : orderObject.file_attachment.trim(),
  });

  await addOrderStatus(orderCreated.id, STATUS[0]);

  if (orderObject.product_id === product.Model) {
    // create order for 3D model
    await createOrderFor3DModel(
      orderObject,
      orderCreated.id,
      orderObject.customer_id
    );
  } else {
    // create order for Clear Aligner
    await createOrderForClearAligner(
      orderObject,
      orderCreated.id,
      orderObject.customer_id
    );
  }

  return orderCreated;
};

const uploadAttachmentUrl = async (filename, order_id) => {
  return OrderAttachment.create({
    attachment_url: filename,
    order_id: order_id,
  });
};

const updateDeliveredDateInOrder = async (order_id) => {
  await Order.update({ delivered_on: Date.now() }, { where: { id: order_id } });
};

const orderStatusInHistory = async (order_id) => {
  const orderStatus = await Order_History.findOne({
    where: { order_id: order_id },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'status'],
    raw: true,
  });

  return orderStatus.status === STATUS[3] || orderStatus.status === STATUS[4]
    ? false
    : true;
};

const orderCurrentStatus = async (order_id) => {
  return Order_History.findOne({
    where: { order_id: order_id },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'status', 'createdAt'],
    raw: true,
  });
};

const updateOrderAddress = async (order_id, address_id) => {
  const address = await Address.findOne({
    where: { id: address_id },
    raw: true,
  });

  const addressExists = await findAddressInHistory(
    address.address_line_1,
    address.address_line_2,
    address.landmark,
    address.pincode_id
  );

  let add_address_to_address_history = addressExists;

  if (!addressExists) {
    add_address_to_address_history = await Address_History.create({
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      landmark: address.landmark,
      pincode_id: address.pincode_id,
    });
  }

  await Order.update(
    {
      address_id: add_address_to_address_history.id,
    },
    {
      where: { id: order_id },
    }
  );
};

const editOrderAddress = async (order_id, addressData, userId) => {
  const orderExist = await Order.findOne({
    where: { id: order_id, customer_id: userId },
    attributes: ['id', 'address_id'],
    raw: true,
  });

  if (orderExist) {
    const checkOrderStatus = await Order_History.findOne({
      where: { order_id: order_id },
      raw: true,
    });

    if (checkOrderStatus.status !== STATUS[3]) {
      if (
        checkOrderStatus.status === STATUS[0] ||
        checkOrderStatus.status === STATUS[1] ||
        checkOrderStatus.status === STATUS[2]
      ) {
        await Address_History.update(
          {
            address_line_1: addressData.address_line_1 || null,
            address_line_2: addressData.address_line_2 || null,
            landmark: addressData.landmark || null,
            pincode_id: addressData.pincode_id,
          },
          { where: { id: orderExist.address_id } }
        );
      }
    }
  }

  return orderExist;
};

const findProductTypeById = async (product_id) => {
  return Product.findOne({
    where: { id: product_id },
    attributes: ['id', 'name', 'category_id'],
    raw: true,
  });
};

const orderExists = async (order_id) => {
  return Order.findOne({
    where: { id: order_id },
    attributes: ['id', 'status', 'customer_id'],
    raw: true,
  });
};

const updateOrderHistory = async (order_id, nextStatus) => {
  await Order.update(
    {
      status: nextStatus,
    },
    {
      where: { id: order_id },
    }
  );

  return Order_History.create({
    order_id: order_id,
    status: nextStatus,
  });
};

const addConfigData = async (configData) => {
  return Config.create({
    key: configData.type,
    value: configData.price,
  });
};

const findConfig = async (key) => {
  return Config.findOne({
    where: { key: key },
    attributes: ['id'],
    raw: true,
  });
};

const findConfigById = async (id) => {
  return Config.findOne({
    where: { id: id },
    attributes: ['id', 'key', 'value'],
    raw: true,
  });
};

const updateConfigData = async (id, configData) => {
  await Config.update(
    { value: configData.price, key: configData.type },
    { where: { id: id } }
  );
};

const deleteConfigData = async (id) => {
  await Config.destroy({ where: { id: id } });
};

const totalOrderOFUser = async (id) => {
  return Order.count({
    where: { customer_id: id },
  });
};

const totalPendingOrderOfUser = async (id) => {
  return Order.count({
    where: { customer_id: id, delivered_on: null },
  });
};

const totalPendingOrderOfUserList = async (id, page, size, term) => {
  let total = await Order.findAndCountAll({
    include: [
      {
        model: Patient,
        where: {
          name: { [Op.like]: '%' + term + '%' },
        },
        attributes: ['id', 'name', 'mobile'],
      },
    ],
    where: { customer_id: id, delivered_on: null },
    attributes: ['id', 'ordered_on', 'delivered_on', 'total_amount'],
    limit: size,
    offset: page * size,
    order: [['id', 'DESC']],
  });

  total = JSON.parse(JSON.stringify(total));

  return total;
};

const totalPendingOrdersForAdmin = async (id, term) => {
  return Order.count({
    include: [
      {
        model: Patient,
        where: {
          name: { [Op.like]: '%' + term + '%' },
        },
        attributes: ['id', 'name', 'mobile'],
      },
    ],
    where: {
      customer_id: id,
      delivered_on: null,
    },
  });
};

const totalOrders = async () => {
  return Order.count();
};

const totalOrderPlaced = async () => {
  const uniqueOrderStatus = await Order.findAndCountAll({
    group: ['status'],
    attributes: ['status'],
    raw: true,
  });

  return uniqueOrderStatus.count;
};

const findMonthWiseOrders = async (year) => {
  return Order.count({
    where: Sequelize.where(
      Sequelize.fn('YEAR', Sequelize.col('createdAt')),
      year
    ),
    group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
    raw: true,
  });
};

const getDataForAllOrders = async () => {
  let orders = await Order.findAndCountAll({
    include: [
      {
        model: Product,
        include: {
          model: Category,
          attributes: ['id', 'category_name'],
          paranoid: false,
        },
        attributes: ['id', 'name', 'amount'],
        paranoid: false,
      },
      {
        model: Trim,
        attributes: ['id', 'name'],
        paranoid: false,
      },
      {
        model: Order_History,
        attributes: ['id', 'status', 'createdAt'],
      },
      {
        model: Address_History,
        include: {
          model: Pincode,
          attributes: ['id', 'pincode'],
          include: {
            model: City,
            attributes: ['id', 'name'],
            include: {
              model: State,
              attributes: ['id', 'name'],
              include: {
                model: Country,
                attributes: ['id', 'code', 'name'],
              },
            },
          },
        },
        attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
      },
      {
        model: Patient,
        attributes: ['id', 'name', 'mobile'],
      },
      {
        model: User,
        attributes: ['id', 'name', 'email', 'mobile'],
      },
      {
        model: Order_Details,
        include: [
          {
            model: Brand,
            attributes: ['id', 'name'],
            paranoid: false,
          },
          {
            model: Aligner_Type,
            attributes: ['id', 'name'],
            paranoid: false,
          },
          {
            model: Model_Type,
            attributes: ['id', 'name'],
            paranoid: false,
          },
        ],
        attributes: [
          'id',
          'min',
          'max',
          'prefix',
          'brand_id',
          'aligner_type_id',
          'model_type_id',
        ],
      },
    ],
    attributes: [
      'id',
      'amount',
      'shipping_cost',
      'tax',
      'total_amount',
      'ordered_on',
      'delivered_on',
      'instructions',
      'status',
    ],
    order: [['id', 'DESC']],
    paranoid: false,
  });

  orders = JSON.parse(JSON.stringify(orders));

  return orders;
};

const getOrderDataByUserId = async (user_id) => {
  return Order.findAndCountAll({
    where: { customer_id: user_id },
    attributes: ['id', 'quantity', 'total_amount', 'ordered_on'],
    order: [['id', 'DESC']],
    raw: true,
  });
};

const getUserEmailBasedOnOrderId = async (order_id) => {
  const data = await Order.findOne({
    where: { id: order_id },
    include: [
      {
        model: User,
        attributes: ['email'],
      },
    ],
    attributes: ['customer_id'],
  });

  return JSON.parse(JSON.stringify(data));
};

const createInvoice = async (order_id, razorpay_order_id, payment_method) => {
  return Invoice.create({
    order_id: order_id,
    razorpay_order_id: razorpay_order_id,
    payment_status: PENDING,
    payment_mode: payment_method,
  });
};

const updateInvoice = async (
  razorpay_order_id,
  razorpay_payment_id,
  payment_method
) => {
  return Invoice.update(
    {
      payment_status: PAID,
      razorpay_payment_id: razorpay_payment_id,
      payment_method: payment_method,
    },
    { where: { razorpay_order_id: razorpay_order_id } }
  );
};

const getPaymentStatusByOrderId = async (order_id) => {
  return Invoice.findOne({
    where: { order_id: order_id },
    attributes: ['id', 'order_id', 'payment_status'],
  });
};

const updateInvoiceForOffline = async (order_id, payment_method) => {
  return Invoice.update(
    {
      payment_status: PAID,
      payment_method: payment_method,
    },
    { where: { order_id: order_id } }
  );
};

const totalPaymentPendingOrdersForAdmin = async () => {
  return Invoice.count({
    where: { payment_status: PENDING },
  });
};

const totalRevenuePaidForAdmin = async () => {
  let total = await Order.findAll({
    include: [
      {
        model: Invoice,
        where: {
          payment_status: PAID,
        },
        attributes: [],
      },
    ],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('total_amount')), 'paid_revenue'],
    ],
  });

  total = JSON.parse(JSON.stringify(total));

  return total;
};

const totalRevenuePendingForAdmin = async () => {
  let total = await Order.findAll({
    include: [
      {
        model: Invoice,
        where: {
          payment_status: PENDING,
        },
        attributes: [],
      },
    ],
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('total_amount')), 'pending_revenue'],
    ],
  });

  total = JSON.parse(JSON.stringify(total));

  return total;
};

const getOrderInvoiceData = async (order_id) => {
  let orderData = await Order.findOne({
    include: [
      {
        model: Address_History,
        include: {
          model: Pincode,
          attributes: ['id', 'pincode'],
          include: {
            model: City,
            attributes: ['id', 'name'],
            include: {
              model: State,
              attributes: ['id', 'name'],
            },
          },
        },
        attributes: ['id', 'address_line_1', 'address_line_2', 'landmark'],
      },
      {
        model: Patient,
        attributes: ['id', 'name'],
      },
      {
        model: User,
        attributes: ['id', 'name'],
      },
      {
        model: Invoice,
        attributes: [
          'payment_status',
          'payment_mode',
          'razorpay_payment_id',
          'razorpay_order_id',
          'message',
          'payment_method',
        ],
      },
      {
        model: Order_Details,
        include: [
          {
            model: Brand,
            attributes: ['id', 'name'],
            paranoid: false,
          },
          {
            model: Aligner_Type,
            attributes: ['id', 'name'],
            paranoid: false,
          },
          {
            model: Model_Type,
            attributes: ['id', 'name'],
            paranoid: false,
          },
        ],
        attributes: [
          'id',
          'min',
          'max',
          'prefix',
          'brand_id',
          'aligner_type_id',
          'model_type_id',
          'price',
        ],
      },
      {
        model: Order_Add_On,
        include: [
          {
            model: Add_On,
            attributes: ['id', 'name', 'price'],
            paranoid: false,
          },
        ],
        attributes: ['id'],
        paranoid: false,
      },
    ],
    where: { id: order_id },
    attributes: [
      'id',
      'quantity',
      'amount',
      'shipping_cost',
      'tax',
      'total_amount',
      'ordered_on',
      'delivered_on',
      'instructions',
    ],
    paranoid: false,
  });

  orderData = JSON.parse(JSON.stringify(orderData));

  return orderData;
};

const saveAddOns = async (order_id, addOns) => {
  for (const addOn of addOns) {
    await Order_Add_On.create({
      order_id: order_id,
      add_on_id: addOn,
    });
  }
};

const getAddOns = async (order_id) => {
  return Order_Add_On.findAll({
    where: { order_id: order_id },
    attributes: ['id', 'order_id', 'add_on_id'],
    raw: true,
  });
};

const addInvoiceUrl = async (order_id, url) => {
  return Order.update(
    {
      invoice_url: url,
    },
    { where: { id: order_id } }
  );
};

const getInvoiceUrl = async (order_id) => {
  return Order.findOne({
    where: { id: order_id },
    attributes: ['invoice_url'],
  });
};

module.exports = {
  createOrder,
  uploadAttachmentUrl,
  updateOrderAddress,
  findProductTypeById,
  getUserOrdersInDetail,
  getAllOrderOfUser,
  getAllOrderOfAdmin,
  getAllOrderOfPatient,
  editOrderAddress,
  orderStatusInHistory,
  orderExists,
  updateOrderHistory,
  updateDeliveredDateInOrder,
  orderCurrentStatus,
  addConfigData,
  totalOrderOFUser,
  totalPendingOrderOfUser,
  totalOrders,
  totalOrderPlaced,
  findMonthWiseOrders,
  getDataForAllOrders,
  getOrderDataByUserId,
  getUserEmailBasedOnOrderId,
  totalPendingOrderOfUserList,
  totalOrdersOfAdmin,
  totalOrdersOfUser,
  totalOrdersOfPatient,
  totalPendingOrdersForAdmin,
  createInvoice,
  updateInvoice,
  findConfig,
  findConfigById,
  updateConfigData,
  deleteConfigData,
  getPaymentStatusByOrderId,
  updateInvoiceForOffline,
  totalPaymentPendingOrdersForAdmin,
  totalRevenuePaidForAdmin,
  totalRevenuePendingForAdmin,
  getOrderInvoiceData,
  saveAddOns,
  getAddOns,
  addInvoiceUrl,
  getInvoiceUrl,
};
