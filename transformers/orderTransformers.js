const { orderStatus } = require('../utils/constant');
const moment = require('moment');

const transformOrderForStatus = (order) => {
  if (order) {
    const orderStatusArr = order.dataValues?.orders_histories;

    const last_status =
      order.dataValues?.orders_histories[orderStatusArr.length - 1];

    // set last order_status for orderStatusArr
    order.dataValues.orders_histories = last_status;

    // set proper id for each status
    const status = order.dataValues?.orders_histories.dataValues?.status;
    order.dataValues.orders_histories.dataValues.id = orderStatus[status]?.id;

    //NOTE: only we need to send order_status and order_status[len-1] is it's current status
    order.dataValues.order_status = setIdForOrderStatus(orderStatusArr);
  }

  return order;
};

const setIdForOrderStatus = (orderStatusList) => {
  let order_status = [];

  for (let status of orderStatusList) {
    const status_name = status.dataValues?.status;

    order_status.push({
      id: orderStatus[status_name]?.id,
      status: status.dataValues?.status,
      createdAt: status.dataValues?.createdAt,
    });
  }

  return order_status;
};

const transformOrderList = (orders) => {
  let user_orders = [];

  for (let order of orders) {
    user_orders.push({
      order_id: order?.id,
      quantity: order?.quantity,
      amount: order?.amount,
      shipping_cost: order?.shipping_cost,
      tax: order?.tax,
      total_amount: order?.total_amount,
      ordered_on: moment(order?.ordered_on)
        .utcOffset('+05:30')
        .format('DD-MM-YYYY'),
      delivered_on: order?.delivered_on
        ? moment(order?.delivered_on).utcOffset('+05:30').format('DD-MM-YYYY')
        : null,
      instructions: order?.instructions,
      product_name: order?.product.name,
      trim_name: order?.trim ? order?.trim?.name : null,
      orders_status: order?.status,
      address_line_1: order?.address_history?.address_line_1
        ? order?.address_history?.address_line_1
        : '',
      address_line_2: order?.address_history?.address_line_2
        ? order?.address_history?.address_line_2
        : '',
      landmark: order?.address_history?.landmark
        ? order?.address_history?.landmark
        : '',
      pincode: order?.address_history?.pincode?.pincode,
      city: order?.address_history?.pincode?.city?.name,
      state: order?.address_history?.pincode?.city?.state?.name,
      patient_name: order?.patient?.name,
      patient_mobile: order?.patient?.mobile,
      user_name: order?.user?.name,
      user_email: order?.user?.email,
      user_mobile: order?.user?.mobile,
      order_details: order?.order_details,
      brand_name:
        order?.order_details[0]?.brand_id !== null
          ? order?.order_details[0]?.brand?.name
          : null,
      aligner_type_name:
        order?.order_details[0]?.aligner_type_id !== null
          ? order?.order_details[0]?.aligner_type?.name
          : null,
      model_type_name:
        order?.order_details[0]?.model_type_id !== null
          ? order?.order_details[0]?.model_type?.name
          : null,
    });
  }

  return user_orders;
};

module.exports = {
  transformOrderForStatus,
  setIdForOrderStatus,
  transformOrderList,
};
