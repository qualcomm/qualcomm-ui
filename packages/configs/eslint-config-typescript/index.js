import base from "./base.js"
import jsdoc from "./jsdoc.js"
import namingConventions from "./naming-conventions.js"
import performance from "./performance.js"
import sortKeys from "./sort-keys.js"
import strictExports from "./strict-exports.js"
import styleGuide from "./style-guide.js"
import typeChecks from "./type-checks.js"

export default {
  configs: {
    base,
    jsdoc,
    namingConventions,
    performance,
    recommended: [base, styleGuide, sortKeys, typeChecks, namingConventions],
    sortKeys,
    strictExports,
    styleGuide,
    typeChecks,
  },
}
