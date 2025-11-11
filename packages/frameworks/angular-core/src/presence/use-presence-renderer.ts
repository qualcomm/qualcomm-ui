import {
  effect,
  type EffectRef,
  ElementRef,
  inject,
  type InjectOptions,
  Renderer2,
} from "@angular/core"

import {PresenceContextService} from "./presence-context.service"

export interface UsePresenceRendererOptions {
  /**
   * Element to manage. Defaults to injected ElementRef
   */
  elementRef?: ElementRef

  /**
   * Injection options for PresenceContextService
   */
  injectOptions?: InjectOptions
}

/**
 * Removes the host element from the DOM when the presence context is unmounted,
 * and re-appends it when remounted. Useful for components that need to preserve
 * their lifecycle while being hidden from the DOM tree.
 *
 * @returns Effect reference that can be destroyed manually if needed
 */
export function usePresenceRenderer(
  options: UsePresenceRendererOptions = {},
): EffectRef {
  const presenceContext = inject(
    PresenceContextService,
    options.injectOptions ?? {},
  )
  const elementRef = options.elementRef || inject(ElementRef)
  const renderer = inject(Renderer2)

  let parentNode: Node | null = null

  return effect(() => {
    presenceContext?.initialized()
    const unmounted = presenceContext?.unmounted()
    const element = elementRef.nativeElement

    if (unmounted) {
      parentNode = element.parentNode
      renderer.removeChild(parentNode, element)
    } else if (parentNode) {
      renderer.appendChild(parentNode, element)
    }
  })
}
