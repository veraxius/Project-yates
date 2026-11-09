// Single switch that decides whether search engines may index this deployment.
//
//   ROBOTS_ALLOW_INDEX=true   -> the FINAL public site: indexing allowed
//   anything else / not set   -> staging, previews, local: indexing blocked
//
// Default is OFF on purpose, so a staging copy is never indexed by accident.
// Set it to "true" ONLY on the production deployment, before it is built
// (Railway rebuilds and redeploys when a variable changes).
export function allowIndexing(): boolean {
  return process.env.ROBOTS_ALLOW_INDEX === "true";
}
