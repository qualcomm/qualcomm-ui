import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {cdp, page, userEvent} from "vitest/browser"

import {
  ImageViewer,
  type ImageViewerControlOverlayProps,
  type ImageViewerRootProps,
  type ImageViewerViewportProps,
  useImageViewer,
} from "@qualcomm-ui/react/image-viewer"

const imageAlt = "A test landscape"
const imageSrc = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#456"/></svg>',
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

function ViewerControls() {
  return (
    <>
      <ImageViewer.ZoomOutButton />
      <ImageViewer.ZoomInButton />
      <ImageViewer.ResetButton />
    </>
  )
}

interface TestViewerProps extends ImageViewerRootProps {
  includeControls?: boolean
  includeOverlay?: boolean
  outsideTarget?: boolean
  overlayProps?: ImageViewerControlOverlayProps
  viewportProps?: ImageViewerViewportProps
}

function TestViewer({
  includeControls = true,
  includeOverlay = true,
  outsideTarget = false,
  overlayProps,
  viewportProps,
  ...rootProps
}: TestViewerProps) {
  const {children: overlayChildren, ...restOverlayProps} = overlayProps ?? {}
  return (
    <>
      <ImageViewer.Root {...rootProps}>
        <ImageViewer.Viewport {...viewportProps}>
          <ImageViewer.Image alt={imageAlt} src={imageSrc} />
          {includeOverlay ? (
            <ImageViewer.ControlOverlay
              aria-label="Image controls"
              {...restOverlayProps}
            >
              {overlayChildren ?? (includeControls ? <ViewerControls /> : null)}
            </ImageViewer.ControlOverlay>
          ) : null}
        </ImageViewer.Viewport>
        <TransformStatus />
      </ImageViewer.Root>
      {outsideTarget ? (
        <div
          aria-label="Outside viewer"
          style={{display: "block", height: "24px", width: "24px"}}
        />
      ) : null}
    </>
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

function getOverlay() {
  return page.getByLabelText("Image controls")
}

function getTransformZoom() {
  const text =
    page.getByLabelText("Transform status").element().textContent ?? ""
  return Number(text.match(/^zoom:([^;]+)/)?.[1])
}

async function waitForImageReady() {
  await expect.element(getImage()).toBeVisible()
  await expect.element(getImage()).toHaveAttribute("data-ready")
}

function getMainFramePoint(
  element: {element(): HTMLElement | SVGElement},
  point: {x: number; y: number},
) {
  const target = element.element()
  const rect = target.getBoundingClientRect()
  const iframeOffset =
    target.ownerDocument.defaultView?.frameElement?.getBoundingClientRect()
  if (!iframeOffset) {
    throw new Error("The browser test iframe could not be located")
  }
  return {
    x: iframeOffset.left + rect.left + point.x,
    y: iframeOffset.top + rect.top + point.y,
  }
}

async function runTouchSequence(
  points: Array<{x: number; y: number}>,
  callback: (session: Awaited<ReturnType<typeof cdp>>) => Promise<void>,
) {
  const session = cdp()
  await session.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 2,
  })
  try {
    await session.send("Input.dispatchTouchEvent", {
      touchPoints: points.map((point, id) => ({...point, id})),
      type: "touchStart",
    })
    await callback(session)
  } finally {
    await session.send("Input.dispatchTouchEvent", {
      touchPoints: [],
      type: "touchEnd",
    })
    await session.send("Emulation.setTouchEmulationEnabled", {
      enabled: false,
    })
  }
}

describe("ImageViewer", () => {
  test("loads the image with its accessible name and enables controls", async () => {
    await render(<TestViewer />)

    await waitForImageReady()
    await getViewport().hover()
    await expect.element(getImage()).toHaveAttribute("src", imageSrc)
    await expect
      .element(page.getByRole("button", {name: "Zoom out"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: "Reset image"}))
      .not.toBeDisabled()
  })

  test("keeps the overlay hidden and non-interactive until hover or focus", async () => {
    await render(<TestViewer outsideTarget />)
    await page.getByLabelText("Outside viewer").hover()
    await waitForImageReady()

    await expect.element(getOverlay()).not.toBeVisible()
    await getViewport().hover()
    await expect.element(getOverlay()).toBeVisible()
    await page.getByLabelText("Outside viewer").hover()
    await expect.element(getOverlay()).not.toBeVisible()

    await getViewport().click()
    await expect.element(getOverlay()).toBeVisible()
    await page.getByLabelText("Outside viewer").hover()
    await expect.element(getOverlay()).toBeVisible()
  })

  test("keeps the overlay visible through keyboard focus and tabs to controls", async () => {
    await render(<TestViewer outsideTarget />)
    await page.getByLabelText("Outside viewer").hover()
    await waitForImageReady()

    await getViewport().click()
    await expect.element(getOverlay()).toBeVisible()
    await page.getByLabelText("Outside viewer").hover()
    await expect.element(getOverlay()).toBeVisible()
    await userEvent.tab()
    await expect
      .element(page.getByRole("button", {name: "Zoom in"}))
      .toHaveFocus()
  })

  test("ignores wheel events originating in the overlay", async () => {
    await render(<TestViewer defaultZoom={2} />)
    await waitForImageReady()
    await getViewport().click()

    await userEvent.wheel(getOverlay(), {delta: {y: -100}})

    await expect.poll(getTransformZoom).toBeCloseTo(2, 5)
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:0,0;panning:false")
  })

  test("ignores pointer drags originating in the overlay", async () => {
    await render(<TestViewer defaultZoom={2} />)
    await waitForImageReady()
    await getViewport().click()

    await userEvent.dragAndDrop(getOverlay(), getOverlay(), {
      sourcePosition: {x: 24, y: 12},
      targetPosition: {x: 96, y: 12},
    })

    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:0,0;panning:false")
  })

  test("ignores keyboard events originating in the overlay", async () => {
    await render(<TestViewer defaultZoom={2} />)
    await waitForImageReady()
    await getViewport().click()
    await userEvent.tab()
    await userEvent.keyboard("=")

    await expect.poll(getTransformZoom).toBeCloseTo(2, 5)
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:0,0;panning:false")

    await page.getByRole("button", {name: "Zoom in"}).click()
    await expect.poll(getTransformZoom).toBeCloseTo(2.1, 5)
  })

  test("ignores touch events originating in the overlay", async () => {
    await render(<TestViewer defaultZoom={2} />)
    await waitForImageReady()
    await getViewport().click()

    const overlayPoint = getMainFramePoint(getOverlay(), {x: 24, y: 12})
    await runTouchSequence(
      [overlayPoint, {x: overlayPoint.x + 100, y: overlayPoint.y}],
      async (session) => {
        await session.send("Input.dispatchTouchEvent", {
          touchPoints: [
            {...overlayPoint, id: 0},
            {id: 1, x: overlayPoint.x + 100, y: overlayPoint.y + 100},
          ],
          type: "touchMove",
        })
      },
    )

    await expect.poll(getTransformZoom).toBeCloseTo(2, 5)
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:0,0;panning:false")
  })

  test("supports keyboard and wheel zoom on the viewport outside the overlay", async () => {
    await render(<TestViewer />)
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

  test("pans with arrow keys using base, shift, and control steps", async () => {
    await render(<TestViewer defaultZoom={2} />)
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

  test("pans with a primary pointer drag outside the overlay", async () => {
    await render(<TestViewer defaultZoom={2} />)
    await waitForImageReady()

    const viewport = getViewport()
    await userEvent.dragAndDrop(viewport, viewport, {
      sourcePosition: {x: 100, y: 100},
      targetPosition: {x: 140, y: 100},
    })
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("offset:40,0")
  })

  test("zooms with a two-finger pinch gesture outside the overlay", async () => {
    await render(<TestViewer />)
    await waitForImageReady()

    const viewportPoint = getMainFramePoint(getViewport(), {
      x: 100,
      y: 100,
    })
    await runTouchSequence(
      [
        {x: viewportPoint.x, y: viewportPoint.y},
        {x: viewportPoint.x + 100, y: viewportPoint.y},
      ],
      async (session) => {
        await expect.element(getRoot()).not.toHaveAttribute("data-panning")
        await expect.element(getRoot()).toHaveAttribute("data-pinch")
        await session.send("Input.dispatchTouchEvent", {
          touchPoints: [
            {id: 0, x: viewportPoint.x, y: viewportPoint.y},
            {
              id: 1,
              x: viewportPoint.x + 100,
              y: viewportPoint.y + 100,
            },
          ],
          type: "touchMove",
        })
      },
    )
    await expect.poll(getTransformZoom).toBeCloseTo(2, 5)
  })

  test("enforces zoom limits and reset restores the initial transform", async () => {
    await render(
      <TestViewer defaultZoom={2} maxZoom={2} minZoom={1} zoomStep={0.1} />,
    )
    await waitForImageReady()
    await getViewport().hover()

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

  test("reports controlled zoom, rotation, and flip changes through callbacks", async () => {
    const onFlipChange = vi.fn()
    const onRotationChange = vi.fn()
    const onZoomChange = vi.fn()

    await render(
      <ImageViewer.Root
        flip={{horizontal: false, vertical: false}}
        onFlipChange={onFlipChange}
        onRotationChange={onRotationChange}
        onZoomChange={onZoomChange}
        rotation={10}
        zoom={1}
      >
        <ImageViewer.Viewport>
          <ImageViewer.Image alt={imageAlt} src={imageSrc} />
          <ImageViewer.ControlOverlay aria-label="Image controls">
            <ImageViewer.ZoomInButton />
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
          </ImageViewer.ControlOverlay>
        </ImageViewer.Viewport>
      </ImageViewer.Root>,
    )

    await waitForImageReady()
    await getViewport().hover()
    await page.getByRole("button", {name: "Zoom in"}).click()
    await page.getByRole("button", {name: "Rotate"}).click()
    await page.getByRole("button", {name: "Flip"}).click()
    await expect.poll(() => onZoomChange).toHaveBeenCalled()
    await expect.poll(() => onRotationChange).toHaveBeenCalled()
    await expect.poll(() => onFlipChange).toHaveBeenCalled()
  })

  test("renders Context values from the external RootProvider API", async () => {
    function ExternalApiViewer() {
      const api = useImageViewer({defaultZoom: 1})
      return (
        <ImageViewer.RootProvider value={api}>
          <ImageViewer.Viewport>
            <ImageViewer.Image alt={imageAlt} src={imageSrc} />
            <ImageViewer.ControlOverlay aria-label="Image controls">
              <ImageViewer.Context>
                {(contextApi) => (
                  <button onClick={() => contextApi.zoomBy(0.5)} type="button">
                    API zoom
                  </button>
                )}
              </ImageViewer.Context>
            </ImageViewer.ControlOverlay>
          </ImageViewer.Viewport>
          <TransformStatus />
        </ImageViewer.RootProvider>
      )
    }

    await render(<ExternalApiViewer />)
    await waitForImageReady()
    await getViewport().hover()
    await page.getByRole("button", {name: "API zoom"}).click()
    await expect
      .element(page.getByLabelText("Transform status"))
      .toHaveTextContent("zoom:1.5")
  })

  test("supports controlled state updates from the public callback", async () => {
    function ControlledViewer() {
      const [zoom, setZoom] = useState(1)
      return (
        <ImageViewer.Root
          onZoomChange={({zoom: nextZoom}) => setZoom(nextZoom)}
          zoom={zoom}
        >
          <ImageViewer.Viewport>
            <ImageViewer.Image alt={imageAlt} src={imageSrc} />
            <ImageViewer.ControlOverlay aria-label="Image controls">
              <ImageViewer.ZoomInButton />
              <ImageViewer.ZoomOutButton />
            </ImageViewer.ControlOverlay>
          </ImageViewer.Viewport>
        </ImageViewer.Root>
      )
    }

    await render(<ControlledViewer />)
    await waitForImageReady()
    await getViewport().hover()
    await page.getByRole("button", {name: "Zoom in"}).click()
    await expect
      .element(page.getByRole("button", {name: "Zoom out"}))
      .not.toBeDisabled()
  })
})
