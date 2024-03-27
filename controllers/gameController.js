const Game = require("../models/game");
const Studio = require("../models/studio")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// GET all games on /games
exports.games =  asyncHandler(async (req, res, next) => {
  const games = await Game.find({}, "title studio img_path")
  .sort({title: 1})
  .populate("studio")
  .populate("category")
  .exec();

  res.render("games", {
    title: "Games Collection",
    games: games
  })
})