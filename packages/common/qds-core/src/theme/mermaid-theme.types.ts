export interface MermaidXYChartTheme {
  backgroundColor?: string
  plotColorPalette?: string
  titleColor?: string
  xAxisLabelColor?: string
  xAxisLineColor?: string
  xAxisTickColor?: string
  xAxisTitleColor?: string
  yAxisLabelColor?: string
  yAxisLineColor?: string
  yAxisTickColor?: string
  yAxisTitleColor?: string
}

export interface MermaidPacketTheme {
  blockFillColor?: string
  blockStrokeColor?: string
  endByteColor?: string
  labelColor?: string
  startByteColor?: string
  titleColor?: string
}

export interface MermaidRadarTheme {
  axisColor?: string
  axisLabelFontSize?: number
  axisStrokeWidth?: number
  curveOpacity?: number
  curveStrokeWidth?: number
  graticuleColor?: string
  graticuleOpacity?: number
  graticuleStrokeWidth?: number
  legendBoxSize?: number
  legendFontSize?: number
}

/**
 * TypeScript interface for mermaid theme variables. Derived from the internal
 * `Theme` class in mermaid's `theme-dark.d.ts` which is not exported.
 *
 * All properties are optional since mermaid derives unset values from base
 * colors via `getThemeVariables()`.
 */
export interface MermaidThemeVariables {
  /* group: Core colors */
  background?: string
  lineColor?: string
  primaryBorderColor?: string
  primaryColor?: string
  primaryTextColor?: string
  secondaryBorderColor?: string
  secondaryColor?: string
  secondaryTextColor?: string
  tertiaryBorderColor?: string
  tertiaryColor?: string
  tertiaryTextColor?: string
  textColor?: string

  /* group: Base */
  darkTextColor?: string
  fontFamily?: string
  fontSize?: string
  mainBkg?: string
  mainContrastColor?: string
  secondBkg?: string
  THEME_COLOR_LIMIT?: number

  /* group: Flowchart */
  arrowheadColor?: string
  border1?: string
  border2?: string
  clusterBkg?: string
  clusterBorder?: string
  defaultLinkColor?: string
  edgeLabelBackground?: string
  labelBackground?: string
  nodeBkg?: string
  nodeBorder?: string
  titleColor?: string

  /* group: Sequence Diagram */
  activationBkgColor?: string
  activationBorderColor?: string
  actorBkg?: string
  actorBorder?: string
  actorLineColor?: string
  actorTextColor?: string
  labelBoxBkgColor?: string
  labelBoxBorderColor?: string
  labelTextColor?: string
  loopTextColor?: string
  noteBkgColor?: string
  noteBorderColor?: string
  noteTextColor?: string
  sequenceNumberColor?: string
  signalColor?: string
  signalTextColor?: string

  /* group: Gantt */
  activeTaskBkgColor?: string
  activeTaskBorderColor?: string
  altBackground?: string
  altSectionBkgColor?: string
  compositeBackground?: string
  compositeBorder?: string
  compositeTitleBackground?: string
  critBkgColor?: string
  critBorderColor?: string
  doneTaskBkgColor?: string
  doneTaskBorderColor?: string
  excludeBkgColor?: string
  gridColor?: string
  innerEndBackground?: string
  labelBackgroundColor?: string
  labelColor?: string
  sectionBkgColor?: string
  sectionBkgColor2?: string
  specialStateColor?: string
  /* State */
  stateBkg?: string

  stateLabelColor?: string
  taskBkgColor?: string
  taskBorderColor?: string
  taskTextClickableColor?: string
  taskTextColor?: string
  taskTextDarkColor?: string
  taskTextLightColor?: string
  taskTextOutsideColor?: string
  todayLineColor?: string
  transitionColor?: string
  transitionLabelColor?: string
  vertLineColor?: string

  /* group: Git Graph */
  commitLabelBackground?: string
  commitLabelColor?: string
  commitLabelFontSize?: string
  git0?: string
  git1?: string
  git2?: string
  git3?: string
  git4?: string
  git5?: string
  git6?: string
  git7?: string
  gitBranchLabel0?: string
  gitBranchLabel1?: string
  gitBranchLabel2?: string
  gitBranchLabel3?: string
  gitBranchLabel4?: string
  gitBranchLabel5?: string
  gitBranchLabel6?: string
  gitBranchLabel7?: string
  gitInv0?: string
  gitInv1?: string
  gitInv2?: string
  gitInv3?: string
  gitInv4?: string
  gitInv5?: string
  gitInv6?: string
  gitInv7?: string
  tagLabelBackground?: string
  tagLabelBorder?: string
  tagLabelColor?: string
  tagLabelFontSize?: string

  /* group: cScale / Color Scale */
  cScale0?: string
  cScale1?: string
  cScale2?: string
  cScale3?: string
  cScale4?: string
  cScale5?: string
  cScale6?: string
  cScale7?: string
  cScale8?: string
  cScale9?: string
  cScale10?: string
  cScale11?: string
  cScale12?: string
  cScaleInv0?: string
  cScaleInv1?: string
  cScaleInv2?: string
  cScaleInv3?: string
  cScaleInv4?: string
  cScaleInv5?: string
  cScaleInv6?: string
  cScaleInv7?: string
  cScaleInv8?: string
  cScaleInv9?: string
  cScaleInv10?: string
  cScaleInv11?: string
  cScaleLabel0?: string
  cScaleLabel1?: string
  cScaleLabel2?: string
  cScaleLabel3?: string
  cScaleLabel4?: string
  cScaleLabel5?: string
  cScaleLabel6?: string
  cScaleLabel7?: string
  cScaleLabel8?: string
  cScaleLabel9?: string
  cScaleLabel10?: string
  cScaleLabel11?: string
  cScalePeer0?: string
  cScalePeer1?: string
  cScalePeer2?: string
  cScalePeer3?: string
  cScalePeer4?: string
  cScalePeer5?: string
  cScalePeer6?: string
  cScalePeer7?: string
  cScalePeer8?: string
  cScalePeer9?: string
  cScalePeer10?: string
  cScalePeer11?: string
  scaleLabelColor?: string

  /* group: Surface */
  surface0?: string
  surface1?: string
  surface2?: string
  surface3?: string
  surface4?: string
  surfacePeer0?: string
  surfacePeer1?: string
  surfacePeer2?: string
  surfacePeer3?: string
  surfacePeer4?: string

  /* group: Pie */
  pie0?: string
  pie1?: string
  pie2?: string
  pie3?: string
  pie4?: string
  pie5?: string
  pie6?: string
  pie7?: string
  pie8?: string
  pie9?: string
  pie10?: string
  pie11?: string
  pieLegendTextColor?: string
  pieLegendTextSize?: string
  pieOpacity?: string
  pieOuterStrokeColor?: string
  pieOuterStrokeWidth?: string
  pieSectionTextColor?: string
  pieSectionTextSize?: string
  pieStrokeColor?: string
  pieStrokeWidth?: string
  pieTitleTextColor?: string
  pieTitleTextSize?: string

  /* group: Fill types */
  fillType0?: string
  fillType1?: string
  fillType2?: string
  fillType3?: string
  fillType4?: string
  fillType5?: string
  fillType6?: string
  fillType7?: string

  /* group: C4 Context */
  personBkg?: string
  personBorder?: string

  /* group: Architecture */
  archEdgeArrowColor?: string
  archEdgeColor?: string
  archEdgeWidth?: string
  archGroupBorderColor?: string
  archGroupBorderWidth?: string

  /* group: Entity Relationship */
  attributeBackgroundColorEven?: string
  attributeBackgroundColorOdd?: string
  rowEven?: string
  rowOdd?: string

  /* group: Requirement */
  relationColor?: string
  relationLabelBackground?: string
  relationLabelColor?: string
  requirementBackground?: string
  requirementBorderColor?: string
  requirementBorderSize?: string
  requirementTextColor?: string

  /* group: Quadrant */
  quadrant1Fill?: string
  quadrant1TextFill?: string
  quadrant2Fill?: string
  quadrant2TextFill?: string
  quadrant3Fill?: string
  quadrant3TextFill?: string
  quadrant4Fill?: string
  quadrant4TextFill?: string
  quadrantExternalBorderStrokeFill?: string
  quadrantInternalBorderStrokeFill?: string
  quadrantPointFill?: string
  quadrantPointTextFill?: string
  quadrantTitleFill?: string
  quadrantXAxisTextFill?: string
  quadrantYAxisTextFill?: string

  /* group: XY Chart */
  xyChart?: MermaidXYChartTheme

  /* group: Packet */
  packet?: MermaidPacketTheme

  /* group: Radar */
  radar?: MermaidRadarTheme

  /* group: Class */
  classText?: string

  /* group: Error */
  errorBkgColor?: string
  errorTextColor?: string
}
