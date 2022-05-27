const { getPaymentStatusByOrderId } = require('../dao/order.dao');

const transformOrderStatus = async (orderList) => {
  if (orderList.length > 0) {
    for (let order of orderList) {
      const paymentStatus = await getPaymentStatusByOrderId(order.id);
      if (paymentStatus) {
        order.dataValues.payment_status = paymentStatus?.payment_status;
      } else {
        order.dataValues.payment_status = null;
      }
    }
  }

  return orderList;
};

module.exports = { transformOrderStatus };
