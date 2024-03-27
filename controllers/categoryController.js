const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


// GET all categories

exports.category_list_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, "name description")
  .sort({name: 1})
  .exec();

  res.render("categories", {
    title: "Categories",
    categories
  })
})