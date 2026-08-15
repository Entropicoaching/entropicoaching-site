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

const signalContent = {
  offer: {
    status: "klar retning",
    detail: "Kunden forstår hurtigt, hvad virksomheden tilbyder, og hvem løsningen er til."
  },
  action: {
    status: "synligt næste trin",
    detail: "Siden viser én tydelig handling i stedet for at lade kunden gætte sig videre."
  },
  inquiry: {
    status: "samlet indtag",
    detail: "De vigtigste oplysninger lander samlet, så den første samtale starter et bedre sted."
  },
  followup: {
    status: "rolig opfølgning",
    detail: "En enkel besked eller påmindelse holder næste skridt i gang uden ekstra manuelt arbejde."
  }
};

const signalButtons = document.querySelectorAll(".signal-step");
const signalStatus = document.querySelector("#signal-status");
const signalDetail = document.querySelector("#signal-detail");

signalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = signalContent[button.dataset.signal];
    if (!content || !signalStatus || !signalDetail) return;
    signalButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    signalStatus.textContent = content.status;
    signalDetail.textContent = content.detail;
  });
});

const flowContent = {
  inquiries: {
    id: "EKSEMPEL 01 / NY HENVENDELSE",
    title: "Fra løs idé til en brugbar henvendelse",
    summary: "Den besøgende vælger opgavetype, fortæller hvem virksomheden er og beskriver det vigtigste mål. Svarene lander samlet hos Marc.",
    outcome: "Kunden får et relevant svar uden først at skrive en lang brief.",
    inputs: ["Opgavetype", "Virksomhed", "Vigtigste mål"],
    core: ["Kort projektbrief", "Tre svar samlet ét sted"],
    result: ["Første vurdering", "Marc kan svare konkret"]
  },
  booking: {
    id: "EKSEMPEL 02 / FØR ET MØDE",
    title: "Fra aftale til et møde med fælles udgangspunkt",
    summary: "Den korte henvendelse bliver samlet med de vigtigste spørgsmål og det valgte tidspunkt, så begge parter kan møde forberedt.",
    outcome: "Mere af mødet kan bruges på valg og løsning.",
    inputs: ["Kort brief", "Spørgsmål", "Tidspunkt"],
    core: ["Mødeforberedelse", "Det vigtigste samlet"],
    result: ["Klar samtale", "Mindre tid på baggrund"]
  },
  followup: {
    id: "EKSEMPEL 03 / OPFØLGNING",
    title: "Fra aflevering til en opfølgning med en grund",
    summary: "Leverancen, den aftalte næste handling og datoen bliver samlet, så opfølgningen sker på det rigtige tidspunkt og med den rigtige kontekst.",
    outcome: "Kunden bliver kontaktet relevant, ikke bare automatisk.",
    inputs: ["Leverance", "Næste handling", "Aftalt dato"],
    core: ["Opfølgning", "Kontekst og timing samlet"],
    result: ["Relevant besked", "Kunden kontaktes med en grund"]
  }
};

const flowButtons = document.querySelectorAll(".flow-scenario");
const flowBoardId = document.querySelector("#flow-board-id");
const flowTitle = document.querySelector("#flow-title");
const flowSummary = document.querySelector("#flow-summary");
const flowOutcome = document.querySelector("#flow-outcome");
const flowGraph = document.querySelector("#flow-graph");
const flowInputs = [1, 2, 3].map((number) => document.querySelector(`#flow-input-${number}`));
const flowCoreTitle = document.querySelector("#flow-core-title");
const flowCoreDetail = document.querySelector("#flow-core-detail");
const flowResultTitle = document.querySelector("#flow-result-title");
const flowResultDetail = document.querySelector("#flow-result-detail");
let flowAnimationTimer;

function renderFlow(key) {
  const content = flowContent[key];
  if (!content || !flowBoardId || !flowTitle || !flowSummary || !flowOutcome || !flowGraph) return;

  flowBoardId.textContent = content.id;
  flowTitle.textContent = content.title;
  flowSummary.textContent = content.summary;
  flowOutcome.textContent = content.outcome;
  flowInputs.forEach((element, index) => {
    if (element) element.textContent = content.inputs[index];
  });
  if (flowCoreTitle) flowCoreTitle.textContent = content.core[0];
  if (flowCoreDetail) flowCoreDetail.textContent = content.core[1];
  if (flowResultTitle) flowResultTitle.textContent = content.result[0];
  if (flowResultDetail) flowResultDetail.textContent = content.result[1];
  flowGraph.dataset.flow = key;

  flowGraph.classList.remove("is-changing");
  window.requestAnimationFrame(() => {
    flowGraph.classList.add("is-changing");
    window.clearTimeout(flowAnimationTimer);
    flowAnimationTimer = window.setTimeout(() => flowGraph.classList.remove("is-changing"), 460);
  });
}

flowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    flowButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    renderFlow(button.dataset.flow);
  });
});

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
      responseBox.textContent = `Tak${name ? `, ${name}` : ""}. Din besked er sendt. Jeg svarer normalt inden for 1 til 2 hverdage.`;
    } catch (error) {
      responseBox.textContent = "Noget gik galt med afsendelsen. Skriv i stedet til kontakt@entropidigital.dk.";
    } finally {
      responseBox.classList.add("show");
      submitButton.disabled = false;
      submitButton.textContent = "Send besked →";
    }
  });
}
