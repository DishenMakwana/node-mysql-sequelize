const transformProducts = (products) => {
  let product_list = [];

  if (products.length > 0) {
    products.forEach((product) => {
      product_list.push({
        id: product?.id,
        name: product?.name,
        amount: product?.amount,
        category: product?.category['category_name'],
      });
    });
  }

  return product_list;
};

module.exports = transformProducts;
