// Obtiene las secciones, enlaces y barra para sincronizar la navegación.
const sections = document.querySelectorAll(".portfolio-section");
const navLinks = document.querySelectorAll(".navbar .nav-link");
const navbar = document.querySelector(".navbar");

// Marca la sección que cruza el punto de referencia bajo la navegación.
const updateActiveSection = () => {
	const activationPoint = window.innerHeight * 0.35;
	let currentSection = sections[0];

	sections.forEach((section) => {
		if (section.getBoundingClientRect().top <= activationPoint) {
			currentSection = section;
		}
	});

	if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
		currentSection = sections[sections.length - 1];
	}

	navbar.style.setProperty("--section-accent", currentSection.dataset.accent);

	navLinks.forEach((link) => {
		const isCurrent = link.hash === `#${currentSection.id}`;
		link.classList.toggle("active", isCurrent);

		if (isCurrent) {
			link.setAttribute("aria-current", "page");
		} else {
			link.removeAttribute("aria-current");
		}
	});
};

let navigationUpdateScheduled = false;
const scheduleActiveSectionUpdate = () => {
	if (navigationUpdateScheduled) return;
	navigationUpdateScheduled = true;
	requestAnimationFrame(() => {
		navigationUpdateScheduled = false;
		updateActiveSection();
	});
};

window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
window.addEventListener("resize", scheduleActiveSectionUpdate);
updateActiveSection();

// Reordena las tarjetas al avanzar o retroceder para mantener el carrusel en ciclo.
const projectTrack = document.querySelector(".cards-track");
const projectCarouselControls = document.querySelectorAll("[data-carousel-direction]");
let isProjectCarouselMoving = false;

projectCarouselControls.forEach((button) => {
	button.addEventListener("click", () => {
		if (isProjectCarouselMoving || !projectTrack) return;

		const direction = Number(button.dataset.carouselDirection);
		const cards = projectTrack.querySelectorAll(".project-card");
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
