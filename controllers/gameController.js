const Game = require("../models/game");
const Studio = require("../models/studio")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// GET all games on /games
exports.games_list_get =  asyncHandler(async (req, res, next) => {
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

// GET game details on /games/id
exports.game_details_get =  asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id)
  .populate('category')
  .populate('studio')
  .exec()
  .catch(() => {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  });
 
  if (game === null) {
    // No results.
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game_details", {
    game
  })
})