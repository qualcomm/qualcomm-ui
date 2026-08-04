// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo} from "react"

import {langs} from "@uiw/codemirror-extensions-langs"
import {githubDark, githubLight} from "@uiw/codemirror-theme-github"
import CodeMirror, {type ReactCodeMirrorProps} from "@uiw/react-codemirror"
import {DownloadIcon} from "lucide-react"

import type {QdsTheme} from "@qualcomm-ui/qds-core/theme"
import {CopyToClipboardIconButton} from "@qualcomm-ui/react-mdx/copy-to-clipboard"
import {IconButton} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

DocsCodeMirror.displayName = "DocsCodeMirror"

export interface DocsCodeMirrorProps extends ReactCodeMirrorProps {
  copyable?: boolean
  downloadable?: boolean
  handleDownload?: () => void
  language: string | undefined
  theme?: QdsTheme
  value: string
}

export function DocsCodeMirror({
  basicSetup: basicSetupProp,
  copyable,
  downloadable,
  handleDownload,
  language = "json",
  theme = "dark",
  value,
  ...props
}: DocsCodeMirrorProps): ReactNode {
  const basicSetup = typeof basicSetupProp === "object" ? basicSetupProp : {}

  const extensions = useMemo(() => {
    switch (language) {
      case "bash":
        return [langs.bash()]
      case "html":
        return [langs.html()]
      case "xml":
        return [langs.xml()]
      default:
        return [langs.json()]
    }
  }, [language])

  return (
    <div className="q-code-mirror">
      <CodeMirror
        basicSetup={{
          ...basicSetup,
          highlightActiveLine: false,
          lineNumbers: false,
          lintKeymap: true,
          syntaxHighlighting: true,
        }}
        editable={false}
        extensions={extensions}
        maxHeight="700px"
        minWidth="400px"
        theme={[theme === "dark" ? githubDark : githubLight]}
        value={value}
        {...props}
      />

      {copyable || downloadable ? (
        <div className="actions-wrapper">
          {!downloadable ? null : (
            <Tooltip
              trigger={
                <IconButton
                  aria-label="Download"
                  density="compact"
                  emphasis="primary"
                  icon={DownloadIcon}
                  onClick={handleDownload}
                  variant="ghost"
                />
              }
            >
              Download
            </Tooltip>
          )}
          {copyable ? (
            <CopyToClipboardIconButton valueOrFn={() => value} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
