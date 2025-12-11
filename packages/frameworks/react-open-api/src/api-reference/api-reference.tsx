import type {ReactNode} from "react"

import {InfoBlock} from "../components/info-block"
import {Model} from "../components/model"
import {Operation} from "../components/operation"
import {Tag} from "../components/tag"
import {OpenApiProvider, type RenderLink} from "../context"
import {
  type ParsedOperation,
  useOpenApiDocument,
} from "../hooks/use-openapi-document"
import type {OpenAPIV3_1} from "../types"

export interface ApiReferenceProps {
  /**
   * Base path for internal navigation links.
   */
  basePath?: string

  /**
   * Additional class name.
   */
  className?: string

  /**
   * The OpenAPI document to render.
   */
  document: OpenAPIV3_1.Document

  /**
   * Whether to hide models section.
   * @default false
   */
  hideModels?: boolean

  /**
   * Layout variant.
   * @default 'modern'
   */
  layout?: "modern" | "classic"

  /**
   * Callback fired when navigating to a section.
   */
  onNavigate?: (id: string) => void

  /**
   * Current pathname for navigation highlighting.
   */
  pathname?: string

  /**
   * Custom link renderer for client-side routing.
   */
  renderLink?: RenderLink

  /**
   * Custom content to render in the right column for each operation.
   */
  renderOperationContent?: (operation: ParsedOperation) => ReactNode
}

export function ApiReference({
  basePath,
  className,
  document,
  hideModels = false,
  layout = "modern",
  onNavigate,
  pathname,
  renderLink,
  renderOperationContent,
}: ApiReferenceProps) {
  const parsed = useOpenApiDocument(document)

  if (!parsed) {
    return null
  }

  const content = (
    <div
      className={`openapi-api-reference ${className || ""}`}
      data-layout={layout}
    >
      {/* Info Section */}
      <InfoBlock
        id="info"
        info={parsed.info}
        externalDocs={parsed.externalDocs}
        layout={layout}
      />

      {/* Tags & Operations */}
      <div className="openapi-api-reference__content">
        {parsed.tags.map((tag) => (
          <Tag
            key={tag.name}
            id={`tag-${slugify(tag.name)}`}
            name={tag.name}
            description={tag.description}
            layout={layout}
          >
            {tag.operations.map((op) => (
              <Operation
                key={op.id}
                id={`operation-${op.id}`}
                method={
                  op.method.toUpperCase() as
                    | "GET"
                    | "POST"
                    | "PUT"
                    | "PATCH"
                    | "DELETE"
                    | "OPTIONS"
                    | "HEAD"
                }
                path={op.path}
                summary={op.summary}
                description={op.description}
                parameters={op.parameters}
                requestBody={op.requestBody}
                responses={op.responses}
                deprecated={op.deprecated}
                breadcrumb={[tag.name, op.operationId || op.path]}
              >
                {renderOperationContent?.(op)}
              </Operation>
            ))}
          </Tag>
        ))}
      </div>

      {/* Models Section */}
      {!hideModels && parsed.models.length > 0 && (
        <div className="openapi-api-reference__models">
          <h2 className="openapi-api-reference__models-title">Models</h2>
          {parsed.models.map((model) => (
            <Model
              key={model.name}
              id={`model-${slugify(model.name)}`}
              name={model.name}
              schema={model.schema}
              layout={layout}
            />
          ))}
        </div>
      )}
    </div>
  )

  // Wrap with provider if custom props are provided
  if (renderLink || basePath || pathname || onNavigate) {
    return (
      <OpenApiProvider
        renderLink={renderLink}
        basePath={basePath}
        pathname={pathname}
        onNavigate={onNavigate}
      >
        {content}
      </OpenApiProvider>
    )
  }

  return content
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
