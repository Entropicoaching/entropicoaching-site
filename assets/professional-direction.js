const flowData = {
  lead: {
    title: 'En henvendelse lander det rigtige sted.',
    copy: 'Oplysningerne kontrolleres, kundeemnet oprettes, og kunden får besked. Hvis noget mangler, lander det i en kontrolkø i stedet.',
    nodes: [['TRIGGER','Formular modtaget','Webhook starter'],['BEHANDLER','Klargør data','Navn · mail · behov'],['KONTROL','Data komplette?','IF-node vælger vej'],['HANDLING','Opret kundeemne','CRM eller kundeliste']],
    exception: 'En mangelfuld henvendelse bliver synlig, så den kan følges op i stedet for at forsvinde.',
    result: 'Kunden og virksomheden ved, hvad der sker nu.'
  },
  invoice: {
    title: 'Et bilag bliver gjort klar til kontrol.',
    copy: 'Et bilag fra indbakken udtrækkes, kontrolleres og lægges som kladde. Usikre oplysninger går til menneskelig gennemgang.',
    nodes: [['TRIGGER','Bilag modtaget','Mail eller upload'],['BEHANDLER','Læs oplysninger','Dato · beløb · leverandør'],['KONTROL','Er data troværdige?','Regel tjekker indhold'],['HANDLING','Opret kladde','Regnskabssystem']],
    exception: 'Et bilag med manglende eller usikre oplysninger bliver sendt til kontrol — ikke bogført automatisk.',
    result: 'Rutinen går hurtigere, uden at kontrollen forsvinder.'
  },
  status: {
    title: 'En statusændring bliver til næste handling.',
    copy: 'Når en aftalt betingelse er opfyldt, opretter flowet den næste relevante opgave og gør ansvaret synligt.',
    nodes: [['TRIGGER','Status ændres','System giver signal'],['BEHANDLER','Finder kontekst','Sag · kunde · frist'],['KONTROL','Skal noget ske?','Betingelse vælges'],['HANDLING','Opret opgave','Ejer får besked']],
    exception: 'Hvis data ikke peger på en sikker handling, lægges sagen til manuel vurdering i stedet for at blive gættet.',
    result: 'Opfølgningen er synlig, før den bliver glemt.'
  }
};

const choices = document.querySelectorAll('.flow-choice');
const title = document.querySelector('#flow-title');
const copy = document.querySelector('#flow-copy');
const exception = document.querySelector('#exception-copy');
const result = document.querySelector('#result-title');
const nodes = document.querySelectorAll('#flow-nodes .node');

choices.forEach((choice) => {
  choice.addEventListener('click', () => {
    const flow = flowData[choice.dataset.flow];
    choices.forEach((item) => { item.classList.remove('is-active'); item.setAttribute('aria-selected', 'false'); });
    choice.classList.add('is-active');
    choice.setAttribute('aria-selected', 'true');
    title.textContent = flow.title;
    copy.textContent = flow.copy;
    exception.textContent = flow.exception;
    result.textContent = flow.result;
    nodes.forEach((node, index) => {
      const [label, heading, detail] = flow.nodes[index];
      node.querySelector('span').textContent = label;
      node.querySelector('b').textContent = heading;
      node.querySelector('small').textContent = detail;
    });
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = document.querySelectorAll('.solution-card, .ai-intro, .ai-copy, .ai-decision-board, .flow-board, .journey-track li, .case-section, .contact-section');

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('has-motion');
  revealTargets.forEach((target) => target.classList.add('reveal-item'));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });
  revealTargets.forEach((target) => observer.observe(target));
}
