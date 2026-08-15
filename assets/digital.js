const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const mobileNavigation = window.matchMedia("(max-width: 900px)");

function syncNavigation() {
  if (!navToggle || !navLinks) return;
  const mobile = mobileNavigation.matches;
  navLinks.hidden = mobile;
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navLinks.hidden = open;
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNavigation.matches) syncNavigation();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      syncNavigation();
      navToggle.focus();
    }
  });

  mobileNavigation.addEventListener("change", syncNavigation);
  syncNavigation();
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const choiceButtons = document.querySelectorAll(".choice");
const packageField = document.querySelector("#package");

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    choiceButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    if (packageField) packageField.value = button.dataset.value || button.textContent.trim();
  });
});

const contactForm = document.querySelector("#contact-form");
const responseBox = document.querySelector("#response");
const submitButton = document.querySelector("#submit-button");

if (contactForm && responseBox && submitButton) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = "Sender …";
    responseBox.classList.remove("show");

    try {
      const result = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      });

      if (!result.ok) throw new Error("Afsendelsen fejlede");

      const name = document.querySelector("#name")?.value.trim();
      contactForm.reset();
      choiceButtons.forEach((item, index) => item.setAttribute("aria-pressed", index === 0 ? "true" : "false"));
      if (packageField) packageField.value = choiceButtons[0]?.dataset.value || "Landingsside";
      responseBox.textContent = `Tak${name ? `, ${name}` : ""}. Din besked er sendt. Jeg svarer normalt inden for 1–2 hverdage.`;
    } catch (error) {
      responseBox.textContent = "Noget gik galt med afsendelsen. Skriv i stedet til kontakt@entropidigital.dk.";
    } finally {
      responseBox.classList.add("show");
      submitButton.disabled = false;
      submitButton.textContent = "Send besked →";
    }
  });
}
