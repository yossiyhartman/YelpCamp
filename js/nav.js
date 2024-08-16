const navbarButton = document.getElementById("navbar-button");
const navbar = document.getElementById("navbar-sticky");

navbarButton.addEventListener("click", () => {
	navbar.classList.toggle("hidden");
});
