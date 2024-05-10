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


// GET category create for
exports.category_add_get =  asyncHandler(async (req, res, next) => {
  res.render("category_form", {title: "Create new Category"});
});

// POST category create from
exports.category_add_post = [
  // Validate and sanitize
  body("name", "Category name must have at least 3 characters")
  .trim()
  .isLength({min: 3})
  .escape(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
       name: req.body.name,
       description: req.body.description ? req.body.description : ""
    })

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create new Category",
        errors: errors.array(),
      })
      return;
    } else {
      // Data is valid
      const categoryExists = await Category.findOne({name: req.body.name}).exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  })
]

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, categoryGames] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: {$in: req.params.id} }, "title").exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_delete", {
    title: "Delete Category",
    category,
    categoryGames
  })
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, categoryGames] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Game.find({ category: {$in: req.params.id} }, "title").exec(),
  ]);

  if (categoryGames.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category,
      categoryGames
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/categories")
  }
})