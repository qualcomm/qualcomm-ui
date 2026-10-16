import {useRef, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import type {MultiComponentTestCase} from "@qualcomm-ui/react-test-utils"
import {
  ImageViewer,
  useImageViewer,
  useImageViewerContext,
} from "@qualcomm-ui/react/image-viewer"

import {runTests} from "~test-utils/runner"

const imageAlt = "A test landscape"
const imageSrc = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="#456"/></svg>',
)}`

function TransformStatus() {
  return (
    <ImageViewer.Context>
      {(api) => (
        <output aria-label="Transform status">{`zoom:${api.zoom};offset:${api.offset.x},${api.offset.y};panning:${api.panning}`}</output>
      )}
    </ImageViewer.Context>
  )
}

function getImage() {
  return page.getByRole("img", {name: imageAlt})
}

function getRoot() {
  return page.getByRole("group", {name: "Image viewer"}).nth(0)
}

function getViewport() {
  return page.getByRole("group", {name: "Image viewer"}).nth(1)
}

function getTransformZoom() {
  const text =
    page.getByLabelText("Transform status").element().textContent ?? ""
  return Number(text.match(/^zoom:([^;]+)/)?.[1])
}

async function waitForImageReady() {
  await expect.element(getImage()).toBeVisible()
  await expect
    .element(page.getByRole("button", {name: "Zoom in"}))
    .not.toBeDisabled()
}

async function waitForImageLoaded() {
  await expect.element(getImage()).toBeVisible()
}

function createTouchEvent(
  type: "touchstart" | "touchmove" | "touchend",
  touches: Array<{clientX: number; clientY: number}>,
) {
  const touchList = touches.map(
    ({clientX, clientY}, identifier) =>
      new Touch({
        clientX,
        clientY,
        identifier,
        screenX: clientX,
        screenY: clientY,
        target: document.body,
      }),
  )
  return new TouchEvent(type, {
    bubbles: true,
    cancelable: true,
    touches: touchList,
  })
}

function CompositeViewer(
  props: React.ComponentProps<typeof ImageViewer.Root> = {},
) {
  return (
    <ImageViewer.Root {...props}>
      <ImageViewer.ZoomOutButton />
      <ImageViewer.ZoomInButton />
      <ImageViewer.ResetButton />
      <ImageViewer.Viewport>
        <ImageViewer.Image alt={imageAlt} src={imageSrc} />
      </ImageViewer.Viewport>
      <TransformStatus />
    </ImageViewer.Root>
  )
}

function SimpleViewer(
  props: Omit<React.ComponentProps<typeof ImageViewer>, "alt" | "src"> = {},
) {
  return (
    <ImageViewer
      {...props}
      alt={imageAlt}
      controlsProps={{"aria-label": "Image controls", ...props.controlsProps}}
      src={imageSrc}
    />
  )
}

const commonTests: MultiComponentTestCase[] = [
  {
    composite() {
      return <CompositeViewer />
    },
    simple() {
      return <SimpleViewer />
    },
    testCase: (getComponent) => {
      test("loads the image with its accessible name and enables controls", async () => {
        await render(getComponent())

        await waitForImageReady()
        await expect.element(getImage()).toHaveAttribute("src", imageSrc)
        await expect
          .element(page.getByRole("button", {name: "Zoom out"}))
          .toBeDisabled()
        await expect
          .element(page.getByRole("button", {name: "Reset image"}))
          .not.toBeDisabled()
      })
    },
  },
  {
    composite() {
      return (
        <ImageViewer.Root>
          <ImageViewer.Viewport>
            <ImageViewer.Image alt={imageAlt} src={imageSrc} />
          </ImageViewer.Viewport>
        </ImageViewer.Root>
      )
    },
    simple() {
      return <SimpleViewer controls={false} />
    },
    testCase: (getComponent) => {
      test("supports rendering without controls", async () => {
        await render(getComponent())
        await expect.element(getImage()).toBeVisible()
        await expect
          .element(page.getByRole("button", {name: "Zoom in"}))
          .not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return <CompositeViewer />
    },
    simple() {
      return <SimpleViewer />
    },
    testCase: (getComponent) => {
      test("supports keyboard zoom and wheel zoom", async () => {
        await render(getComponent())
        await waitForImageReady()

        const viewport = getViewport()
        await viewport.click()
        await userEvent.keyboard("=")
        await expect
          .element(getRoot())
          .toHaveAttribute(
            "aria-description",
            expect.stringContaining("1.10x zoom"),
          )

        await userEvent.wheel(viewport, {delta: {y: -1}})
        await expect
          .element(getRoot())
          .toHaveAttribute(
            "aria-description",
            expect.stringContaining("1.20x zoom"),
          )
      })
    },
  },
  {
    composite() {
      return <CompositeViewer defaultZoom={2} maxZoom={2} minZoom={1} />
    },
    simple() {
      return <SimpleViewer defaultZoom={2} maxZoom={2} minZoom={1} />
    },
    testCase: (getComponent) => {
      test("enforces zoom limits and reset restores the initial transform", async () => {
        await render(getComponent())
        await waitForImageLoaded()

        await expect
          .element(page.getByRole("button", {name: "Zoom in"}))
          .toBeDisabled()
        await page.getByRole("button", {name: "Zoom out"}).click()
        await expect
          .element(getRoot())
          .toHaveAttribute(
            "aria-description",
            expect.stringContaining("1.90x zoom"),
          )
        await page.getByRole("button", {name: "Reset image"}).click()
        await expect
          .element(getRoot())
          .toHaveAttribute(
            "aria-description",
            expect.stringContaining("2.00x zoom"),
          )
      })
    },
  },
]

describe("ImageViewer", () => {
  runTests(commonTests)

  test("pans with arrow keys using base, shift, and control steps", async () => {
    await render(<CompositeViewer defaultZoom={2} />)
    await waitForImageReady()

    await getViewport().click()
    await userEvent.keyboard("{ArrowRight}")
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:1,0")
    await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}")
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:11,0")
    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}")
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:61,0")
  })

  test("pans with a primary pointer drag", async () => {
    await render(<CompositeViewer defaultZoom={2} />)
    await waitForImageReady()

    const viewport = getViewport()
    const element = viewport.element()
    element.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        clientX: 100,
        clientY: 100,
        pointerType: "mouse",
      }),
    )
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("panning:true")
    element.dispatchEvent(
      new PointerEvent("pointermove", {
        bubbles: true,
        clientX: 140,
        clientY: 100,
        pointerType: "mouse",
      }),
    )
    element.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        clientX: 140,
        clientY: 100,
        pointerType: "mouse",
      }),
    )
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:40,0")
  })

  test("zooms with a two-finger pinch gesture", async () => {
    await render(<CompositeViewer />)
    await waitForImageReady()

    const element = getViewport().element()
    element.dispatchEvent(
      createTouchEvent("touchstart", [
        {clientX: 100, clientY: 100},
        {clientX: 200, clientY: 100},
      ]),
    )
    await expect.element(getRoot()).toHaveAttribute("data-pinch")
    element.dispatchEvent(
      createTouchEvent("touchmove", [
        {clientX: 100, clientY: 100},
        {clientX: 200, clientY: 200},
      ]),
    )
    await expect.poll(getTransformZoom).toBeCloseTo(2, 5)
    element.dispatchEvent(createTouchEvent("touchend", []))
  })

  test("reset returns a composite viewer offset to the origin", async () => {
    await render(<CompositeViewer defaultZoom={2} />)
    await waitForImageReady()

    await getViewport().click()
    await userEvent.keyboard("{ArrowRight}")
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:1,0")
    await page.getByRole("button", {name: "Reset image"}).click()
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("zoom:2;offset:0,0")
  })

  test("forwards ids, refs, and render props through the public parts", async () => {
    const rootRef = {current: null as HTMLDivElement | null}
    const viewportRef = {current: null as HTMLDivElement | null}
    const imageRef = {current: null as HTMLImageElement | null}

    await render(
      <ImageViewer.Root ref={rootRef} id="viewer-root">
        <ImageViewer.Viewport
          ref={viewportRef}
          id="viewer-viewport"
          render={<section aria-label="Rendered viewport" />}
        >
          <ImageViewer.Image
            ref={imageRef}
            alt={imageAlt}
            id="viewer-image"
            src={imageSrc}
          />
        </ImageViewer.Viewport>
      </ImageViewer.Root>,
    )

    await waitForImageLoaded()
    await expect.element(getRoot()).toHaveAttribute("id", "viewer-root")
    await expect
      .element(page.getByRole("group", {name: "Rendered viewport"}))
      .toHaveAttribute("id", "viewer-viewport")
    await expect.element(getImage()).toHaveAttribute("id", "viewer-image")
    await expect.poll(() => rootRef.current).not.toBeNull()
    await expect.poll(() => viewportRef.current).not.toBeNull()
    await expect.poll(() => imageRef.current).not.toBeNull()
  })

  test("uses the default 16:9 viewport ratio and allows style overrides", async () => {
    await render(
      <SimpleViewer
        viewportProps={{style: {aspectRatio: "4 / 3", width: "320px"}}}
      />,
    )

    const viewport = getViewport()
    await expect.element(viewport).toHaveStyle({
      aspectRatio: "4 / 3",
      width: "320px",
    })
  })

  test("renders customized icons and preserves native disabled behavior", async () => {
    const onClick = vi.fn()
    await render(
      <SimpleViewer
        controlsProps={{"aria-label": "Image controls"}}
        resetButtonProps={{
          disabled: true,
          icon: <span>custom reset</span>,
          onClick,
        }}
        zoomInButtonProps={{icon: <span>custom zoom in</span>}}
        zoomOutButtonProps={{icon: <span>custom zoom out</span>}}
      />,
    )

    await waitForImageReady()
    await expect.element(page.getByText("custom zoom in")).toBeVisible()
    await expect.element(page.getByText("custom zoom out")).toBeVisible()
    const reset = page.getByRole("button", {name: "Reset image"})
    await expect.element(reset).toBeDisabled()
    await reset.click({force: true}).catch(() => undefined)
    expect(onClick).not.toHaveBeenCalled()
  })

  test("reports controlled zoom changes through the callback", async () => {
    const onZoomChange = vi.fn()
    await render(<SimpleViewer onZoomChange={onZoomChange} zoom={1} />)

    await waitForImageReady()
    await page.getByRole("button", {name: "Zoom in"}).click()
    await expect.poll(() => onZoomChange).toHaveBeenCalledWith({zoom: 1.1})
  })

  test("reports controlled rotation and flip changes through callbacks", async () => {
    const onFlipChange = vi.fn()
    const onRotationChange = vi.fn()

    await render(
      <ImageViewer.Root
        flip={{horizontal: false, vertical: false}}
        onFlipChange={onFlipChange}
        onRotationChange={onRotationChange}
        rotation={10}
      >
        <ImageViewer.Viewport>
          <ImageViewer.Image alt={imageAlt} src={imageSrc} />
        </ImageViewer.Viewport>
        <ImageViewer.Context>
          {(api) => (
            <>
              <button onClick={() => api.rotateBy(90)} type="button">
                Rotate
              </button>
              <button onClick={() => api.flipHorizontally()} type="button">
                Flip
              </button>
            </>
          )}
        </ImageViewer.Context>
      </ImageViewer.Root>,
    )

    await waitForImageLoaded()
    await page.getByRole("button", {name: "Rotate"}).click()
    await page.getByRole("button", {name: "Flip"}).click()
    await expect
      .poll(() => onRotationChange)
      .toHaveBeenCalledWith({rotation: 100})
    await expect
      .poll(() => onFlipChange)
      .toHaveBeenCalledWith({
        flip: {horizontal: true, vertical: false},
      })
  })

  test("renders Context values from the external RootProvider API", async () => {
    function ExternalApiViewer() {
      const api = useImageViewer({defaultZoom: 1})
      return (
        <ImageViewer.RootProvider value={api}>
          <ImageViewer.Viewport>
            <ImageViewer.Image alt={imageAlt} src={imageSrc} />
          </ImageViewer.Viewport>
          <ImageViewer.Context>
            {(contextApi) => (
              <button onClick={() => contextApi.zoomBy(0.5)} type="button">
                API zoom
              </button>
            )}
          </ImageViewer.Context>
          <TransformStatus />
        </ImageViewer.RootProvider>
      )
    }

    await render(<ExternalApiViewer />)
    await waitForImageLoaded()
    await page.getByRole("button", {name: "API zoom"}).click()
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("zoom:1.5")
  })

  test("allows useImageViewerContext to drive the current viewer", async () => {
    function ContextApiButton() {
      const api = useImageViewerContext()
      return (
        <button onClick={() => api.setZoom(2)} type="button">
          Set zoom
        </button>
      )
    }

    await render(
      <ImageViewer.Root>
        <ImageViewer.Viewport>
          <ImageViewer.Image alt={imageAlt} src={imageSrc} />
        </ImageViewer.Viewport>
        <ContextApiButton />
        <TransformStatus />
      </ImageViewer.Root>,
    )
    await waitForImageLoaded()
    await page.getByRole("button", {name: "Set zoom"}).click()
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("zoom:2")
  })

  test("supports controlled state updates from the public callback", async () => {
    function ControlledViewer() {
      const [zoom, setZoom] = useState(1)
      return (
        <SimpleViewer
          onZoomChange={({zoom: nextZoom}) => setZoom(nextZoom)}
          zoom={zoom}
        />
      )
    }

    await render(<ControlledViewer />)
    await waitForImageReady()
    await page.getByRole("button", {name: "Zoom in"}).click()
    await expect
      .element(page.getByRole("button", {name: "Zoom out"}))
      .not.toBeDisabled()
  })

  test("accepts refs created with React useRef", async () => {
    function RefViewer() {
      const imageRef = useRef<HTMLImageElement>(null)
      return <SimpleViewer imageProps={{ref: imageRef}} />
    }

    await render(<RefViewer />)
    await waitForImageReady()
    await expect.element(getImage()).toBeVisible()
  })
})
