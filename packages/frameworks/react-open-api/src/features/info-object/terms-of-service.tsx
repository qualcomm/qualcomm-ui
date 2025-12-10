export interface TermsOfServiceProps {
  label?: string
  url: string
}

export function TermsOfService({
  label = "Terms of Service",
  url,
}: TermsOfServiceProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="openapi-terms-of-service"
    >
      {label}
    </a>
  )
}
