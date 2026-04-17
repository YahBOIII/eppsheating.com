(function () {
  function setFormStatus(statusElement, message, type) {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.className = "form-status" + (type ? " is-" + type : "");
  }

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

  const serviceForm = document.querySelector("#serviceForm");
  if (serviceForm) {
    const serviceField = serviceForm.querySelector("#service");
    const submitButton = serviceForm.querySelector('button[type="submit"]');
    const statusElement = document.querySelector("#formStatus");
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");

    if (requestedService && serviceField) {
      serviceField.value = requestedService;
    }

    serviceForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!serviceForm.reportValidity()) {
        setFormStatus(statusElement, "Please complete the required fields.", "error");
        return;
      }

      const formData = new FormData(serviceForm);
      const payload = Object.fromEntries(formData.entries());

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";
      }
      setFormStatus(statusElement, "Sending your request...", "");

      try {
        const response = await fetch(serviceForm.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(function () {
          return {};
        });

        if (!response.ok) {
          throw new Error(result.error || "Unable to submit your request right now.");
        }

        serviceForm.reset();
        if (requestedService && serviceField) {
          serviceField.value = requestedService;
        }
        setFormStatus(statusElement, result.message || "Your request has been submitted. We’ll contact you soon.", "success");
      } catch (error) {
        setFormStatus(statusElement, error.message || "Unable to submit your request right now.", "error");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Submit Request";
        }
      }
    });
  }
})();
