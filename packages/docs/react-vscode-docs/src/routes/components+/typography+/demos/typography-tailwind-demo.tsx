import type {ReactElement} from "react"

export function TypographyTailwindDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="font-vscode-heading-1">Tailwind page title</p>
      <p className="font-vscode-body-1 text-vscode-muted">
        Tailwind supporting text
      </p>
      <p className="text-vscode-sm">Tailwind small text</p>
      <code className="font-vscode-code">pnpm vscode-core build</code>
    </div>
  )
}
