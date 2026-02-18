import {formatHex, parse} from "culori"
import type {FormatFnArguments} from "style-dictionary/types"

const tokenToMermaidMap: Record<string, string> = {
  background: "{color.surface.primary}",
  border1: "{color.border.neutral.02}",
  border2: "{color.border.neutral.03}",
  critBkgColor: "{color.background.support.danger}",
  critBorderColor: "{color.border.support.danger}",
  errorBkgColor: "{color.background.support.danger-subtle}",
  errorTextColor: "{color.text.support.danger}",
  fontFamily: "{type.font-family.secondary}",
  labelBackground: "{color.background.neutral.02}",
  lineColor: "{color.text.neutral.primary}",
  mainBkg: "{color.background.neutral.01}",
  mainContrastColor: "{color.text.neutral.primary}",
  nodeBkg: "{color.background.neutral.01}",
  nodeBorder: "{color.border.neutral.02}",
  noteBkgColor: "{color.background.support.info-subtle}",
  primaryColor: "{color.background.brand.primary}",
  secondBkg: "{color.background.neutral.03}",
  textColor: "{color.text.neutral.primary}",
  titleColor: "{color.text.neutral.primary}",
  todayLineColor: "{color.background.support.danger}",
}

/**
 * Convert a color value to hex if possible. Mermaid uses khroma internally
 * to derive colors (lighten, darken, invert, etc.), and khroma only supports
 * hex, rgb/rgba, hsl/hsla, and CSS keywords — not oklch.
 */
function toHex(value: string): string {
  const parsed = parse(value)
  if (!parsed) {
    return value
  }
  return formatHex(parsed)
}

export function mermaidThemeFormat({dictionary}: FormatFnArguments): string {
  const entries: string[] = []

  for (const [mermaidProp, tokenKey] of Object.entries(tokenToMermaidMap)) {
    const token = dictionary.tokenMap.get(tokenKey)
    if (!token) {
      continue
    }

    const value = token.$value ?? token.value
    if (value == null) {
      continue
    }

    const resolved = token.$type === "color" ? toHex(String(value)) : String(value)
    entries.push(`  ${mermaidProp}: ${JSON.stringify(resolved)},`)
  }

  return [
    "/**",
    " * This file was generated automatically. Do not edit it directly.",
    " */",
    'import type {MermaidThemeVariables} from "@qualcomm-ui/qds-core/theme"',
    "",
    "export const mermaidThemeOverrides: Partial<MermaidThemeVariables> = {",
    ...entries,
    "}",
    "",
  ].join("\n")
}
