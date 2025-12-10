import type {ContactObject} from "../../types"

export interface ContactProps {
  contact: ContactObject
}

export function Contact({contact}: ContactProps) {
  if (!contact.name && !contact.email && !contact.url) {
    return null
  }

  return (
    <div className="openapi-contact">
      {contact.name && (
        <span className="openapi-contact__name">{contact.name}</span>
      )}

      {contact.email && (
        <a href={`mailto:${contact.email}`} className="openapi-contact__email">
          {contact.email}
        </a>
      )}

      {contact.url && (
        <a
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className="openapi-contact__url"
        >
          {contact.url}
        </a>
      )}
    </div>
  )
}
