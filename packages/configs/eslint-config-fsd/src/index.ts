import type {Config} from "eslint/config"

import recommended from "./recommended.js"

const config: {
  configs: {
    recommended: Config[]
  }
} = {configs: {recommended}}

export default config
