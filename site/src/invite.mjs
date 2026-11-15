// Invite-only demo: the wording and link changes applied when the site runs in invite mode (the default).
// Set DEMO_ACCESS=open at build time to point visitors straight at the demo instead.
// Ask-for-an-invite goes to a mailbox CREOVA already publishes on creova.one; the site itself collects nothing.
export const invite = {
  en: {
    subject: "SEEN invite request",
    cta: "Ask for an invite",
    status0: "Invite-only demo",
    footerStatus: "In development · Invite-only demo · © 2026 CREOVA",
    betaToday: "The demo app is shared by invitation. It runs on sample stories and sample accounts, and everything you do stays in your own browser.",
    makeOpen: "Ask for an invite",
    closerP: "Ask for an invite and take a look around.",
    faq0: { q: "Can I try SEEN now?", a: "By invitation. We are sharing the demo app with a small group while we build. Ask for an invite and we will reply. It runs on sample stories and sample accounts, and what you create in it stays in your own browser." },
  },
  fr: {
    subject: "Demande d'invitation SEEN",
    cta: "Demander une invitation",
    status0: "Démo sur invitation",
    footerStatus: "En développement · Démo sur invitation · © 2026 CREOVA",
    betaToday: "La démo est partagée sur invitation. Elle fonctionne avec des histoires et des comptes d'exemple, et tout ce que vous faites reste dans votre propre navigateur.",
    makeOpen: "Demander une invitation",
    closerP: "Demandez une invitation et jetez un coup d'œil.",
    faq0: { q: "Puis-je essayer SEEN maintenant ?", a: "Sur invitation. Nous partageons la démo avec un petit groupe pendant que nous construisons. Demandez une invitation et nous répondrons. Elle fonctionne avec des histoires et des comptes d'exemple, et ce que vous y créez reste dans votre propre navigateur." },
  },
  es: {
    subject: "Solicitud de invitación a SEEN",
    cta: "Pedir una invitación",
    status0: "Demo por invitación",
    footerStatus: "En desarrollo · Demo por invitación · © 2026 CREOVA",
    betaToday: "La demo se comparte por invitación. Funciona con historias y cuentas de ejemplo, y todo lo que haces se queda en tu propio navegador.",
    makeOpen: "Pedir una invitación",
    closerP: "Pide una invitación y echa un vistazo.",
    faq0: { q: "¿Puedo probar SEEN ahora?", a: "Por invitación. Compartimos la demo con un grupo pequeño mientras construimos. Pide una invitación y te responderemos. Funciona con historias y cuentas de ejemplo, y lo que creas se queda en tu propio navegador." },
  },
};

/** Returns a copy of the page copy with the invite wording applied. */
export function withInvite(c, lang) {
  const i = invite[lang];
  const out = structuredClone(c);
  out.cta = i.cta;
  out.status[0] = i.status0;
  out.footer.status = i.footerStatus;
  out.beta.today = i.betaToday;
  out.make.open = i.makeOpen;
  out.closer.p = i.closerP;
  out.faq.items[0] = i.faq0;
  return out;
}
