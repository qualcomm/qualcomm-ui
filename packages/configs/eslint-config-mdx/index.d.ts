import type {ConfigObject} from "@eslint/core"

interface MdxConfigExport {
  configs: {
    recommended: ConfigObject
  }
}

declare const mdxConfig: MdxConfigExport
export default mdxConfig
