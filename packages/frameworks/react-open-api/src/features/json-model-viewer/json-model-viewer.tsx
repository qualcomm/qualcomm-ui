import {
  type FC,
  type ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"

import {DataKeyPair} from "./components"
import {
  createJsonViewerStore,
  createTypeRegistryStore,
  JsonViewerStoreContext,
  predefinedTypes,
  TypeRegistryStoreContext,
  useJsonViewerStore,
  useTypeRegistryStore,
} from "./stores"
import {darkColorspace, lightColorspace} from "./theme/base16"
import type {JsonViewerProps} from "./type"

const JsonViewerInternal: FC<JsonViewerProps> = (props) => {
  const {setState} = useContext(JsonViewerStoreContext)
  useEffect(() => {
    setState((state: any) => ({
      prevValue: state.value,
      value: props.value,
    }))
  }, [props.value, setState])

  useEffect(() => {
    if (props.theme === "light") {
      setState({
        colorspace: lightColorspace,
      })
    } else if (props.theme === "dark") {
      setState({
        colorspace: darkColorspace,
      })
    } else if (typeof props.theme === "object") {
      setState({
        colorspace: props.theme,
      })
    }
  }, [setState, props.theme])

  const themeCls = useMemo(() => {
    if (typeof props.theme === "object") {
      return "json-viewer-theme-custom"
    }
    return props.theme === "dark"
      ? "json-viewer-theme-dark"
      : "json-viewer-theme-light"
  }, [props.theme])

  const onceRef = useRef(true)

  const registerTypes = useTypeRegistryStore((store) => store.registerTypes)
  if (onceRef.current) {
    const allTypes = props.valueTypes
      ? [...predefinedTypes, ...props.valueTypes]
      : [...predefinedTypes]
    registerTypes(allTypes)
    onceRef.current = false
  }

  useEffect(() => {
    const allTypes = props.valueTypes
      ? [...predefinedTypes, ...props.valueTypes]
      : [...predefinedTypes]
    registerTypes(allTypes)
  }, [props.valueTypes, registerTypes])

  const value = useJsonViewerStore((store) => store.value)
  const prevValue = useJsonViewerStore((store) => store.prevValue)
  const emptyPath = useMemo(() => [], [])
  const setHover = useJsonViewerStore((store) => store.setHover)
  const onMouseLeave = useCallback(() => setHover(null), [setHover])

  return (
    <div
      className={clsx("json-model-viewer", themeCls, props.className)}
      onMouseLeave={onMouseLeave}
      style={{...props.style, contentVisibility: "auto"}}
    >
      <div className="model-gutter"></div>
      <DataKeyPair path={emptyPath} prevValue={prevValue} value={value} />
    </div>
  )
}

export function JsonModelViewer<Value>(
  props: JsonViewerProps<Value>,
): ReactElement {
  if (process.env.NODE_ENV !== "production") {
    if ("displayObjectSize" in props) {
      console.error(
        "`displayObjectSize` is deprecated. Use `displaySize` instead.\nSee https://viewer.textea.io/migration/migration-v3#raname-displayobjectsize-to-displaysize for more information.",
      )
    }
  }
  const isAutoDarkTheme = true
  const themeType = useMemo(
    () =>
      props.theme === "auto"
        ? isAutoDarkTheme
          ? "dark"
          : "light"
        : (props.theme ?? "light"),
    [isAutoDarkTheme, props.theme],
  )

  const mixedProps = {...props, theme: themeType}

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const jsonViewerStore = useMemo(() => createJsonViewerStore(props), [])
  const typeRegistryStore = useMemo(() => createTypeRegistryStore(), [])

  return (
    <TypeRegistryStoreContext.Provider value={typeRegistryStore}>
      <JsonViewerStoreContext.Provider value={jsonViewerStore}>
        <JsonViewerInternal {...mixedProps} />
      </JsonViewerStoreContext.Provider>
    </TypeRegistryStoreContext.Provider>
  )
}
