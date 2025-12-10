export interface SchemaEnumPropertyItemProps {
  description?: string
  label: string
}

export function SchemaEnumPropertyItem({
  description,
  label,
}: SchemaEnumPropertyItemProps) {
  return (
    <li className="openapi-schema-enum-item">
      <div className="openapi-schema-enum-item__content">
        <span className="openapi-schema-enum-item__label">{label}</span>
        {description && (
          <span className="openapi-schema-enum-item__description">
            {description}
          </span>
        )}
      </div>
    </li>
  )
}
