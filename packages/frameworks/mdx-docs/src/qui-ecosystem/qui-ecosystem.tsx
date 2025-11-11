import type {ReactElement} from "react"

import {AngularLogo} from "@qualcomm-ui/mdx-docs/angular-logo"
import {ReactLogo} from "@qualcomm-ui/mdx-docs/react-logo"

export const quiEcosystem: Record<
  "angular" | "angularTable" | "quiDocs" | "react" | "reactTable",
  {description: string; href: string; label: string; logo: ReactElement}
> = {
  angular: {
    description: "@qualcomm-ui/angular",
    href: "https://qui.aws.qualcomm.com",
    label: "Angular",
    logo: <AngularLogo height={18} width={18} />,
  },
  angularTable: {
    description: "@qualcomm-ui/angular-table",
    href: "https://angular-table.qui.aws.qualcomm.com",
    label: "Angular Table",
    logo: <AngularLogo height={18} width={18} />,
  },
  quiDocs: {
    description: "@qualcomm-ui/mdx-docs",
    href: "https://docs.qui.qualcomm.com",
    label: "QUI Docs",
    logo: <ReactLogo height={18} width={16} />,
  },
  react: {
    description: "@qualcomm-ui/react",
    href: "https://react.qui.qualcomm.com",
    label: "React",
    logo: <ReactLogo height={18} width={16} />,
  },
  reactTable: {
    description: "@qualcomm-ui/react/table",
    href: "https://react-table.qui.qualcomm.com",
    label: "React Table",
    logo: <ReactLogo height={18} width={16} />,
  },
}
