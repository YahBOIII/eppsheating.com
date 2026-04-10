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
