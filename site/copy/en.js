import SHELL from "./en/shell.js";
import HOME from "./en/home.js";
import FLOW from "./en/flow.js";
import TRACKER from "./en/tracker.js";
import CONTENT from "./en/content.js";

export const EN = Object.freeze({
  ...SHELL,
  home: HOME,
  flow: FLOW,
  tracker: TRACKER,
  content: CONTENT
});

export default EN;
