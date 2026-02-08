/**
 * Scroll Spy Utility
 *
 * Handles two main features:
 * 1. Navbar style transition on scroll (transparent -> solid)
 * 2. Active link highlighting based on current section
 */

export function initScrollSpy(
  headerSelector: string,
  linkSelector: string,
  sectionSelector: string,
  activeClass: string = "text-primary",
) {
  const header = document.querySelector(headerSelector);
  const links = document.querySelectorAll(linkSelector);
  const sections = document.querySelectorAll(sectionSelector);

  // 1. Header Transition
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add(
        "bg-white/95",
        "shadow-md",
        "backdrop-blur-md",
        "py-2",
      );
      header.classList.remove("bg-transparent", "py-4");
    } else {
      header.classList.remove(
        "bg-white/95",
        "shadow-md",
        "backdrop-blur-md",
        "py-2",
      );
      header.classList.add("bg-transparent", "py-4");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Init state

  // 2. Active Link Highlighting
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Trigger when section is near top
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        if (!id) return;

        // Remove active class from all
        links.forEach((link) => {
          link.classList.remove(activeClass, "font-bold");
          link.classList.add("text-text/80", "font-medium");
        });

        // Add to current
        const activeLink = document.querySelector(
          `${linkSelector}[href="#${id}"]`,
        );
        if (activeLink) {
          activeLink.classList.remove("text-text/80", "font-medium");
          activeLink.classList.add(activeClass, "font-bold");
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}
