import { PORTAL_ROUTES, ROUTE_GROUPS } from "../../core/portal-routes.mjs";

export function renderShell(ctx) {
  const { language, copy, esc, routeLink, routeLabel, icon, officialAnchor } = ctx;

  function serviceMenu(label, content, className) {
    return `<details class="service-menu ${esc(className)}">
      <summary>${esc(label)} ${icon("chevron-down", "icon icon-small")}</summary>
      <div class="service-menu-panel">${content}</div>
    </details>`;
  }

  function menuGroup(title, links) {
    return `<div class="service-menu-group"><strong>${esc(title)}</strong>${links.join("")}</div>`;
  }

  function menuRoute(route, title, description = "") {
    return routeLink(route, `<span><strong>${esc(title)}</strong>${description ? `<small>${esc(description)}</small>` : ""}</span>${icon("arrow-right", "icon icon-small")}`, "service-menu-link service-menu-action raw-label");
  }

  function renderShellView() {
    const c = copy();
    document.documentElement.lang = c.meta.languageCode;
    document.title = c.meta.title;
    document.querySelector("[data-brand-title]").textContent = c.meta.title;
    document.querySelector("[data-brand-qualifier]").textContent = c.meta.qualifier;
    document.querySelector("[data-header-help-action]").textContent = language === "hi" ? "1930 पर कॉल करें (24x7)" : "Call 1930 (24x7)";
    document.querySelector("[data-header-support-label]").textContent = c.nav.helpSupport;
    document.querySelector("[data-language-label]").textContent = c.nav.language;
    document.querySelector("[data-header-menu-label]").textContent = c.nav.services;
    document.querySelector("[data-open-more]").setAttribute("aria-label", c.nav.services);
    const languageSelect = document.querySelector("#languageSelect");
    languageSelect.value = language;
    languageSelect.setAttribute("aria-label", c.nav.language);
    document.querySelector(".brand").setAttribute("aria-label", `${c.meta.title}, ${c.nav.home}`);
    document.querySelector(".header-primary-action").textContent = c.nav.report;
  
    const primaryNav = document.querySelector("[data-primary-nav]");
    primaryNav.setAttribute("aria-label", c.nav.primary);
    const complaintMenu = serviceMenu(c.nav.complaint, menuGroup(c.nav.reportTrackGroup, [
      menuRoute("act-now", c.nav.report, c.nav.financialFraudNote),
      menuRoute("complaints", routeLabel("complaints")),
      menuRoute("anonymous-report", routeLabel("anonymous-report")),
      menuRoute("registered-report", routeLabel("registered-report")),
      menuRoute("women-children", routeLabel("women-children")),
      menuRoute("other-cybercrime", routeLabel("other-cybercrime"))
    ]), "complaint-menu");
    const suspectMenu = serviceMenu(c.nav.suspect, menuGroup(c.nav.suspectGroup, [
      menuRoute("official-tools", routeLabel("official-tools")),
      menuRoute("check-identifier", routeLabel("check-identifier"), c.nav.checkIdentifiersNote),
      menuRoute("check-website", routeLabel("check-website"), c.nav.checkWebsiteNote),
      menuRoute("report-suspect", routeLabel("report-suspect"), c.nav.reportSuspectNote),
      menuRoute("report-abuse", routeLabel("report-abuse"), c.nav.reportAbuseNote),
      menuRoute("mobile-connections", routeLabel("mobile-connections"), c.nav.tafcopNote),
      menuRoute("appeal", routeLabel("appeal"), c.nav.gacNote)
    ]), "suspect-menu");
    const learningMenu = serviceMenu(c.nav.guidesLearning, menuGroup(c.nav.learning, [
      menuRoute("learning-corner", c.nav.learningOverview),
      menuRoute("guides", routeLabel("guides")),
      menuRoute("advisories", routeLabel("advisories")),
      menuRoute("safety", routeLabel("safety")),
      menuRoute("awareness", routeLabel("awareness")),
      menuRoute("daily-digest", routeLabel("daily-digest")),
      menuRoute("training", routeLabel("training")),
      menuRoute("media", routeLabel("media"))
    ]), "learning-menu");
    const supportMenu = serviceMenu(c.nav.support, menuGroup(c.nav.helpGroup, [
      menuRoute("contact", routeLabel("contact")),
      menuRoute("faq", routeLabel("faq")),
      menuRoute("feedback", routeLabel("feedback")),
      menuRoute("grievance", routeLabel("grievance")),
      menuRoute("accessibility", routeLabel("accessibility"))
    ]), "support-menu");
    primaryNav.innerHTML = `
      ${routeLink("home", `${icon("house", "icon")}<span>${esc(c.nav.home)}</span>`, "service-home raw-label")}
      ${complaintMenu}
      ${routeLink("track", c.nav.track, "nav-direct nav-track")}
      ${suspectMenu}
      ${routeLink("volunteers", c.nav.volunteers, "nav-direct nav-volunteers")}
      ${learningMenu}
      ${supportMenu}
      ${routeLink("act-now", `${esc(c.nav.getStarted)} ${icon("arrow-right", "icon icon-small")}`, "nav-get-started raw-label")}`;
  
    document.querySelector("[data-mobile-quick-actions]").innerHTML = `
      ${routeLink("act-now", esc(c.nav.report), "mobile-quick-link")}
      ${routeLink("track", esc(c.nav.track), "mobile-quick-link")}
      ${routeLink("guides", esc(c.nav.guides), "mobile-quick-link")}
      ${routeLink("contact", esc(c.nav.support), "mobile-quick-link")}`;
  
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
    document.querySelector("[data-shell-footer]").innerHTML = `
      <div class="footer-main">
        <section class="footer-summary" aria-labelledby="footer-title">
          <strong id="footer-title">${esc(c.footer.title)}</strong>
          <span>${esc(c.footer.qualifier)}</span>
          <p>${esc(c.footer.body)}</p>
        </section>
        <nav class="footer-links" aria-label="${esc(c.nav.primary)}">
          ${routeLink("act-now", c.nav.report)}
          ${routeLink("track", c.nav.track)}
          ${routeLink("guides", c.nav.guides)}
          ${routeLink("contact", c.nav.support)}
          ${routeLink("accessibility", routeLabel("accessibility"))}
          ${routeLink("privacy", routeLabel("privacy"))}
        </nav>
        <aside class="footer-urgent">
          <div class="footer-urgent-heading">${icon("phone-call", "footer-urgent-icon")}<div><span>${language === "hi" ? "आधिकारिक कार्रवाई" : "Official action"}</span><strong>${language === "hi" ? "वास्तविक वित्तीय साइबर धोखाधड़ी?" : "Real financial cyber fraud?"}</strong></div></div>
          <p>${esc(c.common.callManually)} · ${esc(c.common.noCall)}</p>
          ${officialAnchor("officialHome", c.common.officialSite, "text-link")}
        </aside>
      </div>
      <div class="footer-meta"><span>${esc(c.footer.boundary)}</span><span>${esc(c.footer.version)}</span></div>`;
  }

  renderShellView();
}
