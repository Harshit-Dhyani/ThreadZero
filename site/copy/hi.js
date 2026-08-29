import SHELL from "./hi/shell.js?v=20260828p";
import HOME from "./hi/home.js";
import FLOW from "./hi/flow.js";
import TRACKER from "./hi/tracker.js";
import CONTENT from "./hi/content.js";

export const HI = Object.freeze({
  ...SHELL,
  home: HOME,
  flow: FLOW,
  tracker: TRACKER,
  content: CONTENT
});

export default HI;
