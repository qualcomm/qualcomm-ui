// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Nullable} from "@qualcomm-ui/utils/functions"
import type {MaybeFn} from "@qualcomm-ui/utils/guard"
import type {JSX} from "@qualcomm-ui/utils/machine"

interface VirtualElement {
  contextElement?: Element | undefined
  getBoundingClientRect(): DOMRect
}

export type MeasurableElement = Element | VirtualElement

export interface Point {
  x: number
  y: number
}

export interface EventKeyOptions {
  dir?: "ltr" | "rtl" | undefined
  orientation?: "horizontal" | "vertical" | undefined
}

export type NativeEvent<E> =
  JSX.ChangeEvent<any> extends E
    ? InputEvent
    : E extends JSX.SyntheticEvent<any, infer T>
      ? T
      : never

export type AnyPointerEvent = MouseEvent | TouchEvent | PointerEvent

export type MaybeElement = Nullable<HTMLElement>

export type MaybeElementOrFn = MaybeFn<MaybeElement>

export type HTMLElementWithValue =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement
