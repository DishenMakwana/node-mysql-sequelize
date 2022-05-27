const STATUS = [
  'Order Placed',
  'In Manufacturing',
  'Ready for Dispatch',
  'Dispatched',
  'Delivered',
];

const product = {
  Model: 1,
  Clear_Aligner: 2,
};

const role = {
  SUPERADMIN: 1,
  ADMIN: 2,
  USER: 3,
};

const paymentMode = {
  0: 'not_define',
  1: 'pay_at_checkout',
  2: 'monthly_billing',
};

const orderStatus = {
  'Order Placed': {
    id: 0,
    name: 'Order Placed',
    next: 'In Manufacturing',
  },
  'In Manufacturing': {
    id: 1,
    name: 'In Manufacturing',
    next: 'Ready for Dispatch',
  },
  'Ready for Dispatch': {
    id: 2,
    name: 'Ready for Dispatch',
    next: 'Dispatched',
  },
  Dispatched: {
    id: 3,
    name: 'Dispatched',
    next: 'Delivered',
  },
  Delivered: {
    id: 4,
    name: 'Delivered',
  },
};

const sms_data = {
  'Order Placed': {
    text: 'has been received.',
  },
  'In Manufacturing': {
    text: 'is under manufacturing.',
  },
  'Ready for Dispatch': {
    text: 'is ready for dispatch.',
  },
  Dispatched: {
    text: 'is out for delivery.',
  },
  Delivered: {
    text: 'has been successfully delivered. Enjoy! \nFor any inquiry, you can contact +919879672499',
  },
};

const PREFIX = ['None', 'Upper', 'Lower'];

module.exports = {
  USER: 'user',
  ADMIN: 'admin',
  USER_ADMIN: 'user_admin',
  SUPERADMIN: 'superadmin',
  PATIENT: 'patient',
  CANCEL: 'cancel',
  MODEL: 'model_types',
  BRAND: 'brands',
  MODELS: 'model',
  BRANDS: 'brand',
  UPPER: 'upper',
  LOWER: 'lower',
  SHIPPING_PRICE: 'shipping_price',
  TAX: 'tax',
  MODEL_TAX: 'model_tax',
  BRAND_TAX: 'brand_tax',
  ADDON_TAX: 'addon_tax',
  PENDING: 'pending',
  PAID: 'paid',
  ONLINE: 'online',
  OFFLINE: 'offline',
  RAZORPAY: 'razorpay',
  FINANCIAL: 'financial',
  VIEW: 'view',
  STATUS,
  PREFIX,
  orderStatus,
  product,
  role,
  paymentMode,
  CUSTOM_PRICE: 1,
  DEFAULT_PRICE: 0,
  sms_data,
};
