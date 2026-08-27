import { PORTAL_ROUTES, ROUTE_GROUPS } from "../../core/portal-routes.mjs";

export function renderShell(ctx) {
  const { language, copy, esc, routeLink, routeLabel, icon, officialAnchor } = ctx;

  function serviceMenu(label, content, className = "") {
    return `<details class="service-menu ${esc(className)}">
      <summary>${esc(label)} ${icon("chevron-down", "icon icon-small")}</summary>
      <div class="service-menu-panel">${content}</div>
    </details>`;
  }

  function menuGroup(title, links) {
    return `<div class="service-menu-group"><strong>${esc(title)}</strong>${links.join("")}</div>`;
  }

  function menuRoute(route, title, description) {
    return routeLink(route, `<span><strong>${esc(title)}</strong><small>${esc(description)}</small></span>${icon("arrow-right", "icon icon-small")}`, "service-menu-link service-menu-action raw-label");
  }

  function renderShellView() {
    const c = copy();
    document.documentElement.lang = c.meta.languageCode;
    document.title = c.meta.title;
    document.querySelector("[data-brand-title]").textContent = c.meta.title;
    document.querySelector("[data-brand-qualifier]").textContent = c.meta.qualifier;
    document.querySelector("[data-header-help-label]").textContent = c.common.actualIncident;
    document.querySelector("[data-header-help-action]").textContent = c.common.callManually;
    document.querySelector("[data-language-label]").textContent = c.nav.language;
    document.querySelector("[data-header-menu-label]").textContent = c.nav.services;
    const languageSelect = document.querySelector("#languageSelect");
    languageSelect.value = language;
    languageSelect.setAttribute("aria-label", c.nav.language);
    document.querySelector(".brand").setAttribute("aria-label", `${c.meta.title}, ${c.nav.home}`);
  
    const primaryNav = document.querySelector("[data-primary-nav]");
    primaryNav.setAttribute("aria-label", c.nav.primary);
    const complaintMenu = serviceMenu(c.nav.complaint, `
      ${menuGroup(routeLabel("complaints"), [
        menuRoute("women-children", routeLabel("women-children"), c.nav.womenChildrenAnonymousNote),
        menuRoute("act-now", c.nav.financialFraud, c.nav.financialFraudNote),
        menuRoute("other-cybercrime", routeLabel("other-cybercrime"), c.nav.otherCrimeNote)
      ])}`, "complaint-menu");
    const suspectMenu = serviceMenu(c.nav.suspect, `
      ${menuGroup(routeLabel("official-tools"), [
        menuRoute("check-identifier", routeLabel("check-identifier"), c.nav.checkIdentifiersNote),
        menuRoute("check-website", routeLabel("check-website"), c.nav.checkWebsiteNote),
        menuRoute("report-suspect", routeLabel("report-suspect"), c.nav.reportSuspectNote),
        menuRoute("report-abuse", routeLabel("report-abuse"), c.nav.reportAbuseNote),
        menuRoute("mobile-connections", routeLabel("mobile-connections"), c.nav.tafcopNote),
        menuRoute("appeal", routeLabel("appeal"), c.nav.gacNote)
      ])}`, "suspect-menu");
    const learningMenu = serviceMenu(c.nav.learning, menuGroup(c.nav.learning, [
      routeLink("learning-corner", c.nav.learningOverview, "service-menu-link"),
      routeLink("guides", c.nav.guides, "service-menu-link"),
      routeLink("advisories", c.content.advisories.eyebrow, "service-menu-link"),
      routeLink("safety", c.content.safety.eyebrow, "service-menu-link"),
      routeLink("awareness", c.content.awareness.eyebrow, "service-menu-link"),
      routeLink("daily-digest", c.content["daily-digest"].eyebrow, "service-menu-link"),
      routeLink("training", c.content.training.eyebrow, "service-menu-link"),
      routeLink("media", c.content.media.eyebrow, "service-menu-link"),
      routeLink("accessibility", routeLabel("accessibility"), "service-menu-link"),
      routeLink("faq", routeLabel("faq"), "service-menu-link")
    ]), "learning-menu");
    primaryNav.innerHTML = `
      ${routeLink("home", `${icon("house", "icon icon-small")}<span>${esc(c.nav.home)}</span>`, "service-home raw-label")}
      ${complaintMenu}
      ${routeLink("track", c.nav.trackComplaint)}
      ${suspectMenu}
      ${routeLink("volunteers", routeLabel("volunteers"))}
      ${learningMenu}
      ${routeLink("contact", c.nav.contact)}`;
  
    document.querySelector("[data-mobile-nav]").innerHTML = `
      ${routeLink("home", `${icon("house")}<span>${esc(c.nav.home)}</span>`, "mobile-nav-link raw-label")}
      ${routeLink("act-now", `${icon("file-plus-2")}<span>${esc(c.nav.report)}</span>`, "mobile-nav-link raw-label")}
      ${routeLink("track", `${icon("clipboard-list")}<span>${esc(c.nav.track)}</span>`, "mobile-nav-link raw-label")}
      ${routeLink("learning-corner", `${icon("book-open")}<span>${esc(c.nav.learning)}</span>`, "mobile-nav-link raw-label")}
      <button class="mobile-nav-link" type="button" data-open-more aria-haspopup="dialog">
        ${icon("ellipsis")}<span>${esc(c.nav.more)}</span>
      </button>`;
  
    document.querySelector("[data-more-title]").textContent = c.nav.moreTitle;
    document.querySelector("[data-more-close]").setAttribute("aria-label", c.nav.closeMenu);
    const moreGroup = (title, links) => `<section class="more-group"><h3>${esc(title)}</h3><div>${links.map(([route, label]) => routeLink(route, label, "more-link")).join("")}</div></section>`;
    const moreTitles = {
      complaints: routeLabel("complaints"),
      tracking: c.nav.track,
      suspect: routeLabel("official-tools"),
      volunteers: c.nav.volunteers,
      learning: c.nav.learning,
      help: c.nav.helpGroup,
      legal: c.nav.about
    };
    document.querySelector("[data-more-links]").innerHTML = ROUTE_GROUPS.map((group) => moreGroup(
      moreTitles[group],
      PORTAL_ROUTES.filter((route) => route.group === group).map((route) => [route.id, routeLabel(route.id)])
    )).join("");
  
    document.querySelector("[data-dialog-title]").textContent = c.flow.submit.dialogTitle;
    document.querySelector("[data-dialog-body]").textContent = c.flow.submit.dialogBody;
    document.querySelector("[data-dialog-cancel]").textContent = c.flow.submit.cancel;
    document.querySelector("[data-dialog-confirm]").textContent = c.flow.submit.confirm;
    renderFooter();
  }
  
  function renderFooter() {
    const c = copy();
    const group = (title, links) => `<nav class="footer-group" aria-label="${esc(title)}"><strong>${esc(title)}</strong>${links.map(([route, label]) => routeLink(route, label)).join("")}</nav>`;
    document.querySelector("[data-shell-footer]").innerHTML = `
      <div class="footer-upper">
        <div class="footer-brand">
          <div class="footer-brand-heading">${icon("waypoints", "footer-brand-icon")}<strong>${esc(c.footer.title)}</strong></div>
          <small>${esc(c.footer.qualifier)}</small>
          <p>${esc(c.footer.body)}</p>
        </div>
        ${group(c.nav.reportTrackGroup, [["act-now", c.nav.report], ["complaints", routeLabel("complaints")], ["track", c.nav.track], ["official-tools", routeLabel("official-tools")]])}
        ${group(c.nav.guides, [["guides", routeLabel("guides")], ["safety", routeLabel("safety")], ["advisories", routeLabel("advisories")], ["training", routeLabel("training")]])}
        ${group(c.nav.helpGroup, [["faq", routeLabel("faq")], ["contact", routeLabel("contact")], ["feedback", routeLabel("feedback")], ["grievance", routeLabel("grievance")]])}
        ${group(c.nav.about, [["about", routeLabel("about")], ["policies", routeLabel("policies")], ["privacy", routeLabel("privacy")], ["accessibility", routeLabel("accessibility")]])}
        <aside class="footer-help-panel">
          ${icon("circle-help", "footer-help-icon")}
          <div><strong>${esc(c.home.help.title)}</strong><p>${esc(c.home.help.intro)}</p>${routeLink("contact", routeLabel("contact"), "text-link")}</div>
        </aside>
      </div>
      <div class="footer-lower">
        <p>${esc(c.footer.boundary)}</p>
        <strong>${icon("phone-call", "icon icon-small")} ${esc(c.footer.urgent)}</strong>
        ${officialAnchor("officialHome", c.common.officialSite, "footer-official-link")}
      </div>`;
  }

  renderShellView();
}
