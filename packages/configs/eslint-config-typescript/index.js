import {typescriptLanguageOptions} from "./base.js"
import jsdoc from "./jsdoc.js"
import namingConventions from "./naming-conventions.js"
import sortKeys from "./sort-keys.js"
import strictExports from "./strict-exports.js"
import styleGuide from "./style-guide.js"
import typeChecks from "./type-checks.js"

const [namingConventionsConfig] = namingConventions
const [sortKeysConfig] = sortKeys
const [styleGuideConfig] = styleGuide
const [typeChecksConfig] = typeChecks

const recommended = {
  languageOptions: typescriptLanguageOptions,
  name: "qui-typescript-recommended",
  plugins: {
    ...namingConventionsConfig.plugins,
    ...sortKeysConfig.plugins,
    ...styleGuideConfig.plugins,
    ...typeChecksConfig.plugins,
  },
  rules: {
    ...namingConventionsConfig.rules,
    ...sortKeysConfig.rules,
    ...styleGuideConfig.rules,
    ...typeChecksConfig.rules,
  },
}

export default {
  configs: {
    jsdoc,
    namingConventions,
    recommended,
    sortKeys,
    strictExports,
    styleGuide,
    typeChecks,
  },
}
