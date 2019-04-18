const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");

const db = require("./models");

const PORT = process.env.PORT || 4470;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/amazon_db", { useNewUrlParser: true });

app.get("/scrape", (req, res) => {
  axios.get("https://www.amazon.com/gp/new-releases/books/").then(function(response) {
    const $ = cheerio.load(response.data);

    $(".zg-item-immersion").each(async (i, element) => {
      const book = await {};

      book.rank = await $(element).find(".zg-badge-text").text();
      book.title = await $(element).find("img").attr("alt");
      book.imgLink = await $(element).find("img").attr("src");
      book.author = await $(element).find(".a-link-child").text();
      book.rating = await $(element).find(".a-icon-alt").text();
      book.version = await $(element).find(".a-color-secondary").text();
      book.price = await $(element).find(".p13n-sc-price").text();
      book.releaseDate = await $(element).find(".zg-release-date").text();

      await db.Book.create(book)
        .then(dbBook => {
          console.log(dbBook);
        })
        .catch(err => {
          console.log(err);
        });
    });

    res.send("Scrape complete!");
  });
});

app.get("/books", async (req, res) => {
  try {
    const books = await db.Book.find();
    res.json(books);
  } catch(e) {
    res.json(e);
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await db.Book.findOne({
      _id: req.params.id
    }).populate("note");
    res.json(book);
  } catch(e) {
    res.json(e);
  }
});

app.post("/books/:id", async (req, res) => {
  try {
    const note = await db.Note.create(req.body);
    await note.save();
    await db.Book.findOneAndUpdate({
      _id: req.params.id
    }, {
      $push: { note: note._id }
    }, {
      new: true
    });
  } catch(e) {
    res.json(e);
  }
});

app.listen(PORT, function() {
  console.log(`App running on port ${PORT}`);
});
