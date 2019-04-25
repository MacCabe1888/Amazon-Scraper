const getBooks = () => $.getJSON("/books", data => {
  for (let i = 0; i < data.length; i++) {
    $("#books").append(`<ul data-id="${data[i]._id}"><li>#${data[i].rank}</li><li>${data[i].title}</li><li>${data[i].imgLink}</li><li>${data[i].author}</li><li>${data[i].rating}</li><li>${data[i].version}</li><li>${data[i].price}</li><li>${data[i].releaseDate}</li></ul>`);
  }
});

$(document).on("click", "#scraper", () => {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(() => {
      $("#books").empty();
      getBooks();
    });
});

$(document).on("click", "ul", function() {
  $("#notes").empty();
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/books/" + thisId
  }).then(data => {
      $("#notes").append(`<h2>${data.title}</h2>`);
      $("#notes").append('<input id="titleinput" name="title">');
      $("#notes").append('<textarea id="bodyinput" name="body"></textarea>');
      $("#notes").append(`<button data-id="${data._id}" id="savenote">Save Note</button>`);
      for (let i = 0; i < data.notes.length; i++) {
        const newNote = $(`<div id=${data.notes[i]._id} class="savednote">`);
        $(newNote).append(`<button id=${data.notes[i]._id} class="deletenote">X</button>`);
        $(newNote).append(`<h4 class="title" name="title">${data.notes[i].title}</h4>`);
        $(newNote).append(`<p class="body" name="body">${data.notes[i].body}</p>`);
        $("#notes").append(newNote);
      }
    });
});

$(document).on("click", "#savenote", function() {
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/books/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(data => {
      const note = data;
      const newNote = $(`<div id=${note._id} class="savednote">`);
      $(newNote).append(`<button id=${note._id} class="deletenote">X</button>`);
      $(newNote).append(`<h4 class="title" name="title">${note.title}</h4>`);
      $(newNote).append(`<p class="body" name="body">${note.body}</p>`);
      $("#notes").append(newNote);
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".deletenote", function() {
  const thisId = $(this).attr("id");
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId
  }).then(function(response) {
      console.log(response);
      $(`#${thisId}`).empty();
    });
});

getBooks();
