const transformAddress = (userDetails) => {
  let user_address = [];

  if (userDetails[0] !== undefined) {
    let addresses = userDetails[0].addresses;

    addresses.forEach((address) => {
      user_address.push({
        id: address?.id,
        address_line_1: address?.address_line_1,
        address_line_2: address?.address_line_2,
        landmark: address?.landmark,
        pincode: address?.pincode['pincode'],
        city: address?.pincode?.city['name'],
        state: address?.pincode?.city?.state['name'],
        country: address?.pincode?.city?.state?.country['code'],
      });
    });
  }

  return user_address;
};

module.exports = transformAddress;
