// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {NgModule} from "@angular/core"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {IconDirective} from "@qualcomm-ui/angular/icon"

import {QBindDirective} from "@qualcomm-ui/angular-core/machine"
import {FileUploadClearTriggerDirective} from "./file-upload-clear-trigger.directive"
import {FileUploadContextDirective} from "./file-upload-context.directive"
import {FileUploadDropzoneTextLineDirective} from "./file-upload-dropzone-text-line.directive"
import {FileUploadDropzoneTextDirective} from "./file-upload-dropzone-text.directive"
import {FileUploadDropzoneDirective} from "./file-upload-dropzone.directive"
import {FileUploadDropzoneHintDirective} from "./file-upload-dropzone-hint.directive"
import {FileUploadDropzoneTextGroupDirective} from "./file-upload-dropzone-text-group.directive"
import {FileUploadErrorTextDirective} from "./file-upload-error-text.directive"
import {FileUploadHiddenInputDirective} from "./file-upload-hidden-input.directive"
import {FileUploadItemContentDirective} from "./file-upload-item-content.directive"
import {FileUploadItemDeleteTriggerDirective} from "./file-upload-item-delete-trigger.directive"
import {FileUploadItemGroupDirective} from "./file-upload-item-group.directive"
import {FileUploadItemNameDirective} from "./file-upload-item-name.directive"
import {FileUploadItemPreviewImageDirective} from "./file-upload-item-preview-image.directive"
import {FileUploadItemPreviewDirective} from "./file-upload-item-preview.directive"
import {FileUploadItemSizeTextDirective} from "./file-upload-item-size-text.directive"
import {FileUploadItemDirective} from "./file-upload-item.directive"
import {FileUploadLabelDirective} from "./file-upload-label.directive"
import {FileUploadRootDirective} from "./file-upload-root.directive"
import {FileUploadTriggerDirective} from "./file-upload-trigger.directive"
import {FileUploadComponent} from "./file-upload.component"

@NgModule({
  declarations: [
    FileUploadComponent,
    FileUploadRootDirective,
    FileUploadContextDirective,
    FileUploadLabelDirective,
    FileUploadTriggerDirective,
    FileUploadDropzoneDirective,
    FileUploadDropzoneTextGroupDirective,
    FileUploadDropzoneTextLineDirective,
    FileUploadDropzoneTextDirective,
    FileUploadDropzoneHintDirective,
    FileUploadErrorTextDirective,
    FileUploadClearTriggerDirective,
    FileUploadHiddenInputDirective,
    FileUploadItemDirective,
    FileUploadItemContentDirective,
    FileUploadItemGroupDirective,
    FileUploadItemNameDirective,
    FileUploadItemPreviewDirective,
    FileUploadItemPreviewImageDirective,
    FileUploadItemSizeTextDirective,
    FileUploadItemDeleteTriggerDirective,
  ],
  exports: [
    FileUploadComponent,
    FileUploadRootDirective,
    FileUploadContextDirective,
    FileUploadLabelDirective,
    FileUploadTriggerDirective,
    FileUploadDropzoneDirective,
    FileUploadDropzoneTextGroupDirective,
    FileUploadDropzoneTextLineDirective,
    FileUploadDropzoneTextDirective,
    FileUploadDropzoneHintDirective,
    FileUploadErrorTextDirective,
    FileUploadClearTriggerDirective,
    FileUploadHiddenInputDirective,
    FileUploadItemDirective,
    FileUploadItemContentDirective,
    FileUploadItemGroupDirective,
    FileUploadItemNameDirective,
    FileUploadItemPreviewDirective,
    FileUploadItemPreviewImageDirective,
    FileUploadItemSizeTextDirective,
    FileUploadItemDeleteTriggerDirective,
  ],
  imports: [ButtonModule, IconDirective, IconDirective, QBindDirective],
})
export class FileUploadModule {}
