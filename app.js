const sections = document.querySelectorAll(".portfolio-section");
const navLinks = document.querySelectorAll(".navbar .nav-link");
const navbar = document.querySelector(".navbar");

const sectionObserver = new IntersectionObserver((entries) => {
	const visibleSections = entries
		.filter((entry) => entry.isIntersecting)
		.sort((first, second) => second.intersectionRatio - first.intersectionRatio);

	if (visibleSections.length === 0) return;

	const currentSection = visibleSections[0].target;
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
}, {
	threshold: [0.2, 0.4, 0.6],
});

sections.forEach((section) => sectionObserver.observe(section));
