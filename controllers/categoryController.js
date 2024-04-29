const Category = require('../models/category');
const Game = require("../models/game");
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


// GET category details on /categories/id
exports.category_details_get =  asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)
  .exec()
  .catch(() => {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  });

  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  const games = await Game.find({category : { $in: [category._id]}})
  .populate('studio')
  .exec()
  .catch(() => {
    const err = new Error("Games not found");
    err.status = 404;
    return next(err);
  });

  res.render("category_details", {
    category, games
  })
})


// GET category details on /categories/id
exports.category_add_get =  asyncHandler(async (req, res, next) => {
  res.render("category_add_new");
});