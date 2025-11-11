// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {BasicThemeData} from "./theme.types"

export interface FontVariables {
  font: string
  fontFamily: string
  fontSize: string
  fontStretch: string
  fontWeight: string
  letterSpacing?: string
  lineHeight: string
}

export interface TailwindFontClasses {
  fontFamily: string
  fontSize: string
  fontWeight: string
  lineHeight: string
}

export interface FontData {
  cssClass: string
  tailwindClasses: TailwindFontClasses
  variables: FontVariables
}

const headingXxxl = {
  cssClass: "q-font-heading-xxxl",
  tailwindClasses: {
    fontFamily: "font-brand",
    fontSize: "text-h-3xl",
    fontWeight: "font-medium",
    lineHeight: "leading-h-3xl",
  },
  variables: {
    font: "--q-font-heading-xxxl",
    fontFamily: "--q-font-family-brand",
    fontSize: "--q-font-size-heading-xxxl",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-medium",
    lineHeight: "--q-line-height-heading-xxxl",
  },
}

const headingXxl: FontData = {
  cssClass: "q-font-heading-xxl",
  tailwindClasses: {
    fontFamily: "font-brand",
    fontSize: "text-h-2xl",
    fontWeight: "font-medium",
    lineHeight: "leading-h-2xl",
  },
  variables: {
    font: "--q-font-heading-xxl",
    fontFamily: "--q-font-family-brand",
    fontSize: "--q-font-size-heading-xxl",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-medium",
    lineHeight: "--q-line-height-heading-xxl",
  },
}

const headingXl: FontData = {
  cssClass: "q-font-heading-xl",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-h-xl",
    fontWeight: "font-bold",
    lineHeight: "leading-h-xl",
  },
  variables: {
    font: "--q-font-heading-xl",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-heading-xl",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-bold",
    lineHeight: "--q-line-height-heading-xl",
  },
}

const headingLg: FontData = {
  cssClass: "q-font-heading-lg",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-h-lg",
    fontWeight: "font-bold",
    lineHeight: "leading-h-lg",
  },
  variables: {
    font: "--q-font-heading-lg",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-heading-l",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-bold",
    lineHeight: "--q-line-height-heading-l",
  },
}

const headingMd: FontData = {
  cssClass: "q-font-heading-md",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-h-md",
    fontWeight: "font-bold",
    lineHeight: "leading-h-md",
  },
  variables: {
    font: "--q-font-heading-md",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-heading-m",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-bold",
    lineHeight: "--q-line-height-heading-m",
  },
}

const headingSm: FontData = {
  cssClass: "q-font-heading-sm",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-h-sm",
    fontWeight: "font-bold",
    lineHeight: "leading-h-sm",
  },
  variables: {
    font: "--q-font-heading-sm",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-heading-s",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-bold",
    lineHeight: "--q-line-height-heading-s",
  },
}

const headingXs: FontData = {
  cssClass: "q-font-heading-xs",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-h-xs",
    fontWeight: "font-bold",
    lineHeight: "leading-h-xs",
  },
  variables: {
    font: "--q-font-heading-xs",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-heading-xs",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-bold",
    lineHeight: "--q-line-height-heading-xs",
  },
}

const headingXxs: FontData = {
  cssClass: "q-font-heading-xxs",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-h-xxs",
    fontWeight: "font-bold",
    lineHeight: "leading-h-xxs",
  },
  variables: {
    font: "--q-font-heading-xxs",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-heading-xxs",
    fontStretch: "--q-font-stretch-heading",
    fontWeight: "--q-font-weight-bold",
    lineHeight: "--q-line-height-heading-xxs",
  },
}

/**
 * TODO: source these somehow?
 * Currently, we have to define these twice: once in the CSS and again here.
 */
const heading: FontData[] = [
  headingXxxl,
  headingXxl,
  headingXl,
  headingLg,
  headingMd,
  headingSm,
  headingXs,
  headingXxs,
]

const headingSubtle: FontData[] = [
  {
    cssClass: `${headingXxxl.cssClass}-subtle`,
    tailwindClasses: headingXxxl.tailwindClasses,
    variables: {
      ...headingXxxl.variables,
      font: `${headingXxxl.variables.font}-subtle`,
      fontWeight: "--q-font-weight-regular",
    },
  },
  {
    cssClass: `${headingXxl.cssClass}-subtle`,
    tailwindClasses: headingXxl.tailwindClasses,
    variables: {
      ...headingXxl.variables,
      font: `${headingXxl.variables.font}-subtle`,
      fontWeight: "--q-font-weight-regular",
    },
  },
  ...[headingXl, headingLg, headingMd, headingSm, headingXs, headingXxs].map(
    (h) => ({
      cssClass: `${h.cssClass}-subtle`,
      tailwindClasses: h.tailwindClasses,
      variables: {
        ...h.variables,
        font: `${h.variables.font}-subtle`,
        fontWeight: "--q-font-weight-heading-subtle",
      },
    }),
  ),
]

const bodyXxl: FontData = {
  cssClass: "q-font-body-xxl",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-2xl",
    fontWeight: "font-normal",
    lineHeight: "leading-2xl",
  },
  variables: {
    font: "--q-font-body-xxl",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-body-xxl",
    fontStretch: "--q-font-stretch-body",
    fontWeight: "--q-font-weight-regular",
    lineHeight: "--q-line-height-body-xxl",
  },
}

const bodyXl: FontData = {
  cssClass: "q-font-body-xl",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-xl",
    fontWeight: "font-normal",
    lineHeight: "leading-xl",
  },
  variables: {
    font: "--q-font-body-xl",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-body-xl",
    fontStretch: "--q-font-stretch-body",
    fontWeight: "--q-font-weight-regular",
    lineHeight: "--q-line-height-body-xl",
  },
}

const bodyLg: FontData = {
  cssClass: "q-font-body-lg",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-lg",
    fontWeight: "font-normal",
    lineHeight: "leading-lg",
  },
  variables: {
    font: "--q-font-body-lg",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-body-l",
    fontStretch: "--q-font-stretch-body",
    fontWeight: "--q-font-weight-regular",
    lineHeight: "--q-line-height-body-l",
  },
}

const bodyMd: FontData = {
  cssClass: "q-font-body-md",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-md",
    fontWeight: "font-normal",
    lineHeight: "leading-md",
  },
  variables: {
    font: "--q-font-body-md",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-body-m",
    fontStretch: "--q-font-stretch-body",
    fontWeight: "--q-font-weight-regular",
    lineHeight: "--q-line-height-body-m",
  },
}

const bodySm: FontData = {
  cssClass: "q-font-body-sm",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-sm",
    fontWeight: "font-normal",
    lineHeight: "leading-sm",
  },
  variables: {
    font: "--q-font-body-sm",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-body-s",
    fontStretch: "--q-font-stretch-body",
    fontWeight: "--q-font-weight-regular",
    lineHeight: "--q-line-height-body-s",
  },
}

const bodyXs: FontData = {
  cssClass: "q-font-body-xs",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-xs",
    fontWeight: "font-normal",
    lineHeight: "leading-xs",
  },
  variables: {
    font: "--q-font-body-xs",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-body-xs",
    fontStretch: "--q-font-stretch-body",
    fontWeight: "--q-font-weight-regular",
    lineHeight: "--q-line-height-body-xs",
  },
}

const bodyXxs: FontData = {
  cssClass: "q-font-body-xxs",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-xxs",
    fontWeight: "font-normal",
    lineHeight: "leading-xxs",
  },
  variables: {
    font: "--q-font-body-xxs",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-body-xxs",
    fontStretch: "--q-font-stretch-body",
    fontWeight: "--q-font-weight-regular",
    lineHeight: "--q-line-height-body-xxs",
  },
}

const body: FontData[] = [
  bodyXxl,
  bodyXl,
  bodyLg,
  bodyMd,
  bodySm,
  bodyXs,
  bodyXxs,
]

const bodyStrong = body.map((h) => ({
  cssClass: `${h.cssClass}-strong`,
  tailwindClasses: {...h.tailwindClasses, fontWeight: "font-semibold"},
  variables: {
    ...h.variables,
    font: `${h.variables.font}-strong`,
    fontWeight: "--q-font-weight-semi-bold",
  },
}))

const metadataXl: FontData = {
  cssClass: "q-font-metadata-xl",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-m-xl",
    fontWeight: "font-semibold",
    lineHeight: "leading-m-xl",
  },
  variables: {
    font: "--q-font-metadata-xl",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-metadata-xl",
    fontStretch: "--q-font-stretch-metadata",
    fontWeight: "--q-font-weight-semi-bold",
    letterSpacing: "--q-letter-spacing-metadata-xl",
    lineHeight: "--q-line-height-metadata-xl",
  },
}

const metadataLg: FontData = {
  cssClass: "q-font-metadata-lg",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-m-lg",
    fontWeight: "font-semibold",
    lineHeight: "leading-m-lg",
  },
  variables: {
    font: "--q-font-metadata-lg",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-metadata-l",
    fontStretch: "--q-font-stretch-metadata",
    fontWeight: "--q-font-weight-semi-bold",
    letterSpacing: "--q-letter-spacing-metadata-l",
    lineHeight: "--q-line-height-metadata-l",
  },
}

const metadataMd: FontData = {
  cssClass: "q-font-metadata-md",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-m-md",
    fontWeight: "font-semibold",
    lineHeight: "leading-m-md",
  },
  variables: {
    font: "--q-font-metadata-md",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-metadata-m",
    fontStretch: "--q-font-stretch-metadata",
    fontWeight: "--q-font-weight-semi-bold",
    letterSpacing: "--q-letter-spacing-metadata-m",
    lineHeight: "--q-line-height-metadata-m",
  },
}

const metadataSm: FontData = {
  cssClass: "q-font-metadata-sm",
  tailwindClasses: {
    fontFamily: "font-sans",
    fontSize: "text-m-sm",
    fontWeight: "font-semibold",
    lineHeight: "leading-m-sm",
  },
  variables: {
    font: "--q-font-metadata-sm",
    fontFamily: "--q-font-family",
    fontSize: "--q-font-size-metadata-s",
    fontStretch: "--q-font-stretch-metadata",
    fontWeight: "--q-font-weight-semi-bold",
    letterSpacing: "--q-letter-spacing-metadata-s",
    lineHeight: "--q-line-height-metadata-s",
  },
}

const metadata: FontData[] = [metadataXl, metadataLg, metadataMd, metadataSm]

const metadataStrong: FontData[] = metadata.map((m) => ({
  cssClass: `${m.cssClass}-strong`,
  tailwindClasses: {...m.tailwindClasses, fontWeight: "font-extrabold"},
  variables: {
    ...m.variables,
    font: `${m.variables.font}-strong`,
    fontWeight: "--q-font-weight-extra-bold",
  },
}))

const weights: BasicThemeData[] = [
  {tailwind: "font-normal", variable: "--q-font-weight-regular"},
  {tailwind: "font-medium", variable: "--q-font-weight-medium"},
  {
    tailwind: "font-semibold",
    variable: "--q-font-weight-semi-bold",
  },
  {tailwind: "font-bold", variable: "--q-font-weight-bold"},
  {
    tailwind: "font-extrabold",
    variable: "--q-font-weight-extra-bold",
  },
]

const fontStretch: BasicThemeData[] = [
  {
    tailwind: "font-stretch-normal",
    variable: "--q-font-stretch-normal",
  },
  {
    tailwind: "font-stretch-wide",
    variable: "--q-font-stretch-wide",
  },
]

export const themeFonts = {
  body,
  bodyStrong,
  fontStretch,
  heading,
  headingSubtle,
  metadata,
  metadataStrong,
  weights,
}
