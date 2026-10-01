// Obtiene las secciones, enlaces y barra para sincronizar la navegación.
const sections = document.querySelectorAll(".portfolio-section");
const navLinks = document.querySelectorAll(".navbar .nav-link");
const navbar = document.querySelector(".navbar");

// Observa qué sección está visible para actualizar el estado del navbar.
const sectionObserver = new IntersectionObserver((entries) => {
	// Selecciona la sección visible que ocupa mayor parte de la pantalla.
	const visibleSections = entries
		.filter((entry) => entry.isIntersecting)
		.sort((first, second) => second.intersectionRatio - first.intersectionRatio);

	if (visibleSections.length === 0) return;

	// Adapta el color de acento de la barra a la sección actual.
	const currentSection = visibleSections[0].target;
	navbar.style.setProperty("--section-accent", currentSection.dataset.accent);

	// Marca el enlace correspondiente y actualiza su estado accesible.
	navLinks.forEach((link) => {
		const isCurrent = link.hash === `#${currentSection.id}`;
		link.classList.toggle("active", isCurrent);

		if (isCurrent) {
			link.setAttribute("aria-current", "page");
		} else {
			link.removeAttribute("aria-current");
		}
	});
}, {
	threshold: [0.2, 0.4, 0.6],
});

// Registra cada sección para reaccionar al desplazamiento de la página.
sections.forEach((section) => sectionObserver.observe(section));
