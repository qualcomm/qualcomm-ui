import {createContext, type ReactNode, useContext, useState} from "react"

import {VscodeDemo} from "../../../components/demo/vscode-demo"

import {TypographyExampleDemo} from "./demos/typography-example-demo"

const TypographyPreviewContext = createContext({
  fontSize: 13,
  setFontSize: (_fontSize: number) => {},
})

export function TypographyPreview({
  children,
}: {
  children: ReactNode
}): ReactNode {
  const [fontSize, setFontSize] = useState(13)

  return (
    <TypographyPreviewContext.Provider value={{fontSize, setFontSize}}>
      {children}
    </TypographyPreviewContext.Provider>
  )
}

export function TypographyDemo(): ReactNode {
  const {setFontSize} = useContext(TypographyPreviewContext)

  return (
    <VscodeDemo
      component={TypographyExampleDemo}
      name="TypographyExampleDemo"
      onFontSizeChange={setFontSize}
      showFontSizeControl
    />
  )
}

export function TypographySize({size}: {size: number}): ReactNode {
  const {fontSize} = useContext(TypographyPreviewContext)

  return `${Number(((size / 13) * fontSize).toFixed(2))}px`
}
