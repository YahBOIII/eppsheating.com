(function () {
  const header = document.querySelector("header");
  const btn = document.querySelector("[data-menu-btn]");
  if (btn && header) {
    btn.addEventListener("click", () => {
      const open = header.getAttribute("data-open") === "true";
      header.setAttribute("data-open", open ? "false" : "true");
    });
  }

  // active nav
  const page = document.body.getAttribute("data-page");
  document.querySelectorAll("nav a[data-page]").forEach(a => {
    if (a.getAttribute("data-page") === page) a.classList.add("active");
  });

  // Hide/show logo on scroll for mobile
  const brandmark = document.querySelector(".brandmark");
  if (brandmark) {
    let lastScrollY = window.scrollY;
    function updateLogoVisibility() {
      if (window.innerWidth > 720) {
        brandmark.classList.remove("brandmark--hidden");
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        brandmark.classList.add("brandmark--hidden");
      } else if (currentScrollY < lastScrollY) {
        brandmark.classList.remove("brandmark--hidden");
      }
      lastScrollY = currentScrollY;
    }
    window.addEventListener("scroll", updateLogoVisibility, { passive: true });
    window.addEventListener("resize", updateLogoVisibility, { passive: true });
  }

  const stickyActions = document.querySelector(".sticky-actions");
  if (stickyActions) {
    function updateStickyVisibility() {
      if (window.innerWidth > 720) {
        stickyActions.classList.remove("sticky-actions--hidden");
        return;
      }
      const distanceFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      if (distanceFromBottom < 80) {
        stickyActions.classList.add("sticky-actions--hidden");
      } else {
        stickyActions.classList.remove("sticky-actions--hidden");
      }
    }
    window.addEventListener("scroll", updateStickyVisibility, { passive: true });
    window.addEventListener("resize", updateStickyVisibility, { passive: true });
    updateStickyVisibility();
  }
})();
