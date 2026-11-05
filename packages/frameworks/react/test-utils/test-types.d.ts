import "react"

declare module "react" {
  interface DOMAttributes {
    "data-test-id"?: string | undefined
  }
}
