const cards = document.querySelectorAll(".card");
const titleInput = document.querySelector("#title");
const formNote = document.querySelector("#form-note");
const formErrorAlert = document.querySelector("#error-alert");

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (
      e.target.classList[0] == "btn-delete" ||
      e.target.classList[1] == "bi-trash3-fill"
    ) {
      return;
    } else if (card.id == "add-note-card") {
      titleInput.value = "";
      formErrorAlert.classList.add("d-none");
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

formNote.addEventListener("submit", (e) => {
  if (titleInput.value) return;

  e.preventDefault();
  formErrorAlert.classList.remove("d-none");
});
