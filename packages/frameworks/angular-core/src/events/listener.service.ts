// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {ElementRef, inject, Injectable, Renderer2} from "@angular/core"

export type ListenerTrigger = "hover" | "focus" | "click" | "manual"

export type ListenerTriggerOn = "focus" | "mouse-enter"
export type ListenerTriggerOff = "blur" | "mouse-leave"
export type ListenerTriggerToggle = "click"

export interface ListenerConfig {
  callbackOff?: (event: any, reason: ListenerTriggerOff) => void
  callbackOn?: (event: any, reason: ListenerTriggerOn) => void
  callbackToggle?: (event: any, reason: ListenerTriggerToggle) => void
  hostElement: ElementRef
  trigger?: ListenerTrigger | ListenerTrigger[]
}

@Injectable()
export class ListenerService {
  private listeners: Map<string, () => void> = new Map()
  private rendererListeners: Array<(() => void) | undefined> = []

  private renderer = inject(Renderer2)
  private document = inject(DOCUMENT)

  setDocumentListener<T extends Event>(
    eventName: string,
    callback: (event: T) => void,
  ) {
    this.setListener(this.document, eventName, callback)
  }

  setListener<T extends Event>(
    el: HTMLElement | Document | Window,
    eventName: string,
    callback: (event: T) => void,
  ) {
    this.rendererListeners.push(this.renderer.listen(el, eventName, callback))
  }

  clearDomListeners() {
    this.rendererListeners.forEach((unsub) => unsub?.())
    this.rendererListeners.fill(undefined)
    this.rendererListeners = []
  }

  setListeners({
    callbackOff,
    callbackOn,
    callbackToggle,
    hostElement,
    trigger,
  }: ListenerConfig): void {
    const host = hostElement.nativeElement
    const triggers = Array.isArray(trigger)
      ? trigger
      : (trigger?.split(" ") ?? [])

    if (triggers.includes("click")) {
      if (typeof callbackToggle === "function") {
        this.listeners.set(
          "click",
          this.renderer.listen(host, "click", (event) =>
            callbackToggle(event, "click"),
          ),
        )
      }
    }
    if (triggers.includes("focus")) {
      if (typeof callbackOn === "function") {
        this.listeners.set(
          "focus",
          this.renderer.listen(host, "focus", (event) =>
            callbackOn(event, "focus"),
          ),
        )
      }
    }
    if (triggers.includes("click") || triggers.includes("focus")) {
      if (typeof callbackOff === "function") {
        this.listeners.set(
          "blur",
          this.renderer.listen(host, "blur", (event) =>
            callbackOff(event, "blur"),
          ),
        )
      }
    }
    if (triggers.includes("hover")) {
      if (typeof callbackOn === "function") {
        this.listeners.set(
          "mouseenter",
          this.renderer.listen(host, "mouseenter", (event) =>
            callbackOn(event, "mouse-enter"),
          ),
        )
      }

      if (typeof callbackOff === "function") {
        this.listeners.set(
          "mouseleave",
          this.renderer.listen(host, "mouseleave", (event) =>
            callbackOff(event, "mouse-leave"),
          ),
        )
      }
    }
  }

  clearListeners(): void {
    this.listeners.forEach((unListen) => {
      unListen()
    })
    this.listeners.forEach((unlisten, key) => {
      // @ts-ignore
      this.listeners.set(key, null)
    })
    this.listeners.clear()
  }
}
