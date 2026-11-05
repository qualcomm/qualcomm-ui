// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {imageViewerAnatomy} from "@qualcomm-ui/core/image-viewer"
import {contains, getEventPoint, getEventTarget} from "@qualcomm-ui/dom/query"
import {containsPoint, createRect} from "@qualcomm-ui/dom/rect-utils"
import {
  CoreDialog,
  type CoreDialogBackdropProps,
  type CoreDialogContentProps,
  type CoreDialogPositionerProps,
} from "@qualcomm-ui/react-core/dialog"
import {
  PolymorphicElement,
  type ElementRenderProp,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useImageViewerContext} from "./image-viewer-context.js"

const parts = imageViewerAnatomy.parts

export interface CoreImageViewerTriggerProps extends ElementRenderProp<"button"> {}

/** Opens the popup from a static image preview. */
export function CoreImageViewerTrigger({
  id,
  ...props
}: CoreImageViewerTriggerProps): ReactElement {
  const api = useImageViewerContext()
  return (
    <CoreDialog.Trigger id={id}>
      <PolymorphicElement
        as="button"
        {...mergeProps(
          parts.trigger,
          {"aria-label": api.translations.openLabel},
          props,
        )}
      />
    </CoreDialog.Trigger>
  )
}

export interface CoreImageViewerCloseTriggerProps extends ElementRenderProp<"button"> {}

/** Closes the popup and restores the initial transform. */
export function CoreImageViewerCloseTrigger({
  id,
  ...props
}: CoreImageViewerCloseTriggerProps): ReactElement {
  const api = useImageViewerContext()
  return (
    <CoreDialog.CloseTrigger id={id}>
      <PolymorphicElement
        as="button"
        {...mergeProps(
          parts.closeTrigger,
          {"aria-label": api.translations.closeLabel},
          props,
        )}
      />
    </CoreDialog.CloseTrigger>
  )
}

export interface CoreImageViewerBackdropProps extends CoreDialogBackdropProps {}

export function CoreImageViewerBackdrop(
  props: CoreImageViewerBackdropProps,
): ReactNode {
  return <CoreDialog.Backdrop {...mergeProps(parts.backdrop, props)} />
}

export interface CoreImageViewerPositionerProps extends CoreDialogPositionerProps {}

export function CoreImageViewerPositioner(
  props: CoreImageViewerPositionerProps,
): ReactNode {
  return <CoreDialog.Positioner {...mergeProps(parts.positioner, props)} />
}

export interface CoreImageViewerContentProps extends CoreDialogContentProps {}

export function CoreImageViewerContent({
  onPointerDown,
  ...props
}: CoreImageViewerContentProps): ReactNode {
  const api = useImageViewerContext()
  return (
    <CoreDialog.Content
      {...mergeProps(parts.content, props)}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (event.defaultPrevented || event.button !== 0) {
          return
        }
        const target = getEventTarget<Element>(event)
        if (
          !contains(event.currentTarget, target) ||
          contains(api.getViewportElement(), target)
        ) {
          return
        }
        const point = getEventPoint(event)
        const controls = event.currentTarget.querySelectorAll(
          "button, [role='button'], a[href], input, select, textarea, [tabindex]",
        )
        // Disabled buttons ignore pointer events, so their bounds still count.
        if (
          Array.from(controls).some((control) =>
            containsPoint(createRect(control.getBoundingClientRect()), point),
          )
        ) {
          return
        }
        api.setOpen(false)
      }}
    />
  )
}
