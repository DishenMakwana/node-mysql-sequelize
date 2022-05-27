const transformSubProducts = (subProducts) => {
  let sub_product_list = [];

  if (subProducts.length > 0) {
    subProducts.forEach((product) => {
      sub_product_list.push({
        id: product?.id,
        name: product?.name,
        product_id: product?.product_id,
        product_name: product?.product?.name,
      });
    });
  }

  return sub_product_list;
};

module.exports = transformSubProducts;
