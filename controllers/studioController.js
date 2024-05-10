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
    title: "Studios",
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

  const games = await Game.find({studio: studio._id})
  .populate('studio')
  .exec()
  .catch(() => {
    const err = new Error("Games not found");
    err.status = 404;
    return next(err);
  });

  res.render("studio_details", {
    studio, games
  })
})

// GET studio create form
exports.studio_add_get =  asyncHandler(async (req, res, next) => {
  res.render("studio_form", {title: "Create new Studio"});
});

// POST studio create from
exports.studio_add_post = [
  // Validate and sanitize
  body("name", "Studio name must have at least 3 characters")
  .trim()
  .isLength({min: 3})
  .escape(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const studio = new Studio({
       name: req.body.name,
       about: req.body.about ? req.body.about : ""
    })

    if (!errors.isEmpty()) {
      res.render("studio_form", {
        title: "Create new studio",
        errors: errors.array(),
      })
      return;
    } else {
      // Data is valid
      const studioExists = await Studio.findOne({name: req.body.name}).exec();
      if (studioExists) {
        res.redirect(studioExists.url);
      } else {
        await studio.save();
        res.redirect(studio.url);
      }
    }
  })
]

exports.studio_delete_get = asyncHandler(async (req, res, next) => {
  const [studio, studioGames] = await Promise.all([
    Studio.findById(req.params.id).exec(),
    Game.find({ studio: req.params.id }, "title").exec(),
  ]);

  if (studio === null) {
    const err = new Error("Studio not found");
    err.status = 404;
    return next(err);
  }

  res.render("studio_delete", {
    title: "Delete Studio",
    studio,
    studioGames
  })
})

exports.studio_delete_post = asyncHandler(async (req, res, next) => {
  const [studio, studioGames] = await Promise.all([
    Studio.findById(req.params.id).exec(),
    Game.find({ studio: req.params.id }, "title").exec(),
  ]);

  if (studioGames.length > 0) {
    res.render("studio_delete", {
      title: "Delete Studio",
      studio,
      studioGames
    });
    return;
  } else {
    await Studio.findByIdAndDelete(req.body.studioid);
    res.redirect("/studios")
  }
})

// GET studio update form
exports.studio_update_get =  asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);

  if (!studio) {
    const err = new Error("Studio not found");
    err.status = 404;
    return next(err);
  } else {
    res.render("studio_form", {
      title: "Edit Studio",
      studio
    });
  }
});

// POST studio create from
exports.studio_update_post = [
  // Validate and sanitize
  body("name", "Studio name must have at least 3 characters")
  .trim()
  .isLength({min: 3})
  .escape(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const studio = new Studio({
      _id: req.params.id,
       name: req.body.name,
       about: req.body.about ? req.body.about : ""
    })

    if (!errors.isEmpty()) {
      res.render("studio_form", {
        title: "Create new studio",
        errors: errors.array(),
      })
      return;
    } else {
      // Data is valid
      const updatedStudio = await Studio.findByIdAndUpdate(req.params.id, studio, {});
      res.redirect(updatedStudio.url);
    }
  })
]