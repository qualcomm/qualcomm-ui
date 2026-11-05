// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {QuiLogo} from "./qui-logo.js"

export interface QuiEcosystemEntry {
  description: string
  href: string
  label: string
  logo: ReactElement
}

export const quiEcosystem: Record<
  "angular" | "angularTable" | "quiDocs" | "react" | "reactTable",
  QuiEcosystemEntry
> = {
  angular: {
    description: "@qualcomm-ui/angular",
    href: "https://angular.qui.qualcomm.com",
    label: "Angular",
    logo: <QuiLogo height={18} width={18} />,
  },
  angularTable: {
    description: "@qualcomm-ui/angular/table",
    href: "https://angular-table.qui.qualcomm.com",
    label: "Angular Table",
    logo: <QuiLogo height={18} width={18} />,
  },
  quiDocs: {
    description: "QUI Docs",
    href: "https://docs.qui.qualcomm.com",
    label: "QUI Docs",
    logo: <QuiLogo height={18} width={16} />,
  },
  react: {
    description: "@qualcomm-ui/react",
    href: "https://react.qui.qualcomm.com",
    label: "React",
    logo: <QuiLogo height={18} width={16} />,
  },
  reactTable: {
    description: "@qualcomm-ui/react/table",
    href: "https://react-table.qui.qualcomm.com",
    label: "React Table",
    logo: <QuiLogo height={18} width={16} />,
  },
}
