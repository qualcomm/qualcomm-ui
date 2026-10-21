import {useLayoutEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"

import type {} from "@vitest/browser-playwright"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {cdp, page, userEvent} from "vitest/browser"

import {useImageViewer} from "@qualcomm-ui/react-core/image-viewer"
import {PortalContextProvider} from "@qualcomm-ui/react-core/portal"
import {ButtonGroup} from "@qualcomm-ui/react/button"
import {
  ImageViewer,
  type ImageViewerFloatingPortalProps,
  type ImageViewerRootProps,
} from "@qualcomm-ui/react/image-viewer"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const imageAlt = "A test landscape"
const imageSrc = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#456"/></svg>',
)}`
const portraitImageSrc = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="320"><rect width="180" height="320" fill="#456"/></svg>',
)}`
const failedImageSrc = "data:image/svg+xml,%3Csvg%3E"

function TransformStatus() {
  return (
    <ImageViewer.Context>
      {(api) => (
        <output aria-label="Transform status">{`zoom:${api.zoom};offset:${api.offset.x},${api.offset.y};rotation:${api.rotation};flip:${api.flip.horizontal},${api.flip.vertical};panning:${api.panning}`}</output>
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
      <ImageViewer.Context>
        {(api) => (
          <>
            <button onClick={() => api.rotateBy(90)} type="button">
              Rotate image
            </button>
            <button onClick={() => api.flipHorizontally()} type="button">
              Flip image
            </button>
          </>
        )}
      </ImageViewer.Context>
    </>
  )
}

interface TestViewerProps extends ImageViewerRootProps {
  floatingPortalProps?: ImageViewerFloatingPortalProps
  imageSource?: string
  includeControls?: boolean
  popupImageSource?: string
  resizeControl?: boolean
}

function TestViewer({
  floatingPortalProps,
  imageSource = imageSrc,
  includeControls = true,
  popupImageSource = imageSource,
  resizeControl = false,
  ...rootProps
}: TestViewerProps) {
  const [narrow, setNarrow] = useState(false)
  const portalProps = resizeControl
    ? {
        ...floatingPortalProps,
        contentProps: {
          ...floatingPortalProps?.contentProps,
          style: {
            ...floatingPortalProps?.contentProps?.style,
            width: narrow ? "50%" : "100%",
          },
        },
      }
    : floatingPortalProps
  return (
    <ImageViewer.Root
      alt={imageAlt}
      data-test-id="image-viewer-root"
      src={imageSource}
      {...rootProps}
    >
      <button data-test-id="outside-focus-target" type="button">
        Outside viewer
      </button>
      <ImageViewer.Trigger>
        <ImageViewer.StaticImage alt={imageAlt} src={imageSource} />
      </ImageViewer.Trigger>
      <TransformStatus />
      <ImageViewer.FloatingPortal {...portalProps}>
        <ImageViewer.CloseButton />
        <ImageViewer.Viewport data-test-id="image-viewer-viewport">
          <ImageViewer.ViewportImage src={popupImageSource} />
        </ImageViewer.Viewport>
        {includeControls ? (
          <ButtonGroup aria-label="Image controls">
            <ViewerControls />
            {resizeControl ? (
              <button
                onClick={() => setNarrow((value) => !value)}
                type="button"
              >
                Resize popup
              </button>
            ) : null}
          </ButtonGroup>
        ) : null}
      </ImageViewer.FloatingPortal>
    </ImageViewer.Root>
  )
}

function ShadowRootViewer({defaultOpen = false}: {defaultOpen?: boolean}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) {
      return
    }
    setShadowRoot(host.attachShadow({mode: "open"}))
  }, [])

  return (
    <div ref={hostRef} data-test-id="image-viewer-shadow-host">
      {shadowRoot
        ? createPortal(
            <TestViewer
              defaultOpen={defaultOpen}
              floatingPortalProps={{container: shadowRoot}}
              getRootNode={() => shadowRoot}
            />,
            shadowRoot,
          )
        : null}
    </div>
  )
}

function PortalContextViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <>
      <div
        ref={containerRef}
        data-test-id="image-viewer-portal-context-container"
      />
      <PortalContextProvider value={{container: containerRef}}>
        <TestViewer />
      </PortalContextProvider>
    </>
  )
}

function getTrigger() {
  return page.getByRole("button", {name: "Expand image"})
}

function getRoot() {
  return page.getByTestId("image-viewer-root")
}

function getViewport() {
  return page.getByTestId("image-viewer-viewport")
}

function getDialog() {
  return page.getByRole("dialog", {name: "Image viewer"})
}

function getPopupImage() {
  return getDialog().getByRole("img", {name: imageAlt})
}

function getControls() {
  return page.getByRole("group", {name: "Image controls"})
}

function getTransformStatus() {
  return page.getByLabelText("Transform status")
}

function getTransformZoom() {
  const text = getTransformStatus().element().textContent ?? ""
  return Number(text.match(/^zoom:([^;]+)/)?.[1])
}

async function waitForPopup() {
  await expect.element(getDialog()).toBeVisible()
  await expect.element(getPopupImage()).toBeVisible()
  await expect.element(getControls()).toBeVisible()
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

const tests: MultiComponentTestCase<Omit<ImageViewerRootProps, "children">>[] =
  [
    {
      composite: (props) => <TestViewer {...props} />,
      simple: (props) => (
        <ImageViewer
          alt={imageAlt}
          src={imageSrc}
          viewportProps={{"data-test-id": "image-viewer-viewport"}}
          {...props}
        />
      ),
      testCase: (getComponent) => {
        test("renders a static preview button and opens the popup on click", async () => {
          await render(getComponent())

          await expect.element(getTrigger()).toBeVisible()
          await expect
            .element(getTrigger().getByRole("img", {name: imageAlt}))
            .toBeVisible()
          await expect.element(getDialog()).not.toBeInTheDocument()

          await getTrigger().click()
          await waitForPopup()
          await expect.element(getViewport()).toBeVisible()
        })

        test("opens the popup from keyboard activation and restores focus on Escape", async () => {
          await render(getComponent())

          getTrigger().element().focus()
          await userEvent.keyboard("{Enter}")
          await waitForPopup()
          await userEvent.keyboard("{Escape}")
          await expect.element(getDialog()).not.toBeInTheDocument()
          await expect.element(getTrigger()).toHaveFocus()
        })

        test("zooms within the configured limits and resets with the built-in controls", async () => {
          const onZoomChange = vi.fn()
          await render(
            getComponent({
              defaultOpen: true,
              maxZoom: 2,
              onZoomChange,
              zoomStep: 0.5,
            }),
          )
          await waitForPopup()

          const zoomIn = page.getByRole("button", {name: "Zoom in"})
          const zoomOut = page.getByRole("button", {name: "Zoom out"})
          await expect.element(zoomOut).toBeDisabled()
          await zoomIn.click()
          await expect
            .poll(() => onZoomChange)
            .toHaveBeenLastCalledWith({zoom: 1.5})
          await zoomIn.click()
          await expect.element(zoomIn).toBeDisabled()
          await expect
            .poll(() => onZoomChange)
            .toHaveBeenLastCalledWith({zoom: 2})
          await zoomOut.click()
          await expect
            .poll(() => onZoomChange)
            .toHaveBeenLastCalledWith({zoom: 1.5})
          await page.getByRole("button", {name: "Reset image"}).click()
          await expect
            .poll(() => onZoomChange)
            .toHaveBeenLastCalledWith({zoom: 1})
          await expect.element(zoomOut).toBeDisabled()
        })

        test("updates controlled popup visibility through the public callback", async () => {
          const onOpenChange = vi.fn()
          function ControlledViewer() {
            const [open, setOpen] = useState(false)
            return getComponent({
              onOpenChange: (nextOpen) => {
                onOpenChange(nextOpen)
                setOpen(nextOpen)
              },
              open,
            })
          }

          await render(<ControlledViewer />)
          await getTrigger().click()
          await waitForPopup()
          expect(onOpenChange).toHaveBeenLastCalledWith(true)
          await page.getByRole("button", {name: "Close image viewer"}).click()
          await expect.element(getDialog()).not.toBeInTheDocument()
          expect(onOpenChange).toHaveBeenLastCalledWith(false)
        })
      },
    },
  ]

describe("ImageViewer", () => {
  runTests(tests)

  test("customizes simple API images, popup, and controls through part props", async () => {
    const onZoomIn = vi.fn()
    const onZoomOut = vi.fn()
    const onReset = vi.fn()
    const onClose = vi.fn()
    await render(
      <ImageViewer
        alt={imageAlt}
        closeButtonProps={{"aria-label": "Close photo", onClick: onClose}}
        controlsProps={{"aria-label": "Photo controls"}}
        floatingPortalProps={{contentProps: {"aria-label": "Photo preview"}}}
        resetButtonProps={{"aria-label": "Reset photo", onClick: onReset}}
        src={imageSrc}
        staticImageProps={{alt: "Small landscape preview", loading: "eager"}}
        triggerProps={{"aria-label": "Open photo"}}
        viewportImageProps={{alt: "Full portrait", src: portraitImageSrc}}
        viewportProps={{"aria-label": "Pan photo"}}
        zoomInButtonProps={{"aria-label": "Enlarge photo", onClick: onZoomIn}}
        zoomOutButtonProps={{"aria-label": "Shrink photo", onClick: onZoomOut}}
      />,
    )

    await expect
      .element(page.getByRole("img", {name: "Small landscape preview"}))
      .toHaveAttribute("src", imageSrc)
    await page.getByRole("button", {name: "Open photo"}).click()
    const dialog = page.getByRole("dialog", {name: "Photo preview"})
    await expect.element(dialog).toBeVisible()
    await expect
      .element(dialog.getByRole("img", {name: "Full portrait"}))
      .toHaveAttribute("src", portraitImageSrc)
    await expect.element(page.getByLabelText("Pan photo")).toBeVisible()
    await expect
      .element(page.getByRole("group", {name: "Photo controls"}))
      .toBeVisible()

    await page.getByRole("button", {name: "Enlarge photo"}).click()
    expect(onZoomIn).toHaveBeenCalledOnce()
    await page.getByRole("button", {name: "Shrink photo"}).click()
    expect(onZoomOut).toHaveBeenCalledOnce()
    await page.getByRole("button", {name: "Reset photo"}).click()
    expect(onReset).toHaveBeenCalledOnce()
    await page.getByRole("button", {name: "Close photo"}).click()
    expect(onClose).toHaveBeenCalledOnce()
    await expect.element(dialog).not.toBeInTheDocument()
  })

  test("portals the popup into the supplied ShadowRoot container", async () => {
    await render(<ShadowRootViewer />)

    await getTrigger().click()
    await expect.element(getDialog()).toBeVisible()
    await expect.element(getControls()).toBeVisible()

    const host = page.getByTestId("image-viewer-shadow-host").element()
    expect(getDialog().element().getRootNode()).toBe(host.shadowRoot)
  })

  test("portals a default-open popup into the supplied ShadowRoot container", async () => {
    await render(<ShadowRootViewer defaultOpen />)

    await expect.element(getDialog()).toBeVisible()
    await expect.element(getControls()).toBeVisible()
    const host = page.getByTestId("image-viewer-shadow-host").element()
    expect(getDialog().element().getRootNode()).toBe(host.shadowRoot)
  })

  test("uses the PortalContextProvider container for popup content", async () => {
    await render(<PortalContextViewer />)

    await getTrigger().click()
    await waitForPopup()

    const container = page
      .getByTestId("image-viewer-portal-context-container")
      .element()
    expect(container.contains(getDialog().element())).toBe(true)
  })

  test("keeps controls disabled until the popup image is ready", async () => {
    await render(<TestViewer />)

    await getTrigger().click()
    await waitForPopup()
    await expect
      .element(page.getByRole("button", {name: "Zoom out"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: "Zoom in"}))
      .not.toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: "Reset image"}))
      .not.toBeDisabled()
  })

  test("keeps controls disabled when the popup image fails to load", async () => {
    await render(
      <TestViewer imageSource={imageSrc} popupImageSource={failedImageSrc} />,
    )

    await getTrigger().click()
    await expect.element(getDialog()).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Zoom in"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: "Zoom out"}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: "Reset image"}))
      .toBeDisabled()

    await page.getByRole("button", {name: "Close image viewer"}).click()
    await expect.element(getDialog()).not.toBeInTheDocument()
  })

  test.each([
    {name: "landscape", source: imageSrc},
    {name: "portrait", source: portraitImageSrc},
  ])(
    "fits the viewport to a $name image's natural aspect ratio",
    async ({source}) => {
      await render(<TestViewer popupImageSource={source} />)

      await getTrigger().click()
      await waitForPopup()
      const image = getPopupImage().element() as HTMLImageElement
      const width = Number.parseFloat(image.style.width)
      const height = Number.parseFloat(image.style.height)

      expect(width).toBeGreaterThan(0)
      expect(width / height).toBeCloseTo(
        image.naturalWidth / image.naturalHeight,
        5,
      )
      await expect
        .poll(() => {
          const viewport = getViewport().element().getBoundingClientRect()
          return viewport.width / viewport.height
        })
        .toBeCloseTo(image.naturalWidth / image.naturalHeight, 2)
    },
  )

  test("recalculates fitted dimensions when the popup is resized", async () => {
    await render(<TestViewer resizeControl />)

    await getTrigger().click()
    await waitForPopup()
    const initialWidth = getPopupImage().element().style.width
    await page.getByRole("button", {name: "Resize popup"}).click()

    await expect
      .poll(() => getPopupImage().element().style.width)
      .not.toBe(initialWidth)
  })

  test("focuses the viewport on open and restores focus to the preview on close", async () => {
    await render(<TestViewer />)

    await getTrigger().click()
    await waitForPopup()
    await expect.element(getViewport()).toHaveFocus()

    await page.getByRole("button", {name: "Close image viewer"}).click()
    await expect.element(getDialog()).not.toBeInTheDocument()
    await expect.element(getTrigger()).toHaveFocus()
  })

  test("locks body scrolling while open and restores the previous overflow value on close", async () => {
    await render(<TestViewer />)
    const body = getTrigger().element().ownerDocument.body
    const initialOverflow = body.style.overflow

    await getTrigger().click()
    await waitForPopup()
    expect(body.style.overflow).toBe("hidden")

    await page.getByRole("button", {name: "Close image viewer"}).click()
    await expect.element(getDialog()).not.toBeInTheDocument()
    expect(body.style.overflow).toBe(initialOverflow)
  })

  test("traps focus inside the popup while it is open", async () => {
    await render(<TestViewer />)

    await getTrigger().click()
    await waitForPopup()
    for (let index = 0; index < 6; index += 1) {
      await userEvent.tab()
      await expect
        .element(page.getByTestId("outside-focus-target"))
        .not.toHaveFocus()
    }
  })

  test("closes with Escape and a backdrop interaction", async () => {
    await render(
      <TestViewer
        floatingPortalProps={{
          backdropProps: {"data-test-id": "image-viewer-backdrop"},
          contentProps: {style: {width: "50%"}},
          positionerProps: {"data-test-id": "image-viewer-positioner"},
        }}
      />,
    )

    await getTrigger().click()
    await waitForPopup()
    await userEvent.keyboard("{Escape}")
    await expect.element(getDialog()).not.toBeInTheDocument()

    await getTrigger().click()
    await waitForPopup()
    const positioner = page.getByTestId("image-viewer-positioner").element()
    await new Promise((resolve) => setTimeout(resolve, 20))
    positioner.dispatchEvent(
      new PointerEvent("pointerdown", {bubbles: true, pointerType: "mouse"}),
    )
    await expect.element(getDialog()).not.toBeInTheDocument()
  })

  test("reports open state changes through the public callback", async () => {
    const onOpenChange = vi.fn()
    await render(<TestViewer onOpenChange={onOpenChange} />)

    await getTrigger().click()
    await waitForPopup()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)

    await page.getByRole("button", {name: "Close image viewer"}).click()
    await expect.element(getDialog()).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  test.each([
    {name: "landscape", source: imageSrc},
    {name: "portrait", source: portraitImageSrc},
  ])(
    "closes from empty dialog space around a $name image",
    async ({source}) => {
      await render(<TestViewer popupImageSource={source} />)

      await getTrigger().click()
      await waitForPopup()
      await getViewport().click()
      await expect.element(getDialog()).toBeVisible()
      await page.getByRole("button", {name: "Zoom in"}).click()
      await expect.element(getDialog()).toBeVisible()

      await getDialog().click({position: {x: 4, y: 4}})
      await expect.element(getDialog()).not.toBeInTheDocument()
      await expect.element(getTrigger()).toHaveFocus()
    },
  )

  test("keeps disabled buttons inert and closes from the space between controls", async () => {
    await render(<TestViewer />)
    await getTrigger().click()
    await waitForPopup()

    const controls = getControls().element().getBoundingClientRect()
    const zoomOut = page.getByRole("button", {name: "Zoom out"})
    await expect.element(zoomOut).toBeDisabled()
    const zoomOutRect = zoomOut.element().getBoundingClientRect()
    const zoomInRect = page
      .getByRole("button", {name: "Zoom in"})
      .element()
      .getBoundingClientRect()

    await getControls().click({
      position: {
        x: zoomOutRect.left + zoomOutRect.width / 2 - controls.left,
        y: zoomOutRect.top + zoomOutRect.height / 2 - controls.top,
      },
    })
    await expect.element(getDialog()).toBeVisible()

    await getControls().click({
      position: {
        x: (zoomOutRect.right + zoomInRect.left) / 2 - controls.left,
        y: zoomOutRect.top + zoomOutRect.height / 2 - controls.top,
      },
    })
    await expect.element(getDialog()).not.toBeInTheDocument()
  })

  test("allows preventing dismissal from empty dialog space", async () => {
    await render(
      <TestViewer
        floatingPortalProps={{
          contentProps: {onPointerDown: (event) => event.preventDefault()},
        }}
      />,
    )
    await getTrigger().click()
    await waitForPopup()

    await getDialog().click({position: {x: 4, y: 4}})
    await expect.element(getDialog()).toBeVisible()
  })

  test("does not close a controlled popup when the parent declines the close request", async () => {
    const onOpenChange = vi.fn()
    function ControlledViewer() {
      const [open, setOpen] = useState(false)
      return (
        <TestViewer
          onOpenChange={(nextOpen) => {
            onOpenChange(nextOpen)
            if (nextOpen) {
              setOpen(true)
            }
          }}
          open={open}
        />
      )
    }

    await render(<ControlledViewer />)
    await getTrigger().click()
    await waitForPopup()
    await page.getByRole("button", {name: "Close image viewer"}).click()
    await expect.element(getDialog()).toBeVisible()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  test("restores the initial transform on close", async () => {
    await render(<TestViewer zoomStep={1} />)

    await getTrigger().click()
    await waitForPopup()
    await page.getByRole("button", {name: "Zoom in"}).click()
    await page.getByRole("button", {name: "Rotate image"}).click()
    await page.getByRole("button", {name: "Flip image"}).click()
    await userEvent.dragAndDrop(getViewport(), getViewport(), {
      sourcePosition: {x: 100, y: 100},
      targetPosition: {x: 100, y: 140},
    })
    await expect
      .element(getTransformStatus())
      .toHaveTextContent("zoom:2;offset:0,40;rotation:90;flip:true,false")

    await page.getByRole("button", {name: "Close image viewer"}).click()
    await expect.element(getDialog()).not.toBeInTheDocument()
    await getTrigger().click()
    await waitForPopup()
    await expect
      .element(getTransformStatus())
      .toHaveTextContent("zoom:1;offset:0,0;rotation:0;flip:false,false")
  })

  test("supports keyboard, wheel, and pointer transforms in the popup viewport", async () => {
    await render(<TestViewer defaultZoom={2} />)
    await getTrigger().click()
    await waitForPopup()

    await getViewport().click()
    await userEvent.keyboard("=")
    await expect
      .element(getRoot())
      .toHaveAttribute(
        "aria-description",
        expect.stringContaining("2.10x zoom"),
      )
    await userEvent.wheel(getViewport(), {delta: {y: -1}})
    await expect
      .element(getRoot())
      .toHaveAttribute(
        "aria-description",
        expect.stringContaining("2.20x zoom"),
      )

    await userEvent.keyboard("{ArrowRight}")
    await expect.element(getTransformStatus()).toHaveTextContent("offset:1,0")
    await userEvent.dragAndDrop(getViewport(), getViewport(), {
      sourcePosition: {x: 100, y: 100},
      targetPosition: {x: 140, y: 100},
    })
    await expect.element(getTransformStatus()).toHaveTextContent("offset:41,0")
  })

  test("supports pinch zoom in the popup viewport", async () => {
    await render(<TestViewer />)
    await getTrigger().click()
    await waitForPopup()

    const viewportPoint = getMainFramePoint(getViewport(), {x: 100, y: 100})
    const session = cdp()
    await session.send("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 2,
    })
    try {
      await session.send("Input.dispatchTouchEvent", {
        touchPoints: [
          {...viewportPoint, id: 0},
          {id: 1, x: viewportPoint.x + 100, y: viewportPoint.y},
        ],
        type: "touchStart",
      })
      await session.send("Input.dispatchTouchEvent", {
        touchPoints: [
          {...viewportPoint, id: 0},
          {id: 1, x: viewportPoint.x + 100, y: viewportPoint.y + 100},
        ],
        type: "touchMove",
      })
    } finally {
      await session.send("Input.dispatchTouchEvent", {
        touchPoints: [],
        type: "touchEnd",
      })
      await session.send("Emulation.setTouchEmulationEnabled", {
        enabled: false,
      })
    }
    await expect.poll(getTransformZoom).toBeCloseTo(2, 5)
  })

  test("enforces zoom limits and reset restores the initial transform", async () => {
    await render(
      <TestViewer defaultZoom={2} maxZoom={2} minZoom={1} zoomStep={0.1} />,
    )
    await getTrigger().click()
    await waitForPopup()

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

  test("keeps the popup mounted across repeated openings and centers pan each time", async () => {
    await render(<TestViewer defaultZoom={2} />)

    await getTrigger().click()
    await waitForPopup()
    await getViewport().click()
    await userEvent.keyboard("{ArrowRight}")
    await page.getByRole("button", {name: "Close image viewer"}).click()
    await expect.element(getDialog()).not.toBeInTheDocument()

    await getTrigger().click()
    await waitForPopup()
    await expect.element(getTransformStatus()).toHaveTextContent("offset:0,0")
  })

  test("reports controlled zoom, rotation, and flip changes through callbacks", async () => {
    const onFlipChange = vi.fn()
    const onRotationChange = vi.fn()
    const onZoomChange = vi.fn()

    await render(
      <ImageViewer.Root
        alt={imageAlt}
        defaultOpen
        flip={{horizontal: false, vertical: false}}
        onFlipChange={onFlipChange}
        onRotationChange={onRotationChange}
        onZoomChange={onZoomChange}
        rotation={10}
        src={imageSrc}
        zoom={1}
      >
        <ImageViewer.Trigger>
          <ImageViewer.StaticImage />
        </ImageViewer.Trigger>
        <TransformStatus />
        <ImageViewer.FloatingPortal>
          <ImageViewer.CloseButton />
          <ImageViewer.Viewport>
            <ImageViewer.ViewportImage />
          </ImageViewer.Viewport>
          <div aria-label="Image controls" role="group">
            <ImageViewer.ZoomInButton />
            <ImageViewer.Context>
              {(api) => (
                <>
                  <button onClick={() => api.rotateBy(90)} type="button">
                    Rotate image
                  </button>
                  <button onClick={() => api.flipHorizontally()} type="button">
                    Flip image
                  </button>
                </>
              )}
            </ImageViewer.Context>
          </div>
        </ImageViewer.FloatingPortal>
      </ImageViewer.Root>,
    )

    await waitForPopup()
    await page.getByRole("button", {name: "Zoom in"}).click()
    await page.getByRole("button", {name: "Rotate image"}).click()
    await page.getByRole("button", {name: "Flip image"}).click()
    await expect.poll(() => onZoomChange).toHaveBeenCalled()
    await expect.poll(() => onRotationChange).toHaveBeenCalled()
    await expect.poll(() => onFlipChange).toHaveBeenCalled()
  })

  test("renders Context values from the external RootProvider API", async () => {
    function ExternalApiViewer() {
      const api = useImageViewer({defaultOpen: true, defaultZoom: 1})
      return (
        <ImageViewer.RootProvider alt={imageAlt} src={imageSrc} value={api}>
          <ImageViewer.Trigger>
            <ImageViewer.StaticImage />
          </ImageViewer.Trigger>
          <TransformStatus />
          <ImageViewer.FloatingPortal>
            <ImageViewer.CloseButton />
            <ImageViewer.Viewport>
              <ImageViewer.ViewportImage />
            </ImageViewer.Viewport>
            <div aria-label="Image controls" role="group">
              <ImageViewer.Context>
                {(contextApi) => (
                  <button onClick={() => contextApi.zoomBy(0.5)} type="button">
                    API zoom
                  </button>
                )}
              </ImageViewer.Context>
            </div>
          </ImageViewer.FloatingPortal>
        </ImageViewer.RootProvider>
      )
    }

    await render(<ExternalApiViewer />)
    await waitForPopup()
    await page.getByRole("button", {name: "API zoom"}).click()
    await expect.element(getTransformStatus()).toHaveTextContent("zoom:1.5")
  })

  test("supports controlled state updates from the public callback", async () => {
    function ControlledViewer() {
      const [zoom, setZoom] = useState(1)
      return (
        <TestViewer
          onZoomChange={({zoom: nextZoom}) => setZoom(nextZoom)}
          zoom={zoom}
        />
      )
    }

    await render(<ControlledViewer />)
    await getTrigger().click()
    await waitForPopup()
    await page.getByRole("button", {name: "Zoom in"}).click()
    await expect
      .element(page.getByRole("button", {name: "Zoom out"}))
      .not.toBeDisabled()
  })
})
