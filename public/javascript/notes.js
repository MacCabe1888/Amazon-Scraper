const getNotes = () => $.getJSON("/notes/saved", data => {
  const ol = $(`<ol id="notes-list">`);
  for (let i = 0; i < data.length; i++) {
    const note = $('<div class="archived-note">');
    const li = $(`<li id=${i + 1}>`);
    $(li).append(`<h3>${data[i].title}</h3>`);
    $(li).append(`<p>${data[i].body}</p>`);
    $(note).append(li);
    $(ol).append(note);
    $("#archived-notes").append(ol);
  }
});

getNotes();
