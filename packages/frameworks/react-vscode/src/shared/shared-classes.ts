import {type ClassValue, clsx} from "@qualcomm-ui/utils/clsx"

export const sharedClasses = {
  disabled(disabled: boolean | undefined): string | undefined {
    return disabled ? "state-disabled" : undefined
  },

  inputHiddenAccessible(
    disabled: boolean | undefined,
    ...classes: ClassValue[]
  ): string | undefined {
    return clsx(
      "vs-input-hidden-accessible",
      {
        disabled,
      },
      classes,
    )
  },
}
