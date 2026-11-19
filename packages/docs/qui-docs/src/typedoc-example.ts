export type WeightUnit = "kg" | "lb"

/**
 * Represents a dog with its properties.
 */
export interface Dog {
  /**
   * The age of the dog in human years.
   */
  age: number

  /**
   * The breed of the dog.
   */
  breed?: string

  /**
   * The name of the dog.
   */
  name: string

  /**
   * The weight of the dog. Refer to {@link weightUnit} for unit type information.
   */
  weight?: number

  /**
   * The unit type of the {@link weight} field.
   *
   * @option `'kg'`: kilograms.
   * @option `'lb'`: pounds.
   */
  weightUnit?: WeightUnit
}

export interface OptionTagExample {
  /**
   * The unit type of the weight field.
   *
   * @option `'kg'`: kilograms.
   * @option `'lb'`: pounds.
   */
  weightUnit: WeightUnit
}

export interface Option {
  /**
   * Unique identifier for the option.
   */
  id: string

  /**
   * Nested options.
   *
   * @inheritDoc
   */
  options?: Option[]

  /**
   * Option value.
   */
  value: string
}

export interface DefaultTagExample {
  /**
   * Example property.
   *
   * @default 0
   */
  age?: number
}

export interface LinkExample {
  /**
   * Visit {@link https://google.com this external link} to learn more.
   */
  externalLink?: string

  /**
   * Refer to the {@link externalLink} property.
   */
  internalLink?: string
}

export interface SeeTagExample {
  /**
   * @see {@link someOtherPropExample}
   */
  otherPropExample?: string

  /**
   * Another prop.
   */
  someOtherPropExample?: string
}

export interface SinceExample {
  /**
   * Foo.
   *
   * @since 3.10.0
   */
  foo: string
}

export interface DeprecatedTagExample {
  /**
   * The size of the element. Use {@link size} instead.
   *
   * @deprecated
   */
  legacySize?: number

  /**
   * The size of the element.
   */
  size?: number
}

export interface CustomTagExample {
  /**
   * Called when the value changes.
   *
   * @custom (value: string) => void
   */
  onValueChange?: <T extends string = string>(value: T) => void
}

export interface HiddenTagExample {
  /**
   * Hidden from the docs.
   *
   * @internal
   */
  internalState?: unknown

  /**
   * Shown in the docs.
   */
  label?: string
}

export type DocsEnvironment = "test" | "stage" | "prod"

export interface ZipFileOptions {
  /**
   * name to use for the local zip file.
   *
   * @default `site-data.zip`
   */
  archiveName?: string

  /**
   * the file directory to zip up.
   */
  directory: string
}

export interface UploadFileOptions {
  /**
   * Relative path to the local zip file that will be generated.
   */
  archivePath: string

  /**
   * Deploy environment.
   */
  environment: DocsEnvironment

  /**
   * Name of the service. Must match one of the predefined service names in the
   * deployed handler.
   */
  service: string
}

export interface GetFilesOptions {
  /**
   * Deploy environment.
   */
  environment: DocsEnvironment

  /**
   * Name of the service. Must match one of the predefined service names in the
   * deployed handler.
   */
  service: string
}

export interface CloudDocsSdkOptions {
  /**
   * The file handler API url.
   */
  baseUrl: string
}

export class CloudDocsSdk {
  constructor(public readonly opts: CloudDocsSdkOptions) {}

  /**
   * Zip files.
   */
  zipFiles(_opts: ZipFileOptions): boolean {
    return false
  }

  /**
   * Upload files
   *
   * @param archivePath test1
   * @param environment test2
   * @param service test3
   */
  uploadFiles(_opts: UploadFileOptions): boolean {
    return true
  }

  /**
   * Download files
   */
  getServiceFiles(_opts: GetFilesOptions) {
    return {} as any
  }
}

export interface TokenDetail {
  /**
   * Access token to be used for making API calls
   */
  accessToken: string
  /**
   * name of the company the user is associated with
   */
  companyName?: string
  /**
   * Expiration time represented as unix time (in milliseconds)
   */
  expiresAt: number
  /**
   * Time in Utc when the access token was created
   */
  hostTimeUtc: string
  /**
   * Id of the company the user is associated with
   */
  partyId?: number
  /**
   * Token for getting a new token if the access token has expired
   */
  refreshToken: string
  /**
   * Name of the user to whom the access token belongs to
   */
  userName: string
}

export interface TokenManager {
  /**
   * Get token
   *
   * @returns should link to property {@link refreshToken}
   */
  getToken(): string
  /**
   * Save token
   *
   * @param tokenString - should link to header {@link TokenDetail}
   * @returns true if able to save token successfully and false on failure
   */
  saveToken(tokenString: string): boolean
}
