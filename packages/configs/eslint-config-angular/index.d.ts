import type {ConfigObject} from "@eslint/core"

interface AngularConfigExport {
  configs: {
    /**
     * Formatting for Angular templates with Angular parser. Enforces alphabetical
     * ordering of Angular template attributes, template formatting with oxfmt
     * (`prettier` alternative), and self-closing component tags.
     */
    templateRecommended: ConfigObject[]

    /**
     * TypeScript rules for Angular components and services.
     * Includes inline template processing.
     */
    typescriptRecommended: ConfigObject[]
  }
}

declare const angularConfig: AngularConfigExport
export default angularConfig
