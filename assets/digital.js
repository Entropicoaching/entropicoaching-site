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

const flowContent = {
  inquiries: {
    id: "N8N FLOW 01 / HENVENDELSER",
    title: "En ny henvendelse lander det rigtige sted",
    summary: "Når formularen sendes, kontrollerer flowet oplysningerne, opretter kundeemnet og giver både virksomheden og kunden besked.",
    outcome: "Henvendelsen bliver behandlet med det samme, mens undtagelser stadig lander hos et menneske.",
    nodes: [
      ["Formular modtaget", "Webhook starter flowet"],
      ["Klargør data", "Navn, mail og behov"],
      ["Data komplette?", "IF-node vælger vej"],
      ["Opret kundeemne", "CRM eller kundeliste"],
      ["Bekræft og giv besked", "Kunde og ejer informeres"],
      ["Læg i kontrolkø", "Intet forsvinder stille"]
    ],
    story: [
      ["trigger", "Kunden sender formularen", "Webstedet afleverer oplysningerne til n8n gennem en webhook. Det er signalet, der starter flowet."],
      ["process", "n8n gør oplysningerne klar", "Navn, mail og behov får faste felter, så de kan bruges sikkert i de næste systemer."],
      ["check", "Flowet kontrollerer det vigtigste", "En IF-node ser efter mangler. Gode data fortsætter automatisk, mens fejl bliver stoppet."],
      ["primary", "Kundeemnet bliver oprettet", "De godkendte oplysninger skrives i virksomhedens CRM eller kundeliste uden manuel kopiering."],
      ["result", "Svar og intern besked bliver sendt", "Kunden får en bekræftelse, og den ansvarlige får en sag med den nødvendige kontekst."],
      ["fallback", "Et menneske overtager undtagelsen", "Hvis noget mangler, bliver sagen lagt i en tydelig kontrolkø. Flowet skjuler ikke fejlen."]
    ]
  },
  documents: {
    id: "N8N FLOW 02 / BILAG",
    title: "Et bilag bliver til en kontrolleret kladde",
    summary: "Når et bilag rammer indbakken, henter flowet de relevante felter, kontrollerer dem og sender kun usikre bilag til manuel behandling.",
    outcome: "Medarbejderen kontrollerer undtagelserne i stedet for at indtaste hvert bilag.",
    nodes: [
      ["Mail eller upload", "Nyt bilag starter flowet"],
      ["Udtræk felter", "Beløb, dato og leverandør"],
      ["Sikker nok?", "Regler kontrollerer data"],
      ["Opret kladde", "Sendes til økonomisystem"],
      ["Gem og log", "Bilaget får en tydelig status"],
      ["Send til kontrol", "Usikre bilag bliver stoppet"]
    ],
    story: [
      ["trigger", "Bilaget ankommer", "En mail eller upload starter flowet, så medarbejderen ikke først skal hente og flytte filen."],
      ["process", "n8n henter de relevante felter", "Beløb, dato og leverandør bliver samlet i en fast struktur, der kan kontrolleres."],
      ["check", "Regler vurderer oplysningerne", "Flowet kontrollerer, om de nødvendige felter findes, og om værdierne ser brugbare ud."],
      ["primary", "En kladde bliver oprettet", "Når kontrollen består, sendes oplysningerne videre som en kladde i økonomisystemet."],
      ["result", "Bilaget får en tydelig status", "Fil, kladde og resultat bliver logget, så virksomheden kan se, hvad der er sket."],
      ["fallback", "Usikre bilag bliver stoppet", "Hvis kontrollen fejler, bliver bilaget sendt til et menneske i stedet for at blive bogført blindt."]
    ]
  },
  followup: {
    id: "N8N FLOW 03 / OPFØLGNING",
    title: "En åben opgave bliver fulgt op til tiden",
    summary: "Flowet læser status og aftalt dato, vurderer om der skal handles nu og opretter næste opgave hos den rigtige person.",
    outcome: "Rutineopfølgningen sker til tiden, mens den ansvarlige stadig styrer den personlige kontakt.",
    nodes: [
      ["Status ændret", "CRM eller opgavesystem"],
      ["Find aftale", "Dato, ejer og næste trin"],
      ["Tid til handling?", "IF-node vælger vej"],
      ["Opret opgave", "Tildeles den ansvarlige"],
      ["Giv besked og log", "Teamet får en tydelig status"],
      ["Vent og tjek igen", "Flowet fortsætter senere"]
    ],
    story: [
      ["trigger", "En status ændrer sig", "CRM eller opgavesystem sender ændringen til n8n og starter kontrollen."],
      ["process", "Flowet finder den relevante aftale", "Dato, ansvarlig og næste trin bliver hentet, så opfølgningen sker med den rigtige kontekst."],
      ["check", "n8n vurderer om tiden er inde", "En IF-node sammenholder status og dato. Kun opgaver, der kræver handling nu, går videre."],
      ["primary", "Den næste opgave bliver oprettet", "Opgaven bliver tildelt den ansvarlige med de oplysninger, der skal bruges."],
      ["result", "Teamet får besked", "Handlingen bliver logget, og den ansvarlige får en tydelig besked om næste skridt."],
      ["fallback", "Flowet venter uden at glemme", "Hvis tiden ikke er inde, stopper handlingen nu og bliver kontrolleret igen senere."]
    ]
  }
};

const flowButtons = document.querySelectorAll(".flow-scenario");
const flowBoardId = document.querySelector("#flow-board-id");
const flowTitle = document.querySelector("#flow-title");
const flowSummary = document.querySelector("#flow-summary");
const flowOutcome = document.querySelector("#flow-outcome");
const flowGraph = document.querySelector("#flow-graph");
const flowPlayButton = document.querySelector("#flow-play");
const flowPlayLabel = document.querySelector("#flow-play-label");
const flowStoryStep = document.querySelector("#flow-story-step");
const flowStoryTitle = document.querySelector("#flow-story-title");
const flowStoryDetail = document.querySelector("#flow-story-detail");
const flowStoryProgress = document.querySelector("#flow-story-progress");
const flowNarrator = document.querySelector(".flow-narrator");
const flowStoryNodes = document.querySelectorAll("[data-story-node]");
const flowStoryPaths = document.querySelectorAll("[data-path-step]");
const flowNodeElements = ["trigger", "process", "check", "primary", "result", "fallback"].map((name) => ({
  title: document.querySelector(`#flow-${name}-title`),
  detail: document.querySelector(`#flow-${name}-detail`)
}));
let flowAnimationTimer;
let flowStoryTimer;
let narratorAnimationTimer;
let activeFlowKey = "inquiries";
let activeStoryIndex = 0;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function showFlowStoryStep(index) {
  const story = flowContent[activeFlowKey]?.story;
  if (!story || !flowGraph || !flowStoryStep || !flowStoryTitle || !flowStoryDetail || !flowStoryProgress) return;

  const boundedIndex = Math.max(0, Math.min(index, story.length - 1));
  const [nodeName, title, detail] = story[boundedIndex];
  activeStoryIndex = boundedIndex;
  flowGraph.dataset.storyStep = String(boundedIndex);
  flowStoryStep.textContent = `TRIN ${boundedIndex + 1} AF ${story.length}`;
  flowStoryTitle.textContent = title;
  flowStoryDetail.textContent = detail;
  flowStoryProgress.style.width = `${((boundedIndex + 1) / story.length) * 100}%`;

  if (flowNarrator) {
    flowNarrator.classList.remove("is-updating");
    window.requestAnimationFrame(() => {
      flowNarrator.classList.add("is-updating");
      window.clearTimeout(narratorAnimationTimer);
      narratorAnimationTimer = window.setTimeout(() => flowNarrator.classList.remove("is-updating"), 700);
    });
  }

  flowStoryNodes.forEach((node) => {
    const nodeIndex = story.findIndex(([name]) => name === node.dataset.storyNode);
    node.classList.toggle("is-active", node.dataset.storyNode === nodeName);
    node.classList.toggle("is-complete", nodeIndex > -1 && nodeIndex < boundedIndex);
  });

  flowStoryPaths.forEach((path) => {
    const pathStep = Number(path.dataset.pathStep);
    path.classList.toggle("is-active", pathStep === boundedIndex);
    path.classList.toggle("is-complete", pathStep < boundedIndex);
  });
}

function playFlowStory() {
  const story = flowContent[activeFlowKey]?.story;
  if (!story) return;

  window.clearTimeout(flowStoryTimer);

  if (reducedMotion.matches) {
    const nextIndex = activeStoryIndex >= story.length - 1 ? 0 : activeStoryIndex + 1;
    showFlowStoryStep(nextIndex);
    if (flowPlayLabel) flowPlayLabel.textContent = nextIndex >= story.length - 1 ? "Start forfra" : "Næste trin";
    return;
  }

  showFlowStoryStep(0);
  if (flowPlayLabel) flowPlayLabel.textContent = "Kører nu";

  const advanceStory = () => {
    if (activeStoryIndex >= story.length - 1) {
      if (flowPlayLabel) flowPlayLabel.textContent = "Afspil igen";
      return;
    }
    showFlowStoryStep(activeStoryIndex + 1);
    flowStoryTimer = window.setTimeout(advanceStory, 2400);
  };

  flowStoryTimer = window.setTimeout(advanceStory, 2400);
}

function renderFlow(key) {
  const content = flowContent[key];
  if (!content || !flowBoardId || !flowTitle || !flowSummary || !flowOutcome || !flowGraph) return;

  activeFlowKey = key;
  flowBoardId.textContent = content.id;
  flowTitle.textContent = content.title;
  flowSummary.textContent = content.summary;
  flowOutcome.textContent = content.outcome;
  flowNodeElements.forEach((elements, index) => {
    if (elements.title) elements.title.textContent = content.nodes[index][0];
    if (elements.detail) elements.detail.textContent = content.nodes[index][1];
  });
  flowGraph.dataset.flow = key;

  flowGraph.classList.remove("is-changing");
  window.requestAnimationFrame(() => {
    flowGraph.classList.add("is-changing");
    window.clearTimeout(flowAnimationTimer);
    flowAnimationTimer = window.setTimeout(() => flowGraph.classList.remove("is-changing"), 460);
  });

  showFlowStoryStep(0);
  if (reducedMotion.matches) {
    if (flowPlayLabel) flowPlayLabel.textContent = "Næste trin";
  } else {
    playFlowStory();
  }
}

flowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    flowButtons.forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    renderFlow(button.dataset.flow);
  });
});

flowPlayButton?.addEventListener("click", playFlowStory);

if (flowGraph) {
  showFlowStoryStep(0);
  if (reducedMotion.matches) {
    if (flowPlayLabel) flowPlayLabel.textContent = "Næste trin";
  } else if ("IntersectionObserver" in window) {
    const flowStoryObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        playFlowStory();
        flowStoryObserver.disconnect();
      }
    }, { threshold: 0.45 });
    flowStoryObserver.observe(flowGraph);
  }
}

const choiceButtons = document.querySelectorAll(".choice");
const packageField = document.querySelector("#package");

function selectChoice(selectedButton) {
  if (!selectedButton) return;
  choiceButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === selectedButton)));
  if (packageField) packageField.value = selectedButton.dataset.value || selectedButton.textContent.trim();
}

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectChoice(button);
  });
});

if (choiceButtons.length) {
  const requestedTrack = new URLSearchParams(window.location.search).get("spor");
  const requestedButton = Array.from(choiceButtons).find((button) => button.dataset.spor === requestedTrack);
  if (requestedButton) selectChoice(requestedButton);
}

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
      selectChoice(choiceButtons[0]);
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
