// Modified from https://github.com/swagger-api/swagger-ui
// Apache-2.0
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {PlayIcon} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"

interface ExecuteProps {
  disabled?: boolean
  method: string
  oas3Actions: any
  oas3Selectors: any
  onExecute?: () => void
  operation: any
  path: string
  specActions: any
  specSelectors: any
}

export function Execute(props: ExecuteProps) {
  const handleValidateParameters = (): boolean => {
    const {method, path, specActions, specSelectors} = props
    specActions.validateParams([path, method])
    return specSelectors.validateBeforeExecute([path, method])
  }

  const handleValidateRequestBody = (): boolean => {
    const {method, oas3Actions, oas3Selectors, path, specSelectors} = props
    const validationErrors = {
      missingBodyValue: false,
      missingRequiredKeys: [] as string[],
    }
    oas3Actions.clearRequestBodyValidateError({method, path})
    const oas3RequiredRequestBodyContentType =
      specSelectors.getOAS3RequiredRequestBodyContentType([path, method])
    const oas3RequestBodyValue = oas3Selectors.requestBodyValue(path, method)
    const oas3ValidateBeforeExecuteSuccess =
      oas3Selectors.validateBeforeExecute([path, method])
    const oas3RequestContentType = oas3Selectors.requestContentType(
      path,
      method,
    )

    if (!oas3ValidateBeforeExecuteSuccess) {
      validationErrors.missingBodyValue = true
      oas3Actions.setRequestBodyValidateError({method, path, validationErrors})
      return false
    }
    if (!oas3RequiredRequestBodyContentType) {
      return true
    }
    const missingRequiredKeys: string[] = oas3Selectors.validateShallowRequired(
      {
        oas3RequestBodyValue,
        oas3RequestContentType,
        oas3RequiredRequestBodyContentType,
      },
    )
    if (!missingRequiredKeys || missingRequiredKeys.length < 1) {
      return true
    }
    for (const missingKey of missingRequiredKeys) {
      validationErrors.missingRequiredKeys.push(missingKey)
    }
    oas3Actions.setRequestBodyValidateError({method, path, validationErrors})
    return false
  }

  const handleValidationResultPass = () => {
    const {method, operation, path, specActions} = props
    if (props.onExecute) {
      props.onExecute()
    }
    specActions.execute({method, operation, path})
  }

  const handleValidationResultFail = () => {
    const {method, path, specActions} = props
    specActions.clearValidateParams([path, method])
    setTimeout(() => {
      specActions.validateParams([path, method])
    }, 40)
  }

  const handleValidationResult = (isPass: boolean) => {
    if (isPass) {
      handleValidationResultPass()
    } else {
      handleValidationResultFail()
    }
  }

  const onClick = () => {
    const paramsResult = handleValidateParameters()
    const requestBodyResult = handleValidateRequestBody()
    const isPass = paramsResult && requestBodyResult
    handleValidationResult(isPass)
  }

  const {disabled} = props
  return (
    <Button
      className="execute-button"
      disabled={disabled}
      emphasis="primary"
      endIcon={PlayIcon}
      onClick={onClick}
      variant="fill"
    >
      Execute
    </Button>
  )
}
