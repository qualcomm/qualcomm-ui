import type {Scope} from "@qualcomm-ui/utils/machine"

import type {ToastPlacement} from "../toast.types"

export function getRegionId(placement: ToastPlacement): string {
  return `toast-group:${placement}`
}

export function getRegionEl(
  ctx: Scope,
  placement: ToastPlacement,
): HTMLElement | null {
  return ctx.getById(`toast-group:${placement}`)
}

export function getRootId(ctx: Scope): string {
  return `toast:${ctx.id}`
}

export function getRootEl(ctx: Scope): HTMLElement | null {
  return ctx.getById(getRootId(ctx))
}

export function getTitleId(ctx: Scope): string {
  return `toast:${ctx.id}:title`
}

export function getDescriptionId(ctx: Scope): string {
  return `toast:${ctx.id}:description`
}

export function getCloseTriggerId(ctx: Scope): string {
  return `toast${ctx.id}:close`
}
