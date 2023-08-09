import { login, logout } from "./login";
import "@babel/polyfill";
import { displayMap } from "./mapbox";

// DOM elements
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form");
const logoutButton = document.querySelector(".nav__el--logout");

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    e.preventDefault();
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
