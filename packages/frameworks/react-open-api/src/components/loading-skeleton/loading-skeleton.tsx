export interface LoadingSkeletonProps {
  className?: string
  height?: string | number
  variant?: "text" | "rectangular" | "circular"
  width?: string | number
}

export function LoadingSkeleton({
  className,
  height,
  variant = "text",
  width,
}: LoadingSkeletonProps) {
  const style: React.CSSProperties = {}

  if (width) {
    style.width = typeof width === "number" ? `${width}px` : width
  }

  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height
  }

  return (
    <div
      className={`openapi-loading-skeleton ${className || ""}`}
      data-variant={variant}
      style={style}
      aria-hidden="true"
    />
  )
}
