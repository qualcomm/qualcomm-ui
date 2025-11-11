import {isPlatformBrowser} from "@angular/common"
import {inject, PLATFORM_ID} from "@angular/core"

/**
 * A utility function to determine whether the current rendering context is
 * client-side.
 *
 * This hook internally relies on Angular's `PLATFORM_ID` to check the execution
 * context and evaluates if the current platform is running on the client. It
 * returns a boolean function that can be invoked to check the CSR status
 * dynamically.
 *
 * @returns A function that returns true if the rendering platform is client-side, false otherwise.
 */
export function useCsrCheck(): () => boolean {
  const platformId = inject(PLATFORM_ID)

  return (): boolean => {
    return isPlatformBrowser(platformId)
  }
}
