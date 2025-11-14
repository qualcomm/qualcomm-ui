// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface FontData {
  tailwind: string
  variable: string
}

const display: FontData[] = [
  {tailwind: "font-display-lg", variable: "--font-static-display-lg"},
  {tailwind: "font-display-md", variable: "--font-static-display-md"},
]

const dynamicDisplay: FontData[] = [
  {tailwind: "font-dynamic-display-lg", variable: "--font-dynamic-display-lg"},
  {tailwind: "font-dynamic-display-md", variable: "--font-dynamic-display-md"},
]

const heading: FontData[] = [
  {tailwind: "font-heading-xxxl", variable: "--font-static-heading-xxxl"},
  {tailwind: "font-heading-xxl", variable: "--font-static-heading-xxl"},
  {tailwind: "font-heading-xl", variable: "--font-static-heading-xl"},
  {tailwind: "font-heading-lg", variable: "--font-static-heading-lg-default"},
  {tailwind: "font-heading-md", variable: "--font-static-heading-md-default"},
  {tailwind: "font-heading-sm", variable: "--font-static-heading-sm-default"},
  {tailwind: "font-heading-xs", variable: "--font-static-heading-xs-default"},
  {
    tailwind: "font-heading-xxs",
    variable: "--font-static-heading-xxs-default",
  },
]

const headingBold: FontData[] = [
  {
    tailwind: "font-heading-lg-bold",
    variable: "--font-static-heading-lg-bold",
  },
  {
    tailwind: "font-heading-md-bold",
    variable: "--font-static-heading-md-bold",
  },
  {
    tailwind: "font-heading-sm-bold",
    variable: "--font-static-heading-sm-bold",
  },
  {
    tailwind: "font-heading-xs-bold",
    variable: "--font-static-heading-xs-bold",
  },
  {
    tailwind: "font-heading-xxs-bold",
    variable: "--font-static-heading-xxs-bold",
  },
]

const dynamicHeading: FontData[] = [
  {
    tailwind: "font-dynamic-heading-xxxl",
    variable: "--font-dynamic-heading-xxxl",
  },
  {
    tailwind: "font-dynamic-heading-xxl",
    variable: "--font-dynamic-heading-xxl",
  },
  {tailwind: "font-dynamic-heading-xl", variable: "--font-dynamic-heading-xl"},
  {
    tailwind: "font-dynamic-heading-lg",
    variable: "--font-dynamic-heading-lg-default",
  },
]

const dynamicHeadingBold: FontData[] = [
  {
    tailwind: "font-dynamic-heading-lg-bold",
    variable: "--font-dynamic-heading-lg-bold",
  },
]

const body: FontData[] = [
  {tailwind: "font-body-xxl", variable: "--font-static-body-xxl-default"},
  {tailwind: "font-body-xl", variable: "--font-static-body-xl-default"},
  {tailwind: "font-body-lg", variable: "--font-static-body-lg-default"},
  {tailwind: "font-body-md", variable: "--font-static-body-md-default"},
  {tailwind: "font-body-sm", variable: "--font-static-body-sm-default"},
  {tailwind: "font-body-xs", variable: "--font-static-body-xs-default"},
]

const bodyBold: FontData[] = [
  {tailwind: "font-body-xxl-bold", variable: "--font-static-body-xxl-bold"},
  {tailwind: "font-body-xl-bold", variable: "--font-static-body-xl-bold"},
  {tailwind: "font-body-lg-bold", variable: "--font-static-body-lg-bold"},
  {tailwind: "font-body-md-bold", variable: "--font-static-body-md-bold"},
  {tailwind: "font-body-sm-bold", variable: "--font-static-body-sm-bold"},
  {tailwind: "font-body-xs-bold", variable: "--font-static-body-xs-bold"},
]

const code: FontData[] = [
  {tailwind: "font-code-xl", variable: "--font-static-code-xl-default"},
  {tailwind: "font-code-lg", variable: "--font-static-code-lg-default"},
  {tailwind: "font-code-md", variable: "--font-static-code-md-default"},
  {tailwind: "font-code-sm", variable: "--font-static-code-sm-default"},
  {tailwind: "font-code-xs", variable: "--font-static-code-xs-default"},
]

const codeBold: FontData[] = [
  {tailwind: "font-code-xl-bold", variable: "--font-static-code-xl-bold"},
  {tailwind: "font-code-lg-bold", variable: "--font-static-code-lg-bold"},
  {tailwind: "font-code-md-bold", variable: "--font-static-code-md-bold"},
  {tailwind: "font-code-sm-bold", variable: "--font-static-code-sm-bold"},
  {tailwind: "font-code-xs-bold", variable: "--font-static-code-xs-bold"},
]

export const themeFonts = {
  body,
  bodyBold,
  code,
  codeBold,
  display,
  dynamicDisplay,
  dynamicHeading,
  dynamicHeadingBold,
  heading,
  headingBold,
}
