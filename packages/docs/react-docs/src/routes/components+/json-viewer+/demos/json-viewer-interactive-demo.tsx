import {type ReactElement, useEffect, useState} from "react"

import type {FileDetails} from "@qualcomm-ui/core/file-upload"
import {FileInput} from "@qualcomm-ui/react/file-input"
import {JsonViewer} from "@qualcomm-ui/react/json-viewer"

export function JsonViewerInteractiveDemo(): ReactElement {
  const [selection, setSelection] = useState<{file: File}>()
  const [result, setResult] = useState<{data: unknown} | null>(null)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const file = selection?.file
    if (!file) {
      return
    }

    let active = true

    void file
      .text()
      .then((text) => {
        const data: unknown = JSON.parse(text)
        if (active) {
          setResult({data})
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setError(
            error instanceof SyntaxError
              ? "The selected file contains invalid JSON."
              : "The selected file could not be read.",
          )
        }
      })

    return () => {
      active = false
    }
  }, [selection])

  function onFileChange({acceptedFiles, rejectedFiles}: FileDetails): void {
    setResult(null)
    setError(rejectedFiles.length ? "Select a .json file." : undefined)
    const file = rejectedFiles.length ? undefined : acceptedFiles[0]
    setSelection(file ? {file} : undefined)
  }

  return (
    // preview
    <div className="flex w-full min-w-0 flex-col gap-4">
      <FileInput
        accept=".json"
        className="w-full max-w-sm"
        errorText={error}
        invalid={!!error}
        label="JSON File"
        onFileChange={onFileChange}
        placeholder="Select a JSON file"
      />

      {result ? (
        <div className="max-h-96 overflow-auto">
          <JsonViewer
            data={result.data}
            defaultExpandedDepth={1}
            lazyMount
            unmountOnExit
          />
        </div>
      ) : selection && !error ? (
        <p aria-live="polite" className="text-neutral-secondary font-body-sm">
          Reading JSON file…
        </p>
      ) : null}
    </div>
    // preview
  )
}
