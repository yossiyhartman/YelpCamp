const navbarButton = document.getElementById("navbar-button");
const navbar1 = document.getElementById("navbar-sticky-1");
const navbar2 = document.getElementById("navbar-sticky-2");

navbarButton.addEventListener("click", () => {
	navbar1.classList.toggle("hidden");
	navbar2.classList.toggle("hidden");
});
