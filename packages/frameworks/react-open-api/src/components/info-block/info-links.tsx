import type {
  ContactObject,
  ExternalDocumentationObject,
  LicenseObject,
} from "../../types"

export interface InfoLinksProps {
  contact?: ContactObject
  externalDocs?: ExternalDocumentationObject
  license?: LicenseObject
  termsOfService?: string
}

export function InfoLinks({
  contact,
  externalDocs,
  license,
  termsOfService,
}: InfoLinksProps) {
  const hasLinks =
    contact?.url ||
    contact?.email ||
    license?.url ||
    license?.name ||
    termsOfService ||
    externalDocs?.url

  if (!hasLinks) {
    return null
  }

  return (
    <div className="openapi-info-links">
      {contact?.email && (
        <a
          href={`mailto:${contact.email}`}
          className="openapi-info-links__item"
        >
          <EmailIcon />
          <span>{contact.name || contact.email}</span>
        </a>
      )}

      {contact?.url && (
        <a
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className="openapi-info-links__item"
        >
          <LinkIcon />
          <span>{contact.name || "Contact"}</span>
        </a>
      )}

      {license && (license.url || license.name) && (
        <a
          href={license.url}
          target="_blank"
          rel="noopener noreferrer"
          className="openapi-info-links__item"
        >
          <LicenseIcon />
          <span>{license.name || "License"}</span>
        </a>
      )}

      {termsOfService && (
        <a
          href={termsOfService}
          target="_blank"
          rel="noopener noreferrer"
          className="openapi-info-links__item"
        >
          <DocumentIcon />
          <span>Terms of Service</span>
        </a>
      )}

      {externalDocs?.url && (
        <a
          href={externalDocs.url}
          target="_blank"
          rel="noopener noreferrer"
          className="openapi-info-links__item"
        >
          <ExternalLinkIcon />
          <span>{externalDocs.description || "Documentation"}</span>
        </a>
      )}
    </div>
  )
}

function EmailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function LicenseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="M9 9h.01" />
      <path d="M15 15h.01" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}
