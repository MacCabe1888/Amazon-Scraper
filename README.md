# Amazon-Scraper
A web app that allows users to scrape Amazon pages and leave comments. Built with Express, Handlebars, Mongoose, Cheerio, and Axios.

### Visit
You can visit the deployed site at the following URL: https://amazonscraper1888.herokuapp.com

### Overview
This app scrapes Amazon's top 50 new releases in books and presents them to the user as an ordered list. The user can update the book list by "rescraping," write and save notes on individual books, and access notes saved on the current list or (if overwritten by an update to the list) on a separate page of archived notes.

### Technical Approach
Amazon Scraper is built according to MVC (model-view-controller) architecture and makes use of the following technologies:
* Express
    - A Node.js-Express server handles the *controller* component of the app structure – i.e., the routes that fetch and manipulate book and note data.
* Handlebars
    - Handlebars is used as a view engine to render the *views* – i.e., the scraper page and the notes page.
* MongoDB / Mongoose
    - The Mongoose npm package is used to create the *models* of the MVC architecture. These include a Book model – which contains the book data scraped from Amazon as well as the book's associated notes written and saved in Amazon Scraper – and a Note model – which contains the title and body text of the note as well as the title and author of its associated book. 
* Cheerio & jQuery
    - The Cheerio npm package is used to efficiently load the data scraped from Amazon and to facilitate the use of jQuery to manipulate said data by mapping the HTML content from the Amazon page onto the Book model.
    - jQuery is also used to display the scraped book data and to save and display user notes.
* Axios
    - Axios is used to retrieve the initial data from the Amazon page.

### User Guide
1. Click the "scrape" button near the top of the page to update the list of scraped books.
2. Scroll down within the left-hand column to see all 50 scraped books.
3. Click the "notes" button located directly beneath a book's information to make that book's note editor and all its saved notes appear in the right-hand column of the page.
4. Type a note title and note content in their respective fields. Then click the "save note" button to save the new note and append it to the list below.
5. A saved note can still be viewed even if its associated book has been overwritten by a more recent scrape. Click the "notes" button located in the upper right-hand corner of the page to see the exhaustive list of all saved notes.
6. Click the "X" button on a note to delete it. This can be done from the notes page as well as from each book-specific list of notes on the main page.
