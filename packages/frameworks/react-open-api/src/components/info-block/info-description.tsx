export interface InfoDescriptionProps {
  description: string
}

export function InfoDescription({description}: InfoDescriptionProps) {
  return (
    <div className="openapi-info-description">
      <p>{description}</p>
    </div>
  )
}
