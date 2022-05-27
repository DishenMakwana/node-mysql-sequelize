const transformUserData = (userData) => {
  return {
    id: userData?.id,
    name: userData?.name,
    email: userData?.email,
    mobile: userData?.mobile,
    payment_method: userData?.payment_method,
  };
};

const transformUserList = (userList) => {
  let user_list = [];

  for (let user of userList) {
    let brand_pricing = [],
      model_pricing = [];

    for (let brand of user?.brand_pricing) {
      brand_pricing.push({
        name: brand?.name,
        price: brand?.price,
        custom_price: brand?.custom_price,
      });
    }

    for (let model of user?.model_pricing) {
      model_pricing.push({
        name: model?.name,
        price: model?.price,
        custom_price: model?.custom_price,
      });
    }

    user_list.push({
      user_id: user?.id,
      user_name: user?.user?.name,
      user_email: user?.user?.email,
      user_mobile: user?.user?.mobile,
      payment_method:
        user?.user?.payment_method === 1
          ? 'Pay At Checkout'
          : user?.user.payment_method === 0
          ? 'Not define'
          : 'Monthly Billing',
      gst_number: user?.user?.gst_number,
      brand_pricing: brand_pricing.length !== 0 ? brand_pricing : null,
      model_pricing: model_pricing.length !== 0 ? model_pricing : null,
    });
  }

  return user_list;
};

module.exports = { transformUserData, transformUserList };
