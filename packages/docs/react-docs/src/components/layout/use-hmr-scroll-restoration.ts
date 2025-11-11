import {useEffect} from "react"

import {getReactDemoConfig} from "virtual:qui-demo-scope/config"

import {debounce} from "@qualcomm-ui/utils/functions"

/**
 * Sends a message to the backend to store the current scroll position.
 */
export function storeScrollPosition(scrollY: number) {
  if (import.meta.hot && getReactDemoConfig().lazyLoadDevModules) {
    import.meta.hot.send("custom:store-scroll-position", {
      scrollY,
    })
  }
}

/**
 * The backend debounces this, so if a page has multiple demos, it will only emit
 * the stored scroll position once all demos have been rendered.
 */
export function requestSavedScrollPosition() {
  if (import.meta.hot && getReactDemoConfig().lazyLoadDevModules) {
    import.meta.hot.send("custom:request-scroll-position")
  }
}

/**
 * React hook that preserves scroll position across Vite HMR updates.
 * Automatically saves scroll position before updates and restores it after.
 * Requires matching server-side HMR plugin to handle storage.
 *
 * @remarks
 * In dev mode, demos are initially unmounted and load lazily.  When they update and
 * the page reloads, the scroll position is sometimes lost because the demos are no
 * longer rendered (and therefore don't have height).
 */
export function useHmrScrollRestoration() {
  useEffect(() => {
    if (import.meta.hot && getReactDemoConfig().lazyLoadDevModules) {
      const debouncedRestore = debounce((scrollY: number) => {
        if (scrollY) {
          window.scrollTo(0, scrollY)
          console.debug(
            "[react-demo-plugin HMR] restored scroll position",
            scrollY,
          )
          storeScrollPosition(0)
        }
      }, 150)

      function beforeFullReloadHandler() {
        console.debug("storing scroll position")
        import.meta.hot!.send("custom:store-scroll-position", {
          scrollY: window.scrollY,
        })
      }

      import.meta.hot.on("custom:restore-scroll-position", debouncedRestore)
      import.meta.hot.on("vite:invalidate", beforeFullReloadHandler)
      window.addEventListener("beforeunload", beforeFullReloadHandler)
      return () => {
        debouncedRestore.clear()
        import.meta.hot?.off("custom:restore-scroll-position", debouncedRestore)
        import.meta.hot?.off("vite:invalidate", beforeFullReloadHandler)
        window.removeEventListener("beforeunload", beforeFullReloadHandler)
      }
    }
  }, [])
}
