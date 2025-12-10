export interface InfoVersionProps {
  version: string
}

export function InfoVersion({version}: InfoVersionProps) {
  return <span className="openapi-info-version">v{version}</span>
}
