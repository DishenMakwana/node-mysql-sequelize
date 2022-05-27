const { Joi } = require('express-validation');

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: false },
    }),
    password: Joi.string(),
  }),
};

const registrationValidation = {
  body: Joi.object({
    name: Joi.required(),
    email: Joi.string()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  }),
};

const editUserPricingValidation = Joi.object().keys({
  user_id: Joi.number().required(),
  productable_id: Joi.number().required(),
  productable_type: Joi.string().required(),
  price: Joi.number().required(),
});

let userwisePricingValidation = Joi.object().keys({
  productable_id: Joi.number().required(),
  productable_type: Joi.string().required(),
  price: Joi.number().required(),
});

const createUserValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: false } }),
    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address_line_1: Joi.string(),
    address_line_2: Joi.string(),
    landmark: Joi.string(),
    pincode_id: Joi.number().required(),
    payment: Joi.number().required(),
    gst_number: Joi.string().pattern(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    ),
    userwise_pricing: Joi.boolean().required(),
    userwise_pricings: Joi.alternatives().conditional('userwise_pricing', {
      is: true,
      then: Joi.array().items(userwisePricingValidation),
    }),
  }),
};

const patientValidation = {
  body: Joi.object({
    name: Joi.required(),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address_line_1: Joi.string(),
    address_line_2: Joi.string(),
    landmark: Joi.string(),
    pincode_id: Joi.number().required(),
    attachment: Joi.string(),
    patient_uuid: Joi.string(),
  }),
};

const patientEditValidation = {
  body: Joi.object({
    name: Joi.required(),
    mobile: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    attachment: Joi.string(),
    patient_uuid: Joi.string(),
  }),
};

const addressValidation = {
  body: Joi.object({
    address_line_1: Joi.string(),
    address_line_2: Joi.string(),
    landmark: Joi.string(),
    pincode_id: Joi.number().required(),
    addressable_id: Joi.number().required(),
    addressable_type: Joi.string().required(),
  }),
};

const addressValidations = {
  body: Joi.object({
    address_line_1: Joi.string(),
    address_line_2: Joi.string(),
    landmark: Joi.string(),
    pincode_id: Joi.number().required(),
  }),
};

const addressTypeValidation = {
  params: Joi.object({
    id: Joi.number(),
    addressable_type: Joi.string(),
  }),
};

const updateAddressValidation = {
  params: Joi.object({
    id: Joi.number().required(),
    add_id: Joi.number().required(),
  }),
};

const productValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().required(),
  }),
};

const subproductValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    product_id: Joi.number().required(),
  }),
};

let brandOrderDetailsValidation = Joi.object().keys({
  min: Joi.number().required(),
  max: Joi.number().required(),
  prefix: Joi.string().required(),
  brand_id: Joi.number().required(),
  aligner_type_id: Joi.number().required(),
  // foil_thickness: Joi.number(),
});

let modelOrderDetailsValidation = Joi.object().keys({
  min: Joi.number().required(),
  max: Joi.number().required(),
  prefix: Joi.string().required(),
  model_type_id: Joi.number().required(),
});

const orderValidation = {
  body: Joi.object({
    product_id: Joi.number().required(),
    quantity: Joi.number().required(),
    amount: Joi.number().required(),
    shipping_cost: Joi.number().required(),
    tax: Joi.number().required(),
    total_amount: Joi.number().required(),
    customer_id: Joi.number().required(),
    patient_id: Joi.number().required(),
    instructions: Joi.string(),
    stl_attachment: Joi.string(),
    file_attachment: Joi.string(),
    razorpay_order_id: Joi.string(),
    add_ons: Joi.array().items(Joi.number()),
    ship_to_clinic: Joi.boolean(),
    address_id: Joi.alternatives().conditional('ship_to_clinic', {
      is: false,
      then: Joi.number().required(),
      otherwise: Joi.allow(null),
    }),
    order_details: Joi.alternatives().conditional('product_id', {
      is: 1,
      then: Joi.array().items(modelOrderDetailsValidation),
      otherwise: Joi.array().items(brandOrderDetailsValidation),
    }),
    trim_id: Joi.alternatives().conditional('product_id', {
      is: 2,
      then: Joi.number().required(),
    }),
  }),
};

const namePriceValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const nameValidation = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

const idValidation = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
};

const pincodeValidation = {
  query: Joi.object({
    pincode: Joi.string().required(),
  }),
};

const pageSizeValidation = {
  query: Joi.object({
    size: Joi.number(),
    page: Joi.number(),
    term: Joi.string().optional().allow(''),
  }),
};

const priceValidation = {
  body: Joi.object({
    type: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

const pricingValidation = {
  body: Joi.object({
    price: Joi.number().required(),
  }),
};

const changePasswordValidation = {
  body: Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    new_password_confirmation: Joi.string().required(),
  }),
};

const mediaValidation = {
  body: Joi.object({
    type: Joi.string().required(),
    file_name: Joi.string().required(),
    patient_uuid: Joi.string(),
    order_id: Joi.number(),
  }),
};

const yearValidation = {
  params: Joi.object({
    year: Joi.number().required(),
  }),
};

const typeValidation = {
  query: Joi.object({
    type: Joi.string().required(),
  }),
};

const termValidation = {
  query: Joi.object({
    term: Joi.string().optional().allow(''),
  }),
};

module.exports = {
  loginValidation,
  registrationValidation,
  addressValidation,
  productValidation,
  orderValidation,
  patientValidation,
  createUserValidation,
  pincodeValidation,
  pageSizeValidation,
  editUserPricingValidation,
  addressValidations,
  updateAddressValidation,
  priceValidation,
  changePasswordValidation,
  mediaValidation,
  addressTypeValidation,
  yearValidation,
  pricingValidation,
  termValidation,
  idValidation,
  typeValidation,
  nameValidation,
  namePriceValidation,
  subproductValidation,
  patientEditValidation,
};
