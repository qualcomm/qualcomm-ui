// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Directive} from "@angular/core"

import {CoreFileUploadHiddenInputDirective} from "@qualcomm-ui/angular-core/file-upload"

@Directive({
  selector: "[q-file-upload-hidden-input]",
  standalone: false,
})
export class FileUploadHiddenInputDirective extends CoreFileUploadHiddenInputDirective {}
