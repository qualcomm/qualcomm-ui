import type {ReactNode} from "react"

import type {ExternalDocumentationObject, InfoObject} from "../../types"

import {InfoDescription} from "./info-description"
import {InfoLinks} from "./info-links"
import {InfoVersion} from "./info-version"

export interface InfoBlockProps {
  children?: ReactNode
  externalDocs?: ExternalDocumentationObject
  id?: string
  info?: InfoObject
  layout?: "modern" | "classic"
}

export function InfoBlock({
  children,
  externalDocs,
  id,
  info,
  layout = "modern",
}: InfoBlockProps) {
  if (!info) {
    return null
  }

  return (
    <div id={id} className="openapi-info-block" data-layout={layout}>
      <div className="openapi-info-block__header">
        {info.title && (
          <h1 className="openapi-info-block__title">{info.title}</h1>
        )}
        {info.version && <InfoVersion version={info.version} />}
      </div>

      {info.description && <InfoDescription description={info.description} />}

      <InfoLinks
        contact={info.contact}
        license={info.license}
        termsOfService={info.termsOfService}
        externalDocs={externalDocs}
      />

      {children && (
        <div className="openapi-info-block__content">{children}</div>
      )}
    </div>
  )
}
