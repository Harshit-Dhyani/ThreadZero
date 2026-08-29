import SHELL from "./en/shell.ts";
import HOME from "./en/home.ts";
import FLOW from "./en/flow.ts";
import TRACKER from "./en/tracker.ts";
import CONTENT from "./en/content.ts";

export const EN = Object.freeze({
  ...SHELL,
  home: HOME,
  flow: FLOW,
  tracker: TRACKER,
  content: CONTENT
});

