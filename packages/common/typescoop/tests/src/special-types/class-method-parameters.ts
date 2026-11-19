export type DocsEnvironment = "test" | "stage" | "prod"

/**
 * @public
 */
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

/**
 * @public
 */
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

/**
 * @public
 */
export interface CloudDocsSdkOptions {
  /**
   * The file handler API url.
   */
  baseUrl: string
}

/**
 * @public
 */
export class CloudDocsSdk {
  constructor(public readonly opts: CloudDocsSdkOptions) {}

  /**
   * Upload files.
   *
   * @param archivePath
   */
  uploadFiles(
    {archivePath, environment, service}: UploadFileOptions,
    getFilesOptions: GetFilesOptions,
  ): boolean {
    return !!(archivePath && environment && service && getFilesOptions)
  }

  /**
   * Zip files.
   *
   * @param directory the file directory to zip up.
   * @param archiveName name of the zip file to upload.
   */
  zipFiles(directory: string, archiveName: string = "site-data.zip"): boolean {
    return !!(directory && archiveName)
  }
}

/**
 * @public
 */
export interface SignatureParamsObj {
  /**
   * Signature
   *
   * @param first the first parameter.
   * @param second the second parameter.
   */
  sig: (first: string, second: GetFilesOptions) => void
}
