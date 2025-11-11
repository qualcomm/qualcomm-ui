import {useRef} from "react"

import {page} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"

import {Portal} from "./portal"
import {PortalContextProvider} from "./portal-context"

describe("Portal", () => {
  test("renders children to document.body by default", async () => {
    render(
      <Portal>
        <div data-test-id="portal-content">Portal Content</div>
      </Portal>,
    )

    const content = page.getByTestId("portal-content")
    await expect.element(content).toBeVisible()
    await expect.element(content).toBeInTheDocument()
  })

  test("renders children to custom container via ref", async () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)

      return (
        <div>
          <div ref={containerRef} data-test-id="custom-container" />
          <Portal container={containerRef}>
            <div data-test-id="portal-content">Portal Content</div>
          </Portal>
        </div>
      )
    }

    render(<TestComponent />)

    const content = page.getByTestId("portal-content")
    await expect.element(content).toBeVisible()
  })

  test("renders children to custom container via element", async () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)

      return (
        <div>
          <div ref={containerRef} data-test-id="custom-container" />
          <Portal container={containerRef.current}>
            <div data-test-id="portal-content">Portal Content</div>
          </Portal>
        </div>
      )
    }

    render(<TestComponent />)

    const content = page.getByTestId("portal-content")
    await expect.element(content).toBeVisible()
  })

  test("renders children inline when disabled", async () => {
    render(
      <div data-test-id="wrapper">
        <Portal disabled>
          <div data-test-id="portal-content">Portal Content</div>
        </Portal>
      </div>,
    )

    const content = page.getByTestId("portal-content")
    await expect.element(content).toBeVisible()
    await expect.element(content).toBeInTheDocument()
  })

  test("uses context container when provided", async () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)

      return (
        <div>
          <div ref={containerRef} data-test-id="context-container" />
          <PortalContextProvider value={{container: containerRef}}>
            <Portal>
              <div data-test-id="portal-content">Portal Content</div>
            </Portal>
          </PortalContextProvider>
        </div>
      )
    }

    render(<TestComponent />)

    const content = page.getByTestId("portal-content")
    await expect.element(content).toBeVisible()
  })

  test("returns null when container ref is null", async () => {
    function TestComponent() {
      const containerRef = useRef<HTMLDivElement>(null)

      return (
        <Portal container={containerRef}>
          <div data-test-id="portal-content">Portal Content</div>
        </Portal>
      )
    }

    render(<TestComponent />)

    await expect
      .element(page.getByTestId("portal-content"))
      .not.toBeInTheDocument()
  })
})
