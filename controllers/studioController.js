const Game = require("../models/game");
const Studio = require("../models/studio")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// GET all studios 
exports.studios_list_get = asyncHandler(async (req, res, next) => {
  const studios = await Studio.find()
  .sort({name: 1})
  .exec();

  res.render("studios", {
    studios
  })
})


// GET studio details on /studios/id
exports.studio_details_get =  asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id)
  .exec()
  .catch(() => {
    const err = new Error("Studio not found");
    err.status = 404;
    return next(err);
  });

  if (studio === null) {
    // No results.
    const err = new Error("Studio not found");
    err.status = 404;
    return next(err);
  }

  const games = await Game.find({studio: studio._id});

  res.render("studio_details", {
    studio, games
  })
})