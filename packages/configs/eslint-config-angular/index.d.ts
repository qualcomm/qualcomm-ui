import type {ConfigObject} from "@eslint/core"

interface AngularConfigExport {
  configs: {
    /**
     * Base configuration for Angular HTML templates.
     * Required for all template configs to work.
     */
    baseTemplate: ConfigObject

    /**
     * Base configuration for Angular TypeScript files.
     * Required for Angular TypeScript rules to work.
     */
    baseTypescript: ConfigObject

    /**
     * Enforce alphabetical ordering of Angular template attributes
     * (structural directives, template refs, bindings, etc).
     */
    templateAttributeOrder: ConfigObject

    /**
     * Prettier formatting for Angular templates with Angular parser.
     */
    templatePrettier: ConfigObject

    /**
     * Enforce self-closing tags in Angular templates where applicable.
     */
    templateSelfClosingTags: ConfigObject

    /**
     * TypeScript rules for Angular components and services.
     * Includes inline template processing.
     */
    typescript: ConfigObject
  }
}

declare const angularConfig: AngularConfigExport
export default angularConfig
