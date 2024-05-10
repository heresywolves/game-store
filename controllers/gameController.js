const Game = require("../models/game");
const Studio = require("../models/studio")
const Category = require("../models/category")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const fs = require('fs');

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

  let date = formatDate(game.release_date.toString());

  res.render("game_details", {
    game, date
  })
})

function formatDate (date) {
  return date.split(' ').splice(1, 3).join(' ');
}

// GET game create form
exports.game_add_get =  asyncHandler(async (req, res, next) => {

  const [allCategories, allStudios] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Studio.find().sort({ name: 1 }).exec()
  ])

  res.render("game_form", {
    title: "Create new Game",
    categories: allCategories,
    studios: allStudios
  });
});

// POST game create from
exports.game_add_post = [
  // Convert the categories to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category = 
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Define sale percent if empty
  (req, res, next) => {
    if (!req.body.salePercent) {
      req.body.salePercent = 0
    }
    next();
  },

  // Validate and sanitize
  body("title", "Game title must have at least 3 characters")
  .trim()
  .isLength({min: 3})
  .escape(),
  body("studio", "Studio must not be empty")
  .trim()
  .isLength({ min: 1})
  .escape(),
  body("summary", "Summary must not be empty")
  .trim()
  .isLength({ min: 1})
  .escape(),
  body("releaseDate", "Release date must not be empty")
  .trim()
  .isLength({min: 1})
  .escape(),
  body("quantity", "Quantity must be specified")
  .isLength({min: 1})
  .isNumeric()
  .escape(),
  body("price", "Correct price must be specified")
  .isLength({min: 1})
  .isNumeric()
  .escape(),
  body("category", "At least one category should be specified")
  .isArray({min: 1})
  .escape(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const fileName = req.file ? req.file.filename : 'default.webp'

    const game = new Game({
       title: req.body.title,
       studio: req.body.studio,
       release_date: new Date(req.body.releaseDate),
       summary: req.body.summary,
       category: req.body.category,
       quantity: req.body.quantity,
       price: req.body.price,
       sale_percent: req.body.salePercent,
       img_path: '/images/' + fileName
    })

    const [allCategories, allStudios] = await Promise.all([
      Category.find().sort({ name: 1 }).exec(),
      Studio.find().sort({ name: 1 }).exec()
    ])

    if (!errors.isEmpty()) {
      res.render("game_form", {
        title: "Create new game",
        errors: errors.array(),
        categories: allCategories,
        studios: allStudios
      })
      return;
    } else {
      // Data is valid
      const gameExists = await Game.findOne({title: req.body.title}).exec();
      if (gameExists) {
        res.redirect(gameExists.url);
      } else {
        await game.save();
        res.redirect(game.url);
      }
    }
  })
]

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id).exec();

  if (game === null) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("game_delete", {
    title: "Delete game",
    game: game
  })
})

exports.game_delete_post = asyncHandler(async (req, res, next) => {
  // Remove images
  const game = await Game.findById(req.body.gameid);
  if (game) {
    await Game.findByIdAndDelete(req.body.gameid);
    fs.unlink('public' + game.img_path, (err) => {
      if (err) {
        console.log(err);
      }
    })
  }

  res.redirect("/games")
})

// GET game update form
exports.game_update_get =  asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  const [allCategories, allStudios] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Studio.find().sort({ name: 1 }).exec()
  ])

  // Mark our selected categories for the form
  for (const category of allCategories) {
    if (game.category.indexOf(category._id) > -1) {
      category.checked = 'true';
    }
  }

  if (!game) {
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  } else {
    res.render("game_form", {
      title: "Edit Game",
      categories: allCategories,
      studios: allStudios,
      game,
      formatedDate: inputDateFormat(game.release_date),
      file: req.file
    });
  }
});

function inputDateFormat(date) {
  let newDate = new Date(date);
  let month = newDate.getMonth().toString();
  if (month.length < 2) {
    month = '0' + month;
  }
  let day = newDate.getDay().toString();
  if (day.length < 2) {
    day = '0' + day;
  }
  let year = newDate.getFullYear().toString();
  return year + '-' + month + '-' + day;
}

// POST game create from
exports.game_update_post = [
  // Convert the categories to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category = 
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Define sale percent if empty
  (req, res, next) => {
    if (!req.body.salePercent) {
      req.body.salePercent = 0
    }
    next();
  },

  // Validate and sanitize
  body("title", "Game title must have at least 3 characters")
  .trim()
  .isLength({min: 3})
  .escape(),
  body("studio", "Studio must not be empty")
  .trim()
  .isLength({ min: 1})
  .escape(),
  body("summary", "Summary must not be empty")
  .trim()
  .isLength({ min: 1})
  .escape(),
  body("releaseDate", "Release date must not be empty")
  .trim()
  .isLength({min: 1})
  .escape(),
  body("quantity", "Quantity must be specified")
  .isLength({min: 1})
  .isNumeric()
  .escape(),
  body("price", "Correct price must be specified")
  .isLength({min: 1})
  .isNumeric()
  .escape(),
  body("category", "At least one category should be specified")
  .isArray({min: 1})
  .escape(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const existingGame = await Game.findById(req.params.id);

    const filePath = req.file ? '/images/' + req.file.filename : existingGame.img_path;

    const game = new Game({
      _id: req.params.id,
       title: req.body.title,
       studio: req.body.studio,
       release_date: new Date(req.body.releaseDate),
       summary: req.body.summary,
       category: req.body.category,
       quantity: req.body.quantity,
       price: req.body.price,
       sale_percent: req.body.salePercent,
       img_path: filePath,
    })

    const [allCategories, allStudios] = await Promise.all([
      Category.find().sort({ name: 1 }).exec(),
      Studio.find().sort({ name: 1 }).exec()
    ])

    if (!errors.isEmpty()) {
      res.render("game_form", {
        title: "Create new game",
        errors: errors.array(),
        categories: allCategories,
        studios: allStudios
      })
      return;
    } else {
      // Data is valid
      // Remove prev images
      // Delete only if it's not the default image
      if (existingGame && existingGame.img_path !== "public/images/default.webp") {
        fs.unlink('public' + existingGame.img_path, (err) => {
          if (err) {
            console.log(err);
          }
        })
      }
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
      res.redirect(updatedGame.url);
    }
  })
]