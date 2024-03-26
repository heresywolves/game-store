const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudioSchema = new Schema({
  name: { type: String, required: true, minLength: 2 },
  about: { type: String },
});

// Virtual for book's URL
StudioSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/studios/${this._id}`;
});

// Export model
module.exports = mongoose.model("Studio", StudioSchema);

