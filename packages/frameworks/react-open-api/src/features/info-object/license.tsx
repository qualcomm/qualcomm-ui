import type {LicenseObject} from "../../types"

export interface LicenseProps {
  license: LicenseObject
}

export function License({license}: LicenseProps) {
  if (!license.name && !license.url) {
    return null
  }

  const content = license.name || "License"

  if (license.url) {
    return (
      <a
        href={license.url}
        target="_blank"
        rel="noopener noreferrer"
        className="openapi-license"
      >
        {content}
      </a>
    )
  }

  return <span className="openapi-license">{content}</span>
}
