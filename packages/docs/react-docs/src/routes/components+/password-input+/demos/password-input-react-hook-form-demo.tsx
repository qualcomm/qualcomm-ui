import {arktypeResolver} from "@hookform/resolvers/arktype"
import {type} from "arktype"
import {Controller, useForm} from "react-hook-form"

import {Button} from "@qualcomm-ui/react/button"
import {PasswordInput} from "@qualcomm-ui/react/password-input"

interface PasswordFormData {
  confirmPassword: string
  password: string
}

// Arktype schema
const passwordSchema = type({
  confirmPassword: "string",
  password: "string",
}).narrow(({confirmPassword, password}, ctx) => {
  let passwordError: string | undefined
  if (!password || password.trim().length === 0) {
    passwordError = "Please enter your password"
  } else if (password.length < 8) {
    passwordError = "Must be at least 8 characters long"
  } else if (!/(?=.*[a-z])/.test(password)) {
    passwordError = "Must contain at least one lowercase letter"
  } else if (!/(?=.*[A-Z])/.test(password)) {
    passwordError = "Must contain at least one uppercase letter"
  } else if (!/(?=.*\d)/.test(password)) {
    passwordError = "Must contain at least one number"
  } else if (!/(?=.*[@$!%*?&])/.test(password)) {
    passwordError = "Must contain at least one special character (@$!%*?&)"
  }

  let valid = true
  if (passwordError) {
    valid = false
    ctx.reject({message: passwordError, path: ["password"]})
  }
  if (!confirmPassword) {
    valid = false
    ctx.reject({
      message: "Please confirm your password",
      path: ["confirmPassword"],
    })
  } else if (password !== confirmPassword) {
    valid = false
    ctx.reject({
      // don't display the password in the error message
      actual: "",
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
  }
  return valid
})

export default function PasswordInputReactHookFormDemo() {
  const {
    control,
    formState: {errors, isSubmitting, submitCount, touchedFields},
    handleSubmit,
  } = useForm<PasswordFormData>({
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
    mode: "onChange",
    resolver: arktypeResolver(passwordSchema),
  })

  const onSubmit = (data: PasswordFormData) => {
    console.log("Form submitted:", data)
  }

  const shouldShowError = (fieldName: keyof PasswordFormData) => {
    return (submitCount > 0 || touchedFields[fieldName]) && errors[fieldName]
  }

  return (
    <form
      className="mx-auto flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Controller
            control={control}
            name="password"
            render={({field: {onChange, ...fieldProps}}) => {
              return (
                <PasswordInput
                  errorText={errors.password?.message}
                  hint={
                    shouldShowError("password")
                      ? null
                      : "must be 8+ characters with at least 1 number, lowercase, uppercase, and special character."
                  }
                  invalid={!!shouldShowError("password")}
                  label="Password"
                  onValueChange={onChange}
                  placeholder="Create password"
                  {...fieldProps}
                />
              )
            }}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, ...fieldProps}}) => {
              return (
                <PasswordInput
                  errorText={errors.confirmPassword?.message}
                  invalid={!!errors.confirmPassword}
                  label="Confirm password"
                  onValueChange={onChange}
                  placeholder="Confirm password"
                  {...fieldProps}
                />
              )
            }}
          />
        </div>
      </div>

      <div className="mt-2 flex w-full justify-end">
        <Button
          disabled={isSubmitting}
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
