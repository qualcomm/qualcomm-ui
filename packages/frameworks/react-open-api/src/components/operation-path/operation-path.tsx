export interface OperationPathProps {
  deprecated?: boolean
  path: string
}

export function OperationPath({deprecated, path}: OperationPathProps) {
  const segments = parsePath(path)

  return (
    <span
      className="openapi-operation-path"
      data-deprecated={deprecated || undefined}
    >
      {segments.map((segment, index) => (
        <span
          key={index}
          className="openapi-operation-path__segment"
          data-type={segment.type}
        >
          {segment.value}
        </span>
      ))}
    </span>
  )
}

interface PathSegment {
  type: "static" | "parameter"
  value: string
}

function parsePath(path: string): PathSegment[] {
  const segments: PathSegment[] = []
  const regex = /\{([^}]+)\}|([^{]+)/g
  let match

  while ((match = regex.exec(path)) !== null) {
    if (match[1]) {
      segments.push({type: "parameter", value: `{${match[1]}}`})
    } else if (match[2]) {
      segments.push({type: "static", value: match[2]})
    }
  }

  return segments
}
