import type {ChangeEvent, InputHTMLAttributes, ReactElement, ReactNode, Ref} from "react"

import {clsx} from "@qualcomm-ui/utils/clsx"
import type {As, PolymorphicComponentPropsWithRef} from "@qualcomm-ui/react-core/system"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import {useControlledState} from "@qualcomm-ui/react-core/state"

import {sharedClasses} from "../shared"

/**
 * @public
 * @interface
 */
export type CheckboxProps<C extends As = "div"> =
  PolymorphicComponentPropsWithRef<
    C,
    {
      as?: C
      checked?: boolean
      defaultChecked?: boolean
      disabled?: boolean
      id?: string
      indeterminate?: boolean
      inputProps?: InputHTMLAttributes<HTMLInputElement>
      inputRef?: Ref<HTMLInputElement>
      invalid?: boolean
      label?: ReactNode
      name?: string
      onChange?: (
        event: ChangeEvent<HTMLInputElement>,
        checked: boolean,
      ) => void
      readOnly?: boolean
      value?: string
    }
  >

export function Checkbox<C extends As = "div">({
  as,
  checked: checkedProp,
  className,
  defaultChecked,
  disabled = false,
  id: idProp,
  indeterminate = false,
  inputProps = {},
  inputRef,
  invalid,
  label,
  name,
  onChange: onChangeProp,
  readOnly = false,
  ref,
  value: valueProp,
  ...props
}: CheckboxProps<C>): ReactElement {
  const id = useControlledId(idProp)

  const [value, setValue] = useControlledState({
    controlled: checkedProp,
    defaultValue: defaultChecked,
    name: "VsCheckbox",
  })

  const checked = value ?? false
  const labelId = `${id}-label`

  const Element = as || "div"
  return (
    <Element
      ref={ref}
      className={clsx(
        "vs-checkbox",
        {disabled},
        sharedClasses.disabled(disabled),
        className,
      )}
      {...props}
    >
      <input
        {...inputProps}
        ref={inputRef}
        aria-checked={checked ? true : indeterminate ? "mixed" : false}
        aria-invalid={invalid}
        aria-labelledby={label ? labelId : undefined}
        checked={checked}
        className={clsx(
          "vs-checkbox--input",
          sharedClasses.disabled(disabled),
          sharedClasses.inputHiddenAccessible(disabled),
        )}
        disabled={disabled}
        id={id}
        name={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (readOnly) {
            return
          }
          onChangeProp?.(event, !checked)
          setValue(!checked)
        }}
        readOnly={readOnly}
        type="checkbox"
        value={
          valueProp ??
          (typeof label === "string" ? (label as string) : undefined)
        }
      />
      <div className={clsx("vs-checkbox--icon", {checked, indeterminate})}>
        {indeterminate && !checked ? (
          <span className="vs-checkbox--indeterminate-icon"></span>
        ) : null}
        {checked ? (
          <svg
            className="check-icon"
            fill="currentColor"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"
              fillRule="evenodd"
            />
          </svg>
        ) : null}
      </div>
      {label ? (
        <label className="vs-checkbox--label" htmlFor={id} id={labelId}>
          {label}
        </label>
      ) : null}
    </Element>
  )
}
