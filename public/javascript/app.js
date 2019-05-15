const getBooks = () => $.getJSON("/books", data => {
  for (let i = 0; i < data.length; i++) {
    $("#books").append(`<h4>#${data[i].rank}</h4><ul data-id="${data[i]._id}"><li>${data[i].title}</li><li>${data[i].imgLink}</li><li>${data[i].author}</li><li>${data[i].rating}</li><li>${data[i].version}</li><li>${data[i].price}</li><li>${data[i].releaseDate}</li></ul><button class="add-note" data-id="${data[i]._id}">Add a Note</button>`);
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

$(document).on("click", ".add-note", function() {
  $("#notes").empty();
  const thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/books/" + thisId
  }).then(data => {
      $("#notes").append(`<h2>${data.title}</h2>`);
      $("#notes").append('<input id="titleinput" name="title" placeholder="Title">');
      $("#notes").append('<textarea id="bodyinput" name="body" placeholder="Note"></textarea>');
      $("#notes").append(`<button data-id="${data._id}" class="save-note">Save Note</button>`);
      for (let i = 0; i < data.notes.length; i++) {
        const newNote = $(`<div id=${data.notes[i]._id} class="saved-note">`);
        const noteContainer = $('<div class="note-container">');
        $(noteContainer).append(`<button id=${data.notes[i]._id} class="delete-note">X</button>`);
        $(noteContainer).append(`<h4 class="title" name="title">${data.notes[i].title}</h4>`);
        $(noteContainer).append(`<p class="body" name="body">${data.notes[i].body}</p>`);
        $(newNote).append(noteContainer);
        $("#notes").append(newNote);
      }
    });
});

$(document).on("click", ".save-note", function() {
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
      const newNote = $(`<div id=${note._id} class="saved-note">`);
      const noteContainer = $('<div class="note-container">');
      $(noteContainer).append(`<button id=${note._id} class="delete-note">X</button>`);
      $(noteContainer).append(`<h4 class="title" name="title">${note.title}</h4>`);
      $(noteContainer).append(`<p class="body" name="body">${note.body}</p>`);
      $(newNote).append(noteContainer);
      $("#notes").append(newNote);
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".delete-note", function() {
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
