import type {FunctionComponent} from "react"

export interface CodeSource {
  code: string
  fileName: string

  /**
   * @default 'tsx'
   */
  language?: string
}

export interface CodeDemoNode {
  component: FunctionComponent
  source: CodeSource[]
}
