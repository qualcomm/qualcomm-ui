import {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {AngularLogo} from "@qualcomm-ui/react-mdx/angular-logo"
import {ReactLogo} from "@qualcomm-ui/react-mdx/react-logo"

export default function HomePage(): ReactNode {
  return (
    <div className="flex w-full flex-col gap-8 pt-8">
      <h1 className="q-font-heading-xxxl inline-flex flex-col gap-1">
        <span>Modern components</span>
        <span>Optimal DX</span>
      </h1>
      <div className="q-font-body-xl flex flex-col gap-1">
        <span>This site is a placeholder for the upcoming QUI storefront.</span>
        <span>Refer to our documentation to get started.</span>
      </div>
      <div className="mb-2 flex gap-4">
        <Button
          emphasis="primary"
          endIcon={<ReactLogo height={22} />}
          render={
            <a
              href="https://react-next.qui.qualcomm.com/"
              rel="noreferrer"
              target="_blank"
            />
          }
          variant="fill"
        >
          React Docs
        </Button>
        <Button
          emphasis="primary"
          endIcon={<AngularLogo height={24} />}
          render={
            <a
              href="https://angular-next.qui.qualcomm.com"
              rel="noreferrer"
              target="_blank"
            />
          }
          variant="fill"
        >
          Angular Docs
        </Button>
      </div>
    </div>
  )
}
