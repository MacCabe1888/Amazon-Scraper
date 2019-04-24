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

const connection = process.env.MONGODB_URI || "mongodb://localhost/amazon_db";
mongoose.connect(connection, { useNewUrlParser: true });

app.get("/scrape", (req, res) => {
  axios.get("https://www.amazon.com/gp/new-releases/books/").then(async response => {
    const $ = cheerio.load(response.data);

    await db.Book.remove({});

    $(".zg-item-immersion").each(async (i, element) => {
      const book = {};

      book.rank = $(element).find(".zg-badge-text").text().split("#")[1];
      book.title = $(element).find("img").attr("alt");
      book.imgLink = $(element).find("img").attr("src");
      book.author = $(element).find(".a-link-child").text() || $(element).find("span.a-color-base").text();
      book.rating = $(element).find(".a-icon-alt").text() || "Not Yet Rated";
      book.version = $(element).find(".a-color-secondary").text();
      book.price = $(element).find(".p13n-sc-price").text();
      book.releaseDate = $(element).find(".zg-release-date").text();

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
    const books = await db.Book.find().sort({ rank: 1 });
    res.json(books);
  } catch(e) {
    res.json(e);
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await db.Book.findOne({
      _id: req.params.id
    }).populate("notes");
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
      $push: { notes: note._id }
    }, {
      new: true
    });
    res.json(note);
  } catch(e) {
    res.json(e);
  }
});

app.listen(PORT, function() {
  console.log(`App running on port ${PORT}`);
});
