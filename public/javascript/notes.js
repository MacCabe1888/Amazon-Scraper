const getNotes = () => $.getJSON("/notes/saved", data => {
  for (let i = 0; i < data.length; i++) {
    const note = data[i];
    const archivedNote = $(`<div id=${note._id} class="archived-note">`);
    const noteContainer = $('<div class="note-container">');
    $(noteContainer).append(`<div id=${note._id} class="delete-note"><button>X</button></div>`);
    $(noteContainer).append(`<h4><i>${note.bookTitle}</i> by ${note.bookAuthor}</h4>`);
    $(noteContainer).append(`<strong>${note.title}</strong>`);
    $(noteContainer).append(`<p>${note.body}</p>`);
    $(archivedNote).append(noteContainer);
    $("#archived-notes").append(archivedNote);
  }
});

$(document).on("click", ".delete-note", function() {
  const thisId = $(this).attr("id");
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId
  }).then(function() {
      $(`#${thisId}`).empty();
    });
});

getNotes();
