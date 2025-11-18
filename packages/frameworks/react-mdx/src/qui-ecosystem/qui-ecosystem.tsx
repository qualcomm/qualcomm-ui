// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {QuiLogo} from "./qui-logo"

export const quiEcosystem: Record<
  "angular" | "angularTable" | "quiDocs" | "react" | "reactTable",
  {description: string; href: string; label: string; logo: ReactElement}
> = {
  angular: {
    description: "@qualcomm-ui/angular",
    href: "https://angular-next.qui.qualcomm.com",
    label: "Angular",
    logo: <QuiLogo height={18} width={18} />,
  },
  angularTable: {
    description: "@qualcomm-ui/angular/table",
    href: "https://angular-table-next.qui.qualcomm.com",
    label: "Angular Table",
    logo: <QuiLogo height={18} width={18} />,
  },
  quiDocs: {
    description: "@qualcomm-ui/react-mdx",
    href: "https://docs-next.qui.qualcomm.com",
    label: "QUI Docs",
    logo: <QuiLogo height={18} width={16} />,
  },
  react: {
    description: "@qualcomm-ui/react",
    href: "https://react-next.qui.qualcomm.com",
    label: "React",
    logo: <QuiLogo height={18} width={16} />,
  },
  reactTable: {
    description: "@qualcomm-ui/react/table",
    href: "https://react-table-next.qui.qualcomm.com",
    label: "React Table",
    logo: <QuiLogo height={18} width={16} />,
  },
}
