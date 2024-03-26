const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 2 },
  description: { type: String }
});

// Virtual for book's URL
CategorySchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/categories/${this._id}`;
});

// Export model
module.exports = mongoose.model("Category", CategorySchema);
