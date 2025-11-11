import type {ComponentPropsWithRef, ReactElement} from "react"

interface QLogoProps extends ComponentPropsWithRef<"svg"> {}

export function QLogo(props: QLogoProps): ReactElement {
  return (
    <>
      <svg
        fill="none"
        height={24}
        width={21}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          clipRule="evenodd"
          d="M10.024 0C4.477 0 0 4.391 0 10.262c0 5.874 4.477 10.265 10.024 10.265.95 0 1.866-.132 2.733-.375l1.084 2.864c.11.308.33.503.742.503h1.728c.412 0 .716-.28.522-.812l-1.41-3.746c2.782-1.78 4.623-4.933 4.623-8.699C20.046 4.392 15.572 0 10.024 0Zm3.103 12.864 1.26 3.346c1.612-1.353 2.585-3.479 2.585-5.948 0-4.25-2.885-7.495-6.948-7.495-4.065 0-6.948 3.245-6.948 7.495 0 4.252 2.883 7.495 6.948 7.495.61 0 1.196-.074 1.746-.213l-1.665-4.4c-.19-.531.14-.812.551-.812h1.647c.494 0 .714.251.824.532Z"
          fill="#2D3EE0"
          fillRule="evenodd"
        />
      </svg>
    </>
  )
}
