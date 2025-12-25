/* dashboard.js — dashboard interactions (prefixed filename) */
document.addEventListener("DOMContentLoaded", function () {
  console.log("Dashboard loaded");
  const main = document.getElementById("dashboardMain");
  if (main) {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "This is a demo dashboard card.";
    main.appendChild(card);
  }
});
