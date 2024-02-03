const Proguct = require('../models/Product');
const ProductsMapper = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  let products = await Proguct.find({ $text: { $search: query } })
  ctx.body = { products: products.map(ProductsMapper) };
};
