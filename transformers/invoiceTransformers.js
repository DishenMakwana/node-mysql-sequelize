const moment = require('moment');

const transformInvoice = async (orderData) => {
  orderData.ordered_on = moment(orderData?.ordered_on)
    .utcOffset('+05:30')
    .format('DD/MM/YYYY');

  orderData.delivered_on !== null
    ? (orderData.delivered_on = moment(orderData?.delivered_on)
        .utcOffset('+05:30')
        .format('DD/MM/YYYY'))
    : (orderData.delivered_on = '-');

  orderData.invoice.payment_mode =
    orderData?.invoice?.payment_mode == 1
      ? 'Pay at Checkout'
      : 'Monthly Billing';

  let total = 0;
  for (let addons of orderData?.order_add_ons) {
    total += +addons?.add_on?.price;
  }

  orderData.addons_total = +total;

  return orderData;
};

module.exports = { transformInvoice };
