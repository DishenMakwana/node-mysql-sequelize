const transformUserData = (userData) => {
  return {
    id: userData?.id,
    name: userData?.name,
    email: userData?.email,
    mobile: userData?.mobile,
    payment_method: userData?.payment_method,
  };
};

module.exports = { transformUserData };
