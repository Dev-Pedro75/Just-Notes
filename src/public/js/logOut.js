const logoutButton = document.querySelector("#log-out-button");

logoutButton.addEventListener("click", () => {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  location.reload();
});
