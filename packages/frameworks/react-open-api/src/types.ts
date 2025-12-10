/**
 * Re-exports OpenAPI types from @scalar/openapi-types.
 * Uses OpenAPI 3.1 types as the primary target version.
 */
export type {OpenAPI, OpenAPIV3, OpenAPIV3_1} from "@scalar/openapi-types"

import type {OpenAPIV3_1} from "@scalar/openapi-types"

export type SchemaObject = OpenAPIV3_1.SchemaObject
export type ParameterObject = OpenAPIV3_1.ParameterObject
export type RequestBodyObject = OpenAPIV3_1.RequestBodyObject
export type ResponseObject = OpenAPIV3_1.ResponseObject
export type MediaTypeObject = OpenAPIV3_1.MediaTypeObject
export type HeaderObject = OpenAPIV3_1.HeaderObject
export type ExampleObject = OpenAPIV3_1.ExampleObject
export type InfoObject = OpenAPIV3_1.InfoObject
export type ContactObject = OpenAPIV3_1.ContactObject
export type LicenseObject = OpenAPIV3_1.LicenseObject
export type ExternalDocumentationObject =
  OpenAPIV3_1.ExternalDocumentationObject
export type DiscriminatorObject = OpenAPIV3_1.DiscriminatorObject
export type TagObject = OpenAPIV3_1.TagObject
export type ReferenceObject = OpenAPIV3_1.ReferenceObject
