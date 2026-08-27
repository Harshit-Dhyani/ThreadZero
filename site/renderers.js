import { createViewHelpers, getEvidenceCopy, getServiceUi } from "./renderers/helpers.js?v=20260828a";
import { renderShell } from "./renderers/shell.js?v=20260828a";
import { renderPublicRoute } from "./renderers/public.js?v=20260828a";
import { renderFlowRoute } from "./renderers/flow.js?v=20260827b";

export { getEvidenceCopy, getServiceUi };

export function renderPortal(context) {
  const view = { ...context, ...createViewHelpers(context.language, context.state) };
  renderShell(view);
  return renderPublicRoute(view) ?? renderFlowRoute(view) ?? renderPublicRoute({ ...view, state: { ...view.state, route: "home" } });
}
