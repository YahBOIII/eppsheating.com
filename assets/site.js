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

  // Service request form
  const serviceForm = document.getElementById("service-request-form");
  if (serviceForm) {
    const statusEl = document.getElementById("form-status");
    const submitBtn = serviceForm.querySelector("[type=submit]");

    function setStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = "form-status " + (type || "");
    }

    function validateForm() {
      let valid = true;
      serviceForm.querySelectorAll("[required]").forEach(function (field) {
        const empty = field.value.trim() === "";
        field.classList.toggle("invalid", empty);
        if (empty) valid = false;
      });
      return valid;
    }

    serviceForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm()) {
        setStatus("Please fill in all required fields.", "error");
        return;
      }
      setStatus("Sending\u2026", "");
      submitBtn.disabled = true;

      // Defer fetch so aria-live picks up the "Sending…" update first
      setTimeout(function () {
        var data = new FormData(serviceForm);
        fetch(serviceForm.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        })
          .then(function (res) {
            if (res.ok) {
              setStatus("\u2705 Request sent! We\u2019ll be in touch shortly.", "success");
              serviceForm.reset();
              serviceForm.querySelectorAll(".invalid").forEach(function (el) {
                el.classList.remove("invalid");
              });
            } else {
              return res.json().then(function (body) {
                throw new Error(body.error || "Server error");
              });
            }
          })
          .catch(function (err) {
            setStatus("Something went wrong. Please call or text us at (847) 516-8221.", "error");
            console.error(err);
          })
          .finally(function () {
            submitBtn.disabled = false;
          });
      }, 50);
    });

    // Clear invalid state on input
    serviceForm.querySelectorAll("[required]").forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.value.trim() !== "") field.classList.remove("invalid");
      });
    });
  }
})();
