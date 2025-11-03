import baseTemplate from "./base-template.js"
import baseTypescript from "./base-typescript.js"
import templateAttributeOrder from "./template-attribute-order.js"
import templatePrettier from "./template-prettier.js"
import templateSelfClosingTags from "./template-self-closing-tags.js"
import typescript from "./typescript.js"

export default {
  configs: {
    /**
     * Base configuration for Angular HTML templates.
     * Required for all template configs to work.
     */
    baseTemplate,

    /**
     * Base configuration for Angular TypeScript files.
     * Required for Angular TypeScript rules to work.
     */
    baseTypescript,

    /**
     * Enforce alphabetical ordering of Angular template attributes
     * (structural directives, template refs, bindings, etc).
     */
    templateAttributeOrder,

    /**
     * Prettier formatting for Angular templates with Angular parser.
     */
    templatePrettier,

    /**
     * Enforce self-closing tags in Angular templates where applicable.
     */
    templateSelfClosingTags,

    /**
     * TypeScript rules for Angular components and services.
     * Includes inline template processing.
     */
    typescript,
  },
}