import {formatHex, parse} from "culori"
import type {FormatFnArguments} from "style-dictionary/types"

const tokenToMermaidMap: Record<string, string> = {
  activationBkgColor: "{color.background.neutral.03}",
  activationBorderColor: "{color.border.neutral.03}",
  activeTaskBkgColor: "{color.background.brand.primary}",
  activeTaskBorderColor: "{color.border.brand.primary}",
  actorBkg: "{color.background.neutral.02}",
  actorBorder: "{color.border.neutral.02}",
  actorLineColor: "{color.border.neutral.03}",
  actorTextColor: "{color.text.neutral.primary}",
  altSectionBkgColor: "{color.background.neutral.02}",
  archEdgeArrowColor: "{color.text.neutral.primary}",
  archEdgeColor: "{color.border.neutral.03}",
  archGroupBorderColor: "{color.border.neutral.02}",
  attributeBackgroundColorEven: "{color.background.neutral.01}",
  attributeBackgroundColorOdd: "{color.background.neutral.02}",
  background: "{color.surface.primary}",
  border1: "{color.border.neutral.02}",
  border2: "{color.border.neutral.03}",
  classText: "{color.text.neutral.primary}",
  clusterBkg: "{color.background.neutral.02}",
  clusterBorder: "{color.border.neutral.02}",
  commitLabelBackground: "{color.background.neutral.02}",
  commitLabelColor: "{color.text.neutral.primary}",
  compositeBackground: "{color.background.neutral.01}",
  compositeBorder: "{color.border.neutral.02}",
  compositeTitleBackground: "{color.background.neutral.02}",
  critBkgColor: "{color.background.support.danger}",
  critBorderColor: "{color.border.support.danger}",
  cScale0: "{color.category.blue.medium}",
  cScale1: "{color.category.teal.medium}",
  cScale2: "{color.category.green.medium}",
  cScale3: "{color.category.kiwi.medium}",
  cScale4: "{color.category.yellow.medium}",
  cScale5: "{color.category.orange.medium}",
  cScale6: "{color.category.red.medium}",
  cScale7: "{color.category.magenta.medium}",
  cScale8: "{color.category.purple.medium}",
  cScale9: "{color.category.cyan.medium}",
  cScale10: "{color.category.blue.strong}",
  cScale11: "{color.category.teal.strong}",
  doneTaskBkgColor: "{color.background.neutral.04}",
  doneTaskBorderColor: "{color.border.neutral.03}",
  edgeLabelBackground: "{color.background.neutral.02}",
  errorBkgColor: "{color.background.support.danger-subtle}",
  errorTextColor: "{color.text.support.danger}",
  fillType0: "{color.category.blue.subtle}",
  fillType1: "{color.category.teal.subtle}",
  fillType2: "{color.category.green.subtle}",
  fillType3: "{color.category.orange.subtle}",
  fillType4: "{color.category.purple.subtle}",
  fillType5: "{color.category.red.subtle}",
  fillType6: "{color.category.cyan.subtle}",
  fillType7: "{color.category.magenta.subtle}",
  fontFamily: "{type.font-family.secondary}",
  git0: "{color.category.blue.medium}",
  git1: "{color.category.teal.medium}",
  git2: "{color.category.green.medium}",
  git3: "{color.category.orange.medium}",
  git4: "{color.category.purple.medium}",
  git5: "{color.category.red.medium}",
  git6: "{color.category.cyan.medium}",
  git7: "{color.category.magenta.medium}",
  gridColor: "{color.border.neutral.01}",
  innerEndBackground: "{color.text.neutral.primary}",
  labelBackground: "{color.background.neutral.02}",
  labelBoxBkgColor: "{color.background.neutral.02}",
  labelBoxBorderColor: "{color.border.neutral.02}",
  labelColor: "{color.text.neutral.primary}",
  labelTextColor: "{color.text.neutral.primary}",
  lineColor: "{color.text.neutral.primary}",
  loopTextColor: "{color.text.neutral.primary}",
  mainBkg: "{color.background.neutral.01}",
  mainContrastColor: "{color.text.neutral.primary}",
  nodeBkg: "{color.background.neutral.01}",
  nodeBorder: "{color.border.neutral.02}",
  noteBkgColor: "{color.background.support.info-subtle}",
  noteBorderColor: "{color.border.support.info}",
  noteTextColor: "{color.text.neutral.primary}",
  pie0: "{color.category.blue.medium}",
  pie1: "{color.category.teal.medium}",
  pie2: "{color.category.green.medium}",
  pie3: "{color.category.kiwi.medium}",
  pie4: "{color.category.yellow.medium}",
  pie5: "{color.category.orange.medium}",
  pie6: "{color.category.red.medium}",
  pie7: "{color.category.magenta.medium}",
  pie8: "{color.category.purple.medium}",
  pie9: "{color.category.cyan.medium}",
  pie10: "{color.category.blue.strong}",
  pie11: "{color.category.teal.strong}",
  pieLegendTextColor: "{color.text.neutral.primary}",
  pieOuterStrokeColor: "{color.border.neutral.02}",
  pieSectionTextColor: "{color.text.neutral.primary}",
  pieStrokeColor: "{color.border.neutral.02}",
  pieTitleTextColor: "{color.text.neutral.primary}",
  primaryBorderColor: "{color.border.brand.primary}",
  primaryColor: "{color.background.brand.primary}",
  primaryTextColor: "{color.text.neutral.primary}",
  quadrant1Fill: "{color.category.blue.subtle}",
  quadrant2Fill: "{color.category.teal.subtle}",
  quadrant3Fill: "{color.category.green.subtle}",
  quadrant4Fill: "{color.category.orange.subtle}",
  quadrantExternalBorderStrokeFill: "{color.border.neutral.02}",
  quadrantInternalBorderStrokeFill: "{color.border.neutral.01}",
  quadrantPointFill: "{color.background.brand.primary}",
  quadrantTitleFill: "{color.text.neutral.primary}",
  quadrantXAxisTextFill: "{color.text.neutral.secondary}",
  quadrantYAxisTextFill: "{color.text.neutral.secondary}",
  relationColor: "{color.text.neutral.primary}",
  relationLabelBackground: "{color.background.neutral.02}",
  relationLabelColor: "{color.text.neutral.primary}",
  requirementBackground: "{color.background.neutral.01}",
  requirementBorderColor: "{color.border.neutral.02}",
  requirementTextColor: "{color.text.neutral.primary}",
  secondaryBorderColor: "{color.border.neutral.02}",
  secondaryColor: "{color.background.neutral.03}",
  secondaryTextColor: "{color.text.neutral.primary}",
  secondBkg: "{color.background.neutral.03}",
  sectionBkgColor: "{color.background.neutral.01}",
  sectionBkgColor2: "{color.background.neutral.02}",
  signalColor: "{color.text.neutral.primary}",
  signalTextColor: "{color.text.neutral.primary}",
  specialStateColor: "{color.text.neutral.primary}",
  stateBkg: "{color.background.neutral.02}",
  stateLabelColor: "{color.text.neutral.primary}",
  tagLabelBackground: "{color.background.neutral.03}",
  tagLabelBorder: "{color.border.neutral.02}",
  tagLabelColor: "{color.text.neutral.primary}",
  taskBkgColor: "{color.background.brand.primary}",
  taskBorderColor: "{color.border.brand.primary}",
  taskTextColor: "{color.text.neutral.primary}",
  taskTextDarkColor: "{color.text.neutral.primary}",
  taskTextLightColor: "{color.text.neutral.primary}",
  tertiaryBorderColor: "{color.border.neutral.03}",
  tertiaryColor: "{color.background.neutral.04}",
  tertiaryTextColor: "{color.text.neutral.primary}",
  textColor: "{color.text.neutral.primary}",
  titleColor: "{color.text.neutral.primary}",
  todayLineColor: "{color.background.support.danger}",
  transitionColor: "{color.text.neutral.primary}",
  transitionLabelColor: "{color.text.neutral.secondary}",
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

/**
 * Derive a camelCase export name from the file destination.
 * e.g. "qualcomm-dark-mermaid.ts" -> "qualcommDarkMermaidTheme"
 */
function exportNameFromDestination(destination: string): string {
  const stem = destination.replace(/\.ts$/, "")
  const camel = stem.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
  return `${camel}Theme`
}

export function mermaidThemeFormat({
  dictionary,
  file,
}: FormatFnArguments): string {
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

    const resolved =
      token.$type === "color" ? toHex(String(value)) : String(value)
    entries.push(`  ${mermaidProp}: ${JSON.stringify(resolved)},`)
  }

  const exportName = exportNameFromDestination(file.destination)

  return [
    "/**",
    " * This file was generated automatically. Do not edit it directly.",
    " */",
    'import type {MermaidThemeVariables} from "@qualcomm-ui/qds-core/theme"',
    "",
    `export const ${exportName}: Partial<MermaidThemeVariables> = {`,
    ...entries,
    "}",
    "",
  ].join("\n")
}
