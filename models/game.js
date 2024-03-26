const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  studio: { type: Schema.Types.ObjectId, ref: "Studio", required: true },
  release_date: { type: Date },
  summary: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  quantity: { type: Number, required: true },
  price: { type: Number },
  sale_percent: { type: Number, default: 0 }
});

// Virtual for game's URL
GameSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/games/${this._id}`;
});

// Export model
module.exports = mongoose.model("Game", GameSchema);
