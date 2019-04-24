const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  rank: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  imgLink: {
    type: String,
    required: true
  },
  author: {
    type: String,
    // required: true
  },
  rating: {
    type: String,
    // required: true
  },
  version: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String,
    required: true
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
