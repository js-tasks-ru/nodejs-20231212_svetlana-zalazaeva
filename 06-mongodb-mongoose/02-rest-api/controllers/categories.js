const Category = require('../models/Category');
const CategoryMapper = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  let categories = await Category.find({})
  ctx.body = { categories: categories.map(CategoryMapper) };
};
