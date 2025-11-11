import {isPlatformServer} from "@angular/common"
import {inject, PLATFORM_ID} from "@angular/core"

/**
 * A utility function to determine whether the current rendering context is
 * server-side.
 *
 * This hook internally relies on Angular's `PLATFORM_ID` to check the execution
 * context and evaluates if the current platform is running on the server. It
 * returns a boolean function that can be invoked to check the SSR status
 * dynamically.
 *
 * @returns A function that returns true if the rendering platform is server-side, false otherwise.
 */
export function useSsrCheck(): () => boolean {
  const platformId = inject(PLATFORM_ID)

  return (): boolean => {
    return isPlatformServer(platformId)
  }
}
