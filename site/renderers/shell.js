import { PORTAL_ROUTES } from "../../core/portal-routes.mjs";
import { ROUTE_PRESENTATION, WORKSPACES, workspaceFor } from "../route-presentation.js";

export function renderShell(ctx) {
  const { language, copy, esc, routeLink, routeLabel, icon, officialAnchor, demoAccess } = ctx;

  function renderShellView() {
    const c = copy();
    const currentWorkspace = workspaceFor(ctx.state.route);
    document.documentElement.lang = c.meta.languageCode;
    document.title = `ThreadZero — ${c.meta.title}`;
    document.querySelector("[data-brand-name]").textContent = "ThreadZero";
    document.querySelector("[data-brand-title]").textContent = c.meta.title;
    document.querySelector("[data-brand-qualifier]").textContent = c.meta.qualifier;
    document.querySelector("[data-header-guide-label]").textContent = language === "hi" ? "मार्गदर्शक" : "Guide";
    document.querySelector("[data-header-search-label]").textContent = language === "hi" ? "खोजें / पूछें" : "Search / Ask";
    document.querySelector("[data-language-label]").textContent = c.nav.language;
    document.querySelector("[data-header-menu-label]").textContent = c.nav.services;
    document.querySelectorAll("[data-demo-profile-label]").forEach((demoLabel) => { demoLabel.textContent = demoAccess?.label || (language === "hi" ? "अनाम डेमो" : "Anonymous demo"); });
    const demoCopy = language === "hi" ? {
      eyebrow: "ब्राउज़र-स्थानीय डेमो", title: "काल्पनिक डेमो प्रोफ़ाइल चुनें", intro: "दस्तावेज़ित काल्पनिक क्रेडेंशियल केवल स्थानीय जाँच के लिए हैं। पासवर्ड सहेजा नहीं जाता और कोई नेटवर्क अनुरोध नहीं होता।", close: "डेमो प्रोफ़ाइल मेनू बंद करें", logout: "अनाम डेमो पर लौटें",
      profiles: [["अनाम सत्र", "कोई सहेजी डेमो पहचान नहीं"], ["काल्पनिक डेमो खाता", "डेमो नागरिक · DEMO-08421"], ["स्थानीय डेमो प्रोफ़ाइल", "इस डिवाइस पर तैयारी प्रोफ़ाइल"]]
    } : {
      eyebrow: "Browser-local demo", title: "Choose a fictional demo profile", intro: "Documented fictional credentials are validated only in this browser. The password is never stored and no network request is made.", close: "Close demo profile menu", logout: "Return to anonymous demo",
      profiles: [["Anonymous session", "No saved demo identity"], ["Fictional demo account", "Demo Citizen · DEMO-08421"], ["Local demo profile", "Preparation profile stored on this device"]]
    };
    document.querySelector("[data-demo-access-eyebrow]").textContent = demoCopy.eyebrow;
    document.querySelector("[data-demo-access-title]").textContent = demoCopy.title;
    document.querySelector("[data-demo-access-intro]").textContent = demoCopy.intro;
    document.querySelector("[data-demo-access-close]").setAttribute("aria-label", demoCopy.close);
    document.querySelector("[data-demo-logout]").textContent = demoCopy.logout;
    for (const [id, index] of [["anonymous", 0], ["local", 2]]) {
      const button = document.querySelector(`[data-demo-profile="${id}"]`);
      button.querySelector("strong").textContent = demoCopy.profiles[index][0];
      button.querySelector("span").textContent = demoCopy.profiles[index][1];
    }
    document.querySelector("[data-demo-credential-title]").textContent = language === "hi" ? "काल्पनिक मूल्यांकन पहुँच" : "Fictional evaluator access";
    document.querySelector("[data-demo-credential-help]").textContent = language === "hi" ? "केवल डेमो जानकारी। कोई वास्तविक खाता या नेटवर्क अनुरोध नहीं।" : "Demo information only. No real account or network request.";
    document.querySelector("[data-demo-email-label]").textContent = language === "hi" ? "ईमेल" : "Email";
    document.querySelector("[data-demo-password-label]").textContent = language === "hi" ? "पासवर्ड" : "Password";
    document.querySelector("[data-demo-sign-in]").textContent = language === "hi" ? "काल्पनिक डेमो खोलें" : "Open fictional demo";
    document.querySelector("[data-open-more]").setAttribute("aria-label", c.nav.services);
    const languageSelect = document.querySelector("#languageSelect");
    languageSelect.value = language;
    languageSelect.setAttribute("aria-label", c.nav.language);
    document.querySelector(".brand").setAttribute("aria-label", `ThreadZero, ${c.meta.title}, ${c.nav.home}`);
    document.querySelector(".header-primary-action").textContent = language === "hi" ? "रिपोर्ट शुरू करें" : "Start a report";
    document.querySelector("[data-official-action-strip]").innerHTML = `<div><strong>${language === "hi" ? "वास्तविक वित्तीय साइबर धोखाधड़ी?" : "Actual financial cyber fraud?"}</strong><span>${esc(c.common.callManually)} · ${esc(c.common.noCall)}</span></div>${officialAnchor("officialHome", c.common.officialSite, "official-strip-link")}`;
  
    const primaryNav = document.querySelector("[data-primary-nav]");
    primaryNav.setAttribute("aria-label", c.nav.primary);
    primaryNav.innerHTML = `${Object.entries(WORKSPACES).map(([id, workspace]) => routeLink(workspace.route, workspace[language], `workspace-link${currentWorkspace === id ? " is-current" : ""}`)).join("")}${routeLink("act-now", `${language === "hi" ? "रिपोर्ट शुरू करें" : "Start a report"} ${icon("arrow-right", "icon icon-small")}`, "nav-get-started raw-label")}`;
  
    document.querySelector("[data-mobile-quick-actions]").innerHTML = `
      ${routeLink("act-now", language === "hi" ? "रिपोर्ट" : "Report", "mobile-quick-link")}
      ${routeLink("track", language === "hi" ? "ट्रैक" : "Track", "mobile-quick-link")}
      <button type="button" class="mobile-quick-link" data-open-guide>${language === "hi" ? "मेरी मदद करें" : "Help me"}</button>
      <button type="button" class="mobile-quick-link" data-open-search>${language === "hi" ? "खोजें" : "Search"}</button>`;
  
    document.querySelector("[data-more-title]").textContent = c.nav.moreTitle;
    document.querySelector("[data-more-close]").setAttribute("aria-label", c.nav.closeMenu);
    const moreGroup = (title, links) => `<section class="more-group"><h3>${esc(title)}</h3><div>${links.map(([route, label]) => routeLink(route, label, "more-link")).join("")}</div></section>`;
    document.querySelector("[data-more-links]").innerHTML = Object.entries(WORKSPACES).filter(([id]) => id !== "home").map(([id, workspace]) => moreGroup(
      workspace[language],
      [[workspace.route, workspace[language]], ...PORTAL_ROUTES.filter((route) => ROUTE_PRESENTATION[route.id]?.workspace === id && route.id !== workspace.route).map((route) => [route.id, routeLabel(route.id)])]
    )).join("");
  
    document.querySelector("[data-dialog-title]").textContent = c.flow.submit.dialogTitle;
    document.querySelector("[data-dialog-body]").textContent = c.flow.submit.dialogBody;
    document.querySelector("[data-dialog-cancel]").textContent = c.flow.submit.cancel;
    document.querySelector("[data-dialog-confirm]").textContent = c.flow.submit.confirm;
    renderFooter();
  }
  
  function renderFooter() {
    const c = copy();
    const column = (title, links) => `<section class="footer-column"><h2>${esc(title)}</h2>${links.map(([route, label]) => routeLink(route, label)).join("")}</section>`;
    document.querySelector("[data-shell-footer]").innerHTML = `
      <div class="footer-main">
        <section class="footer-summary" aria-labelledby="footer-title">
          <strong id="footer-title">${esc(c.footer.title)}</strong>
          <span>${esc(c.footer.qualifier)}</span>
          <p>${esc(c.footer.body)}</p>
        </section>
        <nav class="footer-links" aria-label="${esc(c.nav.primary)}">
          ${column(language === "hi" ? "रिपोर्ट और जाँच" : "Report & Check", [["act-now", language === "hi" ? "रिपोर्ट" : "Report"], ["official-tools", language === "hi" ? "जाँच" : "Check"], ["track", language === "hi" ? "ट्रैक" : "Track"], ["guides", routeLabel("guides")]])}
          ${column(language === "hi" ? "सीखें" : "Learn", [["learning-corner", routeLabel("learning-corner")], ["advisories", routeLabel("advisories")], ["safety", routeLabel("safety")], ["volunteers", routeLabel("volunteers")]])}
          ${column(language === "hi" ? "सहायता" : "Help", [["faq", routeLabel("faq")], ["contact", routeLabel("contact")], ["accessibility", routeLabel("accessibility")], ["grievance", routeLabel("grievance")]])}
          ${column(language === "hi" ? "परिचय" : "About", [["about", routeLabel("about")], ["policies", routeLabel("policies")], ["privacy", routeLabel("privacy")], ["disclaimer", routeLabel("disclaimer")]])}
        </nav>
        <aside class="footer-help">
          ${icon("circle-help", "footer-help-icon")}
          <div><strong>${esc(c.footer.helpTitle)}</strong><p>${esc(c.footer.helpBody)}</p></div>
          ${routeLink("contact", `${esc(routeLabel("contact"))} ${icon("arrow-right", "icon icon-small")}`, "text-link raw-label")}
        </aside>
      </div>
      <div class="footer-official"><div><strong>${language === "hi" ? "वास्तविक वित्तीय साइबर धोखाधड़ी?" : "Actual financial cyber fraud?"}</strong><span>${esc(c.common.callManually)}</span></div>${officialAnchor("officialHome", c.common.officialSite, "button button-secondary")}</div>
      <div class="footer-meta"><span>${esc(c.footer.boundary)}</span><span>${esc(c.footer.version)}</span></div>`;
  }

  renderShellView();
}
