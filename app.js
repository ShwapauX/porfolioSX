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

// Reordena las tarjetas al avanzar o retroceder para mantener el carrusel en ciclo.
const projectTrack = document.querySelector(".cards-track");
const projectCarouselControls = document.querySelectorAll("[data-carousel-direction]");
let isProjectCarouselMoving = false;

projectCarouselControls.forEach((button) => {
	button.addEventListener("click", () => {
		if (isProjectCarouselMoving || !projectTrack) return;

		const direction = Number(button.dataset.carouselDirection);
		const cards = projectTrack.querySelectorAll(".card");
		const firstCard = cards[0];
		const lastCard = cards[cards.length - 1];
		const gap = parseFloat(getComputedStyle(projectTrack).gap);
		const distance = firstCard.getBoundingClientRect().width + gap;
		isProjectCarouselMoving = true;
		let hasFinished = false;
		let fallbackTimer;

		const finishMove = () => {
			if (hasFinished) return;
			hasFinished = true;

			if (direction > 0) {
				projectTrack.append(firstCard);
			}

			projectTrack.style.transition = "none";
			projectTrack.style.transform = "translateX(0)";
			projectTrack.offsetWidth;
			projectTrack.style.transition = "";
			isProjectCarouselMoving = false;
			clearTimeout(fallbackTimer);
		};

		if (direction < 0) {
			projectTrack.style.transition = "none";
			projectTrack.prepend(lastCard);
			projectTrack.style.transform = `translateX(-${distance}px)`;
			projectTrack.offsetWidth;
		}

		projectTrack.style.transition = "";
		projectTrack.style.transform = direction > 0
			? `translateX(-${distance}px)`
			: "translateX(0)";

		projectTrack.addEventListener("transitionend", function onTransitionEnd(event) {
			if (event.target !== projectTrack || event.propertyName !== "transform") return;
			projectTrack.removeEventListener("transitionend", onTransitionEnd);
			finishMove();
		});

		fallbackTimer = setTimeout(finishMove, 450);
	});
});
