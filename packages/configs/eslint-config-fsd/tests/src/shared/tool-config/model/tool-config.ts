export interface ToolConfig {
  docsPathname: string
  id: number
  pathname: string
  title: string
}

const basePath = "/layout-checker"

/**
 * Returns a route relative to the base path of the tool.
 */
function getToolRoute(endpoint: string) {
  return `${basePath}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`
}

export const toolConfig: ToolConfig = {
  docsPathname: `${basePath}/support`,
  id: 1,
  pathname: basePath,
  title: "Layout Checker",
}

export const toolRoutes = {
  approveJobs: getToolRoute("approve-jobs"),
  createJob: getToolRoute("create-job"),
  dashboard: basePath,
  jobDetails: (id: string) => getToolRoute(`job-details/${id}`),
  jobHistory: getToolRoute("job-history"),
}
