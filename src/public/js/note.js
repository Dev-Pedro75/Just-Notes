var quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["direction", { align: [] }],
      ["link", "image", "video", "formula"],
      ["clean"],
    ],
  },
  placeholder: "My note...",
});
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
    }, 2000);
  }
});

window.addEventListener("beforeunload", async () => {
  await fetch(`/note/edit/${location.pathname.replace("/note/", "")}`, {
    headers: { "Content-type": "application/json; charset=UTF-8" },
    method: "POST",
    body: JSON.stringify({
      title: title.value,
      description: qlEditor.innerHTML,
    }),
  });
});
