export type JsonPrimitiveValue = string | number | boolean | null
export type JsonObject = {
  [name: string]: JsonValue
}
export type JsonArray = JsonValue[]
export type JsonValue = JsonPrimitiveValue | JsonArray | JsonObject

export type AliasValue = `{${string}}`

export type WithAliasValue<T> = T | AliasValue

export const ALIAS_PATH_SEPARATOR = "."

export type GroupProperties = {
  $description?: string
  $extensions?: JsonObject
  $type?: TokenTypeName
}

export type JsonTokenTree =
  | (GroupProperties & {
      [key: string]: DesignToken | JsonTokenTree | GroupProperties
    })
  | DesignToken

export type TokenSignature<Type extends string, Value extends JsonValue> = {
  $deprecated?: boolean | string
  $description?: string
  $extensions?: JsonObject
  $type?: Type
  $value: Value
}

// Type declaration following the https://tr.designtokens.org/format specification

// 8.1 Color, following the https://tr.designtokens.org/color specification
export type ColorTypeName = "color"

type ColorSpaceValues =
  | "srgb"
  | "srgb-linear"
  | "hsl"
  | "hwb"
  | "lab"
  | "lch"
  | "oklab"
  | "oklch"
  | "display-p3"
  | "a98-rgb"
  | "prophoto-rgb"
  | "rec2020"
  | "xyz-d65"
  | "xyz-d50"

export type ColorRawValue = {
  alpha?: number
  colorSpace: ColorSpaceValues
  components: [number | "none", number | "none", number | "none"]
  hex?: `#${string}`
}
export type ColorValue = WithAliasValue<ColorRawValue>
export type ColorToken = TokenSignature<ColorTypeName, ColorValue>

// 8.2 Dimension
export type DimensionTypeName = "dimension"
export type DimensionRawValue = {unit: "px" | "rem"; value: number | string}
export type DimensionValue = WithAliasValue<DimensionRawValue>
export type DimensionToken = TokenSignature<DimensionTypeName, DimensionValue>

// 8.3 Font Family
export type FontFamilyTypeName = "fontFamily"
export type FontFamilyRawValue = string | Array<string>
export type FontFamilyValue = WithAliasValue<FontFamilyRawValue>
export type FontFamilyToken = TokenSignature<
  FontFamilyTypeName,
  FontFamilyValue
>

// 8.4 Font Weight
export type FontWeightTypeName = "fontWeight"
export type FontWeightBuiltInValue =
  | "thin"
  | "hairline"
  | "extra-light"
  | "ultra-light"
  | "light"
  | "normal"
  | "regular"
  | "book"
  | "medium"
  | "semi-bold"
  | "demi-bold"
  | "bold"
  | "extra-bold"
  | "ultra-bold"
  | "black"
  | "heavy"
  | "extra-black"
  | "ultra-black"
export type FontWeightRawValue = FontWeightBuiltInValue | number | string
export type FontWeightValue = WithAliasValue<FontWeightRawValue>
export type FontWeightToken = TokenSignature<
  FontWeightTypeName,
  FontWeightValue
>

// 8.5 Duration
export type DurationTypeName = "duration"
export type DurationRawValue = {unit: "ms" | "s"; value: number}
export type DurationValue = WithAliasValue<DurationRawValue>
export type DurationToken = TokenSignature<DurationTypeName, DurationValue>

// 8.6 Cubic Bezier
export type CubicBezierTypeName = "cubicBezier"
export type CubicBezierRawValue = [number, number, number, number]
export type CubicBezierValue = WithAliasValue<CubicBezierRawValue>
export type CubicBezierToken = TokenSignature<
  CubicBezierTypeName,
  CubicBezierValue
>

// 8.7 Number
export type NumberTypeName = "number"
export type NumberRawValue = number
export type NumberValue = WithAliasValue<NumberRawValue>
export type NumberToken = TokenSignature<NumberTypeName, NumberValue>

/*
   9. Composite Types
   https://tr.designtokens.org/format/#composite-types
*/
// 9.2 Stroke Style
export type StrokeStyleTypeName = "strokeStyle"
export const strokeStyleStringValues = [
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove",
  "ridge",
  "outset",
  "inset",
] as const
export const strokeStyleLineCapValues = ["round", "butt", "square"] as const
export type StrokeStyleRawValue =
  | (typeof strokeStyleStringValues)[number]
  | {
      dashArray: DimensionValue[]
      lineCap: (typeof strokeStyleLineCapValues)[number]
    }
export type StrokeStyleValue = WithAliasValue<StrokeStyleRawValue>
export type StrokeStyleToken = TokenSignature<
  StrokeStyleTypeName,
  StrokeStyleValue
>

// 9.3 Border
export type BorderTypeName = "border"
export type BorderRawValue = {
  color: ColorValue
  style: StrokeStyleValue
  width: DimensionValue
}
export type BorderValue = WithAliasValue<BorderRawValue>
export type BorderToken = TokenSignature<BorderTypeName, BorderValue>

// 9.4 Transition
export type TransitionTypeName = "transition"
export type TransitionRawValue = {
  delay: DurationValue
  duration: DurationValue
  timingFunction: CubicBezierValue
}
export type TransitionValue = WithAliasValue<TransitionRawValue>
export type TransitionToken = TokenSignature<
  TransitionTypeName,
  TransitionValue
>

// 9.5 Shadow
export type ShadowTypeName = "shadow"
export type ShadowRawValue =
  | Array<{
      blur: DimensionValue
      color: ColorValue
      inset?: boolean
      offsetX: DimensionValue
      offsetY: DimensionValue
      spread: DimensionValue
    }>
  | {
      blur: DimensionValue
      color: ColorValue
      inset?: boolean
      offsetX: DimensionValue
      offsetY: DimensionValue
      spread: DimensionValue
    }
export type ShadowValue = WithAliasValue<ShadowRawValue>
export type ShadowToken = TokenSignature<ShadowTypeName, ShadowValue>

// 9.6 Gradient
export type GradientTypeName = "gradient"
export type GradientRawValue = Array<{
  color: ColorValue
  position: NumberValue
}>
export type GradientValue = WithAliasValue<GradientRawValue>
export type GradientToken = TokenSignature<GradientTypeName, GradientValue>

// 9.7 Typography
export type TypographyTypeName = "typography"
export type TypographyRawValue = {
  fontFamily?: FontFamilyValue | undefined
  fontSize?: NumberValue | DimensionValue | undefined
  fontWeight?: FontWeightValue | undefined
  letterSpacing?: NumberValue | DimensionValue | undefined
  lineHeight?: NumberValue | DimensionValue | undefined
}

export type TypographyValue = WithAliasValue<TypographyRawValue>
export type TypographyToken = TokenSignature<
  TypographyTypeName,
  TypographyValue
>

export type TokenTypeName =
  | ColorTypeName
  | DimensionTypeName
  | FontFamilyTypeName
  | FontWeightTypeName
  | DurationTypeName
  | CubicBezierTypeName
  | NumberTypeName
  | StrokeStyleTypeName
  | BorderTypeName
  | TransitionTypeName
  | ShadowTypeName
  | GradientTypeName
  | TypographyTypeName

export type TokenType =
  | TokenTypeName
  | "lineHeight"
  | "fontSize"
  | "fontStretch"
  | "boolean"
  | "string"
  | "number"

export type DesignToken =
  | ColorToken
  | DimensionToken
  | FontFamilyToken
  | FontWeightToken
  | DurationToken
  | CubicBezierToken
  | NumberToken
  | StrokeStyleToken
  | BorderToken
  | TransitionToken
  | ShadowToken
  | GradientToken
  | TypographyToken

export type PickTokenByType<T extends TokenTypeName> = {
  border: BorderToken
  color: ColorToken
  cubicBezier: CubicBezierToken
  dimension: DimensionToken
  duration: DurationToken
  fontFamily: FontFamilyToken
  fontWeight: FontWeightToken
  gradient: GradientToken
  number: NumberToken
  shadow: ShadowToken
  strokeStyle: StrokeStyleToken
  transition: TransitionToken
  typography: TypographyToken
}[T]
