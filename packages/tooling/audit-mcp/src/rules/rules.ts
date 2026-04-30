import {noButtonInHeaderBar} from "./no-button-in-header-bar"
import type {QuiAuditRule} from "./types"

export {noButtonInHeaderBar}

/** All bundled rules, indexed by id. */
export const rules: Record<string, QuiAuditRule> = {
  [noButtonInHeaderBar.id]: noButtonInHeaderBar,
}

/** Bundled rules as an array, stable-ordered by id. */
export const allRules: readonly QuiAuditRule[] = Object.values(rules).sort(
  (a, b) => a.id.localeCompare(b.id),
)
