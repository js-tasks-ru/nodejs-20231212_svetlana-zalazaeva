const ProductsMapper = require('../mappers/product');
const Proguct = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  let products = await Proguct.find({ subcategory: subcategory})
  ctx.body = { products: products.map(ProductsMapper) };
};

module.exports.productList = async function productList(ctx, next) {
  let products = await Proguct.find({})
  ctx.body = { products: products.map(ProductsMapper) };
};

module.exports.productById = async function productById(ctx, next) {
  let urlArr = ctx.request.url.split('/');
  const productId = urlArr[urlArr.length-1];

  if (!ObjectId.isValid(productId)) {
    return ctx.throw(400);
  }

  let product = await Proguct.findById(ObjectId(productId))
  if (!product) {
    return ctx.throw(404)
  }
  ctx.body = { product: ProductsMapper(product) };
};

