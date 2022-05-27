const transformAddressWithPincode = (addressData) => {
  let address = {
    id: null,
    address: null,
    pincode: null,
    city: null,
    state: null,
    pincode_id: null,
  };

  if (addressData) {
    if (addressData !== null) {
      address = {
        id: addressData?.id,
        address_line_1: addressData?.address_line_1,
        address_line_2: addressData?.address_line_2,
        landmark: addressData?.landmark,
        pincode_id: addressData?.pincode['id'],
        pincode: addressData?.pincode['pincode'],
        city: addressData?.pincode?.city['name'],
        state: addressData?.pincode?.city?.state['name'],
      };
    }
  } else {
    address = null;
  }

  return address;
};

module.exports = { transformAddressWithPincode };
