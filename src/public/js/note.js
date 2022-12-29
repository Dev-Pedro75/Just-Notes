const qlEditor = document.querySelector(".ql-editor");
const title = document.querySelector("#title");
qlEditor.innerHTML = qlEditor.textContent;

let editNow = false;

let timer;

title.addEventListener("keydown", () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await fetch(`/note/edit/${location.pathname.replace("/note/", "")}`, {
      headers: { "Content-type": "application/json; charset=UTF-8" },
      method: "POST",
      body: JSON.stringify({
        title: title.value,
        description: qlEditor.innerHTML,
      }),
    });
    document.title = title.value;
    console.log("salvou");
  }, 1000);
});

quill.on("text-change", function (delta, oldDelta, source) {
  if (source == "api") {
    console.log("An API call triggered this change.");
  } else if (source == "user") {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await fetch(`/note/edit/${location.pathname.replace("/note/", "")}`, {
        headers: { "Content-type": "application/json; charset=UTF-8" },
        method: "POST",
        body: JSON.stringify({
          title: title.value,
          description: qlEditor.innerHTML,
        }),
      });
      console.log("salvou");
    }, 1000);
  }
});
