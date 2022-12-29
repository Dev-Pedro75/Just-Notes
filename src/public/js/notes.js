const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (
      e.target.classList[0] == "btn-delete" ||
      e.target.classList[1] == "bi-trash3-fill"
    ) {
      console.log("lixo");
      return;
    } else if (card.id == "add-note-card") {
      return;
    }
    /* location.href = `/note/${card.id}`; */
    location.href = `/note/${card.id}`;
  });
});

async function deleteNote(id) {
  await fetch(`/note/delete/${id}`, {
    method: "POST",
  }).then(() => {
    location.reload();
  });
}
