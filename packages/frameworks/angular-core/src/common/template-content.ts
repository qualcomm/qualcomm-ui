import type {TemplateRef} from "@angular/core"

/**
 * An input type that can be a string or TemplateRef.
 */
export type TemplateContent<T> = string | TemplateRef<T>
