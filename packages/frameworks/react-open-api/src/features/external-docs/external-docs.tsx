import type {ExternalDocumentationObject} from "../../types"

export interface ExternalDocsProps {
  externalDocs: ExternalDocumentationObject
  label?: string
}

export function ExternalDocs({
  externalDocs,
  label = "Documentation",
}: ExternalDocsProps) {
  if (!externalDocs.url) {
    return null
  }

  return (
    <a
      href={externalDocs.url}
      target="_blank"
      rel="noopener noreferrer"
      className="openapi-external-docs"
    >
      <ExternalLinkIcon />
      <span>{externalDocs.description || label}</span>
    </a>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      className="openapi-external-docs__icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
