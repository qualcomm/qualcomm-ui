import {formatHex, parse} from "culori"
import type {FormatFnArguments} from "style-dictionary/types"

/**
 * Flat mermaid theme variable → design token mapping.
 * Every key from MermaidThemeVariables that takes a color string is listed
 * here so mermaid never derives a value we don't control.
 */
const tokenToMermaidMap: Record<string, string> = {
  /* group: Core */
  background: "{color.surface.primary}",
  lineColor: "{color.text.neutral.primary}",
  primaryBorderColor: "{color.border.brand.primary}",
  primaryColor: "{color.background.brand.primary}",
  primaryTextColor: "{color.text.neutral.primary}",
  secondaryBorderColor: "{color.border.neutral.02}",
  secondaryColor: "{color.background.neutral.03}",
  secondaryTextColor: "{color.text.neutral.primary}",
  tertiaryBorderColor: "{color.border.neutral.03}",
  tertiaryColor: "{color.background.neutral.04}",
  tertiaryTextColor: "{color.text.neutral.primary}",
  textColor: "{color.text.neutral.primary}",

  /* group: Base */
  darkTextColor: "{color.text.neutral.inverse}",
  fontFamily: "{type.font-family.secondary}",
  mainBkg: "{color.background.neutral.01}",
  mainContrastColor: "{color.text.neutral.primary}",
  secondBkg: "{color.background.neutral.03}",

  /* group: Flowchart */
  arrowheadColor: "{color.text.neutral.primary}",
  border1: "{color.border.neutral.02}",
  border2: "{color.border.neutral.03}",
  clusterBkg: "{color.background.neutral.02}",
  clusterBorder: "{color.border.neutral.02}",
  defaultLinkColor: "{color.text.neutral.primary}",
  edgeLabelBackground: "{color.background.neutral.02}",
  labelBackground: "{color.background.neutral.02}",
  nodeBkg: "{color.background.neutral.01}",
  nodeBorder: "{color.border.neutral.02}",
  titleColor: "{color.text.neutral.primary}",

  /* group: Sequence Diagram */
  activationBkgColor: "{color.background.neutral.03}",
  activationBorderColor: "{color.border.neutral.03}",
  actorBkg: "{color.background.neutral.02}",
  actorBorder: "{color.border.neutral.02}",
  actorLineColor: "{color.border.neutral.03}",
  actorTextColor: "{color.text.neutral.primary}",
  labelBoxBkgColor: "{color.background.neutral.02}",
  labelBoxBorderColor: "{color.border.neutral.02}",
  labelTextColor: "{color.text.neutral.primary}",
  loopTextColor: "{color.text.neutral.primary}",
  noteBkgColor: "{color.background.support.info-subtle}",
  noteBorderColor: "{color.border.support.info}",
  noteTextColor: "{color.text.neutral.primary}",
  sequenceNumberColor: "{color.text.neutral.primary}",
  signalColor: "{color.text.neutral.primary}",
  signalTextColor: "{color.text.neutral.primary}",

  /* group: Gantt / State */
  activeTaskBkgColor: "{color.background.brand.primary}",
  activeTaskBorderColor: "{color.border.brand.primary}",
  altBackground: "{color.background.neutral.02}",
  altSectionBkgColor: "{color.background.neutral.02}",
  compositeBackground: "{color.background.neutral.01}",
  compositeBorder: "{color.border.neutral.02}",
  compositeTitleBackground: "{color.background.neutral.02}",
  critBkgColor: "{color.background.support.danger}",
  critBorderColor: "{color.border.support.danger}",
  doneTaskBkgColor: "{color.background.neutral.04}",
  doneTaskBorderColor: "{color.border.neutral.03}",
  excludeBkgColor: "{color.background.neutral.02}",
  gridColor: "{color.border.neutral.01}",
  innerEndBackground: "{color.text.neutral.primary}",
  labelBackgroundColor: "{color.background.neutral.02}",
  labelColor: "{color.text.neutral.primary}",
  sectionBkgColor: "{color.background.neutral.01}",
  sectionBkgColor2: "{color.background.neutral.02}",
  specialStateColor: "{color.text.neutral.primary}",
  stateBkg: "{color.background.neutral.02}",
  stateLabelColor: "{color.text.neutral.primary}",
  taskBkgColor: "{color.background.brand.primary}",
  taskBorderColor: "{color.border.brand.primary}",
  taskTextClickableColor: "{color.text.brand.primary}",
  taskTextColor: "{color.text.neutral.primary}",
  taskTextDarkColor: "{color.text.neutral.primary}",
  taskTextLightColor: "{color.text.neutral.primary}",
  taskTextOutsideColor: "{color.text.neutral.primary}",
  todayLineColor: "{color.background.support.danger}",
  transitionColor: "{color.text.neutral.primary}",
  transitionLabelColor: "{color.text.neutral.secondary}",
  vertLineColor: "{color.border.neutral.01}",

  /* group: Git Graph */
  commitLabelBackground: "{color.background.neutral.02}",
  commitLabelColor: "{color.text.neutral.primary}",
  git0: "{color.category.blue.medium}",
  git1: "{color.category.teal.medium}",
  git2: "{color.category.green.medium}",
  git3: "{color.category.orange.medium}",
  git4: "{color.category.purple.medium}",
  git5: "{color.category.red.medium}",
  git6: "{color.category.cyan.medium}",
  git7: "{color.category.magenta.medium}",
  gitBranchLabel0: "{color.text.neutral.primary}",
  gitBranchLabel1: "{color.text.neutral.primary}",
  gitBranchLabel2: "{color.text.neutral.primary}",
  gitBranchLabel3: "{color.text.neutral.primary}",
  gitBranchLabel4: "{color.text.neutral.primary}",
  gitBranchLabel5: "{color.text.neutral.primary}",
  gitBranchLabel6: "{color.text.neutral.primary}",
  gitBranchLabel7: "{color.text.neutral.primary}",
  gitInv0: "{color.text.neutral.primary}",
  gitInv1: "{color.text.neutral.primary}",
  gitInv2: "{color.text.neutral.primary}",
  gitInv3: "{color.text.neutral.primary}",
  gitInv4: "{color.text.neutral.primary}",
  gitInv5: "{color.text.neutral.primary}",
  gitInv6: "{color.text.neutral.primary}",
  gitInv7: "{color.text.neutral.primary}",
  tagLabelBackground: "{color.background.neutral.03}",
  tagLabelBorder: "{color.border.neutral.02}",
  tagLabelColor: "{color.text.neutral.primary}",

  /* group: cScale */
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
  cScale10: "{color.category.blue.medium}",
  cScale11: "{color.category.teal.medium}",
  cScaleInv0: "{color.text.neutral.primary}",
  cScaleInv1: "{color.text.neutral.primary}",
  cScaleInv2: "{color.text.neutral.primary}",
  cScaleInv3: "{color.text.neutral.primary}",
  cScaleInv4: "{color.text.neutral.primary}",
  cScaleInv5: "{color.text.neutral.primary}",
  cScaleInv6: "{color.text.neutral.primary}",
  cScaleInv7: "{color.text.neutral.primary}",
  cScaleInv8: "{color.text.neutral.primary}",
  cScaleInv9: "{color.text.neutral.primary}",
  cScaleInv10: "{color.text.neutral.primary}",
  cScaleInv11: "{color.text.neutral.primary}",
  cScaleLabel0: "{color.text.neutral.primary}",
  cScaleLabel1: "{color.text.neutral.primary}",
  cScaleLabel2: "{color.text.neutral.primary}",
  cScaleLabel3: "{color.text.neutral.primary}",
  cScaleLabel4: "{color.text.neutral.primary}",
  cScaleLabel5: "{color.text.neutral.primary}",
  cScaleLabel6: "{color.text.neutral.primary}",
  cScaleLabel7: "{color.text.neutral.primary}",
  cScaleLabel8: "{color.text.neutral.primary}",
  cScaleLabel9: "{color.text.neutral.primary}",
  cScaleLabel10: "{color.text.neutral.primary}",
  cScaleLabel11: "{color.text.neutral.primary}",
  cScalePeer0: "{color.category.blue.medium}",
  cScalePeer1: "{color.category.teal.medium}",
  cScalePeer2: "{color.category.green.medium}",
  cScalePeer3: "{color.category.kiwi.medium}",
  cScalePeer4: "{color.category.yellow.medium}",
  cScalePeer5: "{color.category.orange.medium}",
  cScalePeer6: "{color.category.red.medium}",
  cScalePeer7: "{color.category.magenta.medium}",
  cScalePeer8: "{color.category.purple.medium}",
  cScalePeer9: "{color.category.cyan.medium}",
  cScalePeer10: "{color.category.blue.medium}",
  cScalePeer11: "{color.category.teal.medium}",
  scaleLabelColor: "{color.text.neutral.primary}",

  /* group: Surface */
  surface0: "{color.background.neutral.00}",
  surface1: "{color.background.neutral.01}",
  surface2: "{color.background.neutral.02}",
  surface3: "{color.background.neutral.03}",
  surface4: "{color.background.neutral.04}",
  surfacePeer0: "{color.background.neutral.01}",
  surfacePeer1: "{color.background.neutral.02}",
  surfacePeer2: "{color.background.neutral.03}",
  surfacePeer3: "{color.background.neutral.04}",
  surfacePeer4: "{color.background.neutral.05}",

  /* group: Pie */
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
  pie10: "{color.category.blue.medium}",
  pie11: "{color.category.teal.medium}",
  pieLegendTextColor: "{color.text.neutral.primary}",
  pieOuterStrokeColor: "{color.border.neutral.02}",
  pieSectionTextColor: "{color.text.neutral.primary}",
  pieStrokeColor: "{color.border.neutral.02}",
  pieTitleTextColor: "{color.text.neutral.primary}",

  /* group: Fill types */
  fillType0: "{color.category.blue.medium}",
  fillType1: "{color.category.teal.medium}",
  fillType2: "{color.category.green.medium}",
  fillType3: "{color.category.orange.medium}",
  fillType4: "{color.category.purple.medium}",
  fillType5: "{color.category.red.medium}",
  fillType6: "{color.category.cyan.medium}",
  fillType7: "{color.category.magenta.medium}",

  /* group: C4 Context */
  personBkg: "{color.background.brand.primary}",
  personBorder: "{color.border.brand.primary}",

  /* group: Architecture */
  archEdgeArrowColor: "{color.text.neutral.primary}",
  archEdgeColor: "{color.border.neutral.03}",
  archGroupBorderColor: "{color.border.neutral.02}",

  /* group: Entity Relationship */
  attributeBackgroundColorEven: "{color.background.neutral.01}",
  attributeBackgroundColorOdd: "{color.background.neutral.01}",
  rowEven: "{color.background.neutral.01}",
  rowOdd: "{color.background.neutral.01}",

  /* group: Requirement */
  relationColor: "{color.text.neutral.primary}",
  relationLabelBackground: "{color.background.neutral.02}",
  relationLabelColor: "{color.text.neutral.primary}",
  requirementBackground: "{color.background.neutral.01}",
  requirementBorderColor: "{color.border.neutral.02}",
  requirementTextColor: "{color.text.neutral.primary}",

  /* group: Quadrant */
  quadrant1Fill: "{color.category.blue.medium}",
  quadrant1TextFill: "{color.text.neutral.primary}",
  quadrant2Fill: "{color.category.teal.medium}",
  quadrant2TextFill: "{color.text.neutral.primary}",
  quadrant3Fill: "{color.category.green.medium}",
  quadrant3TextFill: "{color.text.neutral.primary}",
  quadrant4Fill: "{color.category.orange.medium}",
  quadrant4TextFill: "{color.text.neutral.primary}",
  quadrantExternalBorderStrokeFill: "{color.border.neutral.02}",
  quadrantInternalBorderStrokeFill: "{color.border.neutral.01}",
  quadrantPointFill: "{color.background.brand.primary}",
  quadrantPointTextFill: "{color.text.neutral.primary}",
  quadrantTitleFill: "{color.text.neutral.primary}",
  quadrantXAxisTextFill: "{color.text.neutral.secondary}",
  quadrantYAxisTextFill: "{color.text.neutral.secondary}",

  /* group: Class */
  classText: "{color.text.neutral.primary}",

  /* group: Error */
  errorBkgColor: "{color.background.support.danger-subtle}",
  errorTextColor: "{color.text.support.danger}",
}

/**
 * Nested theme objects that are set as sub-objects on themeVariables.
 * Each key is the parent property name; value is a sub-mapping.
 */
const nestedTokenMap: Record<string, Record<string, string>> = {
  packet: {
    blockFillColor: "{color.background.neutral.02}",
    blockStrokeColor: "{color.border.neutral.02}",
    endByteColor: "{color.text.neutral.secondary}",
    labelColor: "{color.text.neutral.primary}",
    startByteColor: "{color.text.neutral.secondary}",
    titleColor: "{color.text.neutral.primary}",
  },
  xyChart: {
    backgroundColor: "{color.surface.primary}",
    titleColor: "{color.text.neutral.primary}",
    xAxisLabelColor: "{color.text.neutral.secondary}",
    xAxisLineColor: "{color.border.neutral.02}",
    xAxisTickColor: "{color.border.neutral.02}",
    xAxisTitleColor: "{color.text.neutral.primary}",
    yAxisLabelColor: "{color.text.neutral.secondary}",
    yAxisLineColor: "{color.border.neutral.02}",
    yAxisTickColor: "{color.border.neutral.02}",
    yAxisTitleColor: "{color.text.neutral.primary}",
  },
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

function resolveToken(
  dictionary: FormatFnArguments["dictionary"],
  tokenKey: string,
): string | undefined {
  const token = dictionary.tokenMap.get(tokenKey)
  if (!token) {
    return undefined
  }
  const value = token.$value ?? token.value
  if (value == null) {
    return undefined
  }
  return token.$type === "color" ? toHex(String(value)) : String(value)
}

export function mermaidThemeFormat({
  dictionary,
  file,
}: FormatFnArguments): string {
  const entries: string[] = []

  for (const [mermaidProp, tokenKey] of Object.entries(tokenToMermaidMap)) {
    const resolved = resolveToken(dictionary, tokenKey)
    if (resolved == null) {
      continue
    }
    entries.push(`  ${mermaidProp}: ${JSON.stringify(resolved)},`)
  }

  for (const [parentProp, subMap] of Object.entries(nestedTokenMap)) {
    const subEntries: string[] = []
    for (const [childProp, tokenKey] of Object.entries(subMap)) {
      const resolved = resolveToken(dictionary, tokenKey)
      if (resolved == null) {
        continue
      }
      subEntries.push(`    ${childProp}: ${JSON.stringify(resolved)},`)
    }
    if (subEntries.length > 0) {
      entries.push(`  ${parentProp}: {`)
      entries.push(...subEntries)
      entries.push("  },")
    }
  }

  const exportName = exportNameFromDestination(file.destination!)

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
