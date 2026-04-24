// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Converts heading text to a URL-friendly slug. Handles multi-word text,
 * PascalCase identifiers, and single lowercase words. Does NOT deduplicate —
 * callers manage their own counter state via {@link SlugGenerator}.
 */
export function slugify(text: string): string {
  const cleaned = text
    .replace(/[<>]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()

  if (cleaned.includes(" ")) {
    return cleaned
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  // PascalCase → kebab-case (e.g. "MyComponent" → "my-component")
  if ((cleaned.match(/[A-Z]/g) || []).length >= 2) {
    return cleaned
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
      .toLowerCase()
  }

  return cleaned.toLowerCase()
}

/**
 * Stateful slug generator that appends `-1`, `-2`, etc. for duplicate slugs
 * within a single page/document scope.
 */
export class SlugGenerator {
  private seenIds = new Map<string, number>()

  reset(): void {
    this.seenIds.clear()
  }

  createSlug(text: string): string {
    const slug = slugify(text)
    const count = this.seenIds.get(slug) || 0
    this.seenIds.set(slug, count + 1)
    return count > 0 ? `${slug}-${count}` : slug
  }
}
