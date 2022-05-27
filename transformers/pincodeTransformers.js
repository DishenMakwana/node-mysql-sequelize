const transformCityAndState = (data) => {
  let allData = {};

  if (!data) {
    return allData;
  }

  allData = {
    pincode_id: data?.id,
    pincode: data?.pincode,
    city_id: data?.city?.id,
    city_name: data?.city?.name,
    state_id: data?.city?.state?.id,
    state_name: data?.city?.state?.name,
  };

  return allData;
};

module.exports = { transformCityAndState };
