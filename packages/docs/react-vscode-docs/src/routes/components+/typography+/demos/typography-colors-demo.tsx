import type {ReactElement} from "react"

export function TypographyColorsDemo(): ReactElement {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="qui-vscode-body-1 qui-vscode-text-normal">
        Normal: Build configuration
      </p>
      <p className="qui-vscode-body-1 qui-vscode-text-muted">
        Muted: Last build ran two minutes ago
      </p>
      <p className="qui-vscode-body-1 qui-vscode-text-success">
        Success: Build completed
      </p>
      <p className="qui-vscode-body-1 qui-vscode-text-warning">
        Warning: Output directory already exists
      </p>
      <p className="qui-vscode-body-1 qui-vscode-text-error">
        Error: Build failed
      </p>
    </div>
  )
}
