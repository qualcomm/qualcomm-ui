import {useForm} from "@tanstack/react-form"

import {Button} from "@qualcomm-ui/react/button"
import {PasswordInput} from "@qualcomm-ui/react/password-input"

interface PasswordFormData {
  confirmPassword: string
  password: string
}

// Password validation utility
const validatePassword = (password: string): string | undefined => {
  if (!password || password.trim().length === 0) {
    return "Please enter your password"
  }
  if (password.length < 8) {
    return "Must be at least 8 characters long"
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Must contain at least one lowercase letter"
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Must contain at least one uppercase letter"
  }
  if (!/(?=.*\d)/.test(password)) {
    return "Must contain at least one number"
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return "Must contain at least one special character (@$!%*?&)"
  }
  return undefined
}

export function PasswordInputTanstackFormDemo() {
  const form = useForm({
    canSubmitWhenInvalid: true,
    defaultValues: {
      confirmPassword: "",
      password: "",
    } satisfies PasswordFormData,
    onSubmit: ({value}) => {
      console.log("Form submitted:", value)
    },
  })

  return (
    <form
      className="mx-auto flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid grid-cols-1 gap-4">
        <form.Field
          name="password"
          validators={{
            onBlur: ({value}) => validatePassword(value),
            onChange: ({fieldApi, value}) => {
              const error = validatePassword(value)
              if (!error) {
                fieldApi.setErrorMap({onBlur: undefined})
              }
              return error
            },
          }}
        >
          {(field) => {
            // only show the error if the user has attempted to submit the form, or
            // this field has been blurred. This prevents the error from showing
            // immediately as the user types.
            const isInvalid =
              (form.state.submissionAttempts > 0 ||
                field.getMeta().isBlurred) &&
              !!field.state.meta.errors?.at(0)
            return (
              <PasswordInput
                errorText={field.state.meta.errors?.at(0)}
                hint={
                  isInvalid
                    ? null
                    : "must be 8+ characters with at least 1 number, lowercase, uppercase, and special character."
                }
                invalid={isInvalid}
                label="Password"
                name={field.name}
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                placeholder="Create password"
                value={field.state.value}
              />
            )
          }}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onBlur: ({fieldApi, value}) => {
              if (!value || value.trim().length === 0) {
                return "Please confirm your password"
              }

              const passwordValue = fieldApi.form.getFieldValue("password")
              if (value !== passwordValue) {
                return "Passwords do not match"
              }

              return undefined
            },
            onChange: ({fieldApi, value}) => {
              if (!value || value.trim().length === 0) {
                return "Please confirm your password"
              }

              const passwordValue = fieldApi.form.getFieldValue("password")
              if (value !== passwordValue) {
                return "Passwords do not match"
              }

              // clear onBlur error
              fieldApi.setErrorMap({onBlur: undefined})
              return undefined
            },
          }}
        >
          {(field) => (
            <PasswordInput
              errorText={field.state.meta.errors?.at(0)}
              invalid={field.state.meta.errors.length > 0}
              label="Confirm password"
              name={field.name}
              onBlur={field.handleBlur}
              onValueChange={field.handleChange}
              placeholder="Confirm password"
              value={field.state.value}
            />
          )}
        </form.Field>
      </div>

      <div className="mt-2 flex w-full justify-end">
        <Button
          disabled={form.state.isSubmitting}
          emphasis="primary"
          type="submit"
          variant="fill"
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
