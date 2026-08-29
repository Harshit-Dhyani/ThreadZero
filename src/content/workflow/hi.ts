import SHELL from "./hi/shell.ts";
import HOME from "./hi/home.ts";
import FLOW from "./hi/flow.ts";
import TRACKER from "./hi/tracker.ts";
import CONTENT from "./hi/content.ts";

export const HI = Object.freeze({
  ...SHELL,
  home: HOME,
  flow: FLOW,
  tracker: TRACKER,
  content: CONTENT
});

