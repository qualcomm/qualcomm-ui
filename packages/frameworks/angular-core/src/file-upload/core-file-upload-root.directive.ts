// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {numberAttributeOrUndefined} from "@qualcomm-ui/angular-core/attributes"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  createFileUploadApi,
  type FileAcceptDetails,
  type FileDetails,
  type FileRejectDetails,
  type FileUploadApiProps,
  fileUploadMachine,
  type FileValidateFn,
  type IntlTranslations,
} from "@qualcomm-ui/core/file-upload"
import type {Booleanish, NumberInput} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {FileAcceptType} from "@qualcomm-ui/utils/files"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {FileUploadContextService} from "./file-upload-context.service"

@Directive()
export class CoreFileUploadRootDirective
  implements Omit<SignalifyInput<FileUploadApiProps>, "ids">, OnInit
{
  /**
   * The accept file types
   *
   *  @inheritDoc
   */
  readonly accept = input<FileAcceptType>()

  /**
   * The controlled accepted files
   */
  readonly acceptedFiles = input<File[] | undefined>()

  /**
   * Whether to allow drag and drop in the dropzone element
   *
   * @default true
   */
  readonly allowDrop = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The default camera to use when capturing media (for mobile only)
   */
  readonly capture = input<"user" | "environment" | undefined>()

  /**
   * The default accepted files when rendered.
   * Use when you don't need to control the accepted files of the input.
   */
  readonly defaultAcceptedFiles = input<File[] | undefined>()

  /**
   * The document's text/writing direction.
   */
  readonly dir = input<Direction | undefined>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<() => ShadowRoot | Document | Node>()

  /**
   * Whether to accept directories, only works in webkit browsers
   */
  readonly directory = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the file input is disabled
   */
  readonly disabled = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Whether the file input is invalid
   */
  readonly invalid = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The locale for formatting file sizes
   */
  readonly locale = input<string | undefined>()

  /**
   * The maximum number of files
   * @default 1
   */
  readonly maxFiles = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The maximum file size in bytes
   *
   * @default Infinity
   */
  readonly maxFileSize = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The minimum file size in bytes
   *
   * @default 0
   */
  readonly minFileSize = input<number | undefined, NumberInput>(undefined, {
    transform: numberAttributeOrUndefined,
  })

  /**
   * The name of the underlying file input
   */
  readonly name = input<string | undefined>()

  /**
   * Whether to prevent the drop event on the document
   * @default true
   */
  readonly preventDocumentDrop = input<boolean | undefined, Booleanish>(
    undefined,
    {
      transform: booleanAttribute,
    },
  )

  /**
   * Whether the file input is required
   */
  readonly required = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Function to transform the accepted files to apply transformations
   */
  readonly transformFiles = input<
    ((files: File[]) => Promise<File[]>) | undefined
  >()

  /**
   * The localized messages to use.
   */
  readonly translations = input<IntlTranslations | undefined>()

  /**
   * Function to validate a file
   *
   * @inheritDoc
   */
  readonly validate = input<FileValidateFn>()

  /**
   * Callback fired when the file is accepted
   */
  readonly fileAccepted = output<FileAcceptDetails>()

  /**
   * Callback fired when the value changes, whether accepted or rejected
   *
   * @inheritDoc
   */
  readonly fileChanged = output<FileDetails>()

  /**
   * Callback fired when the file is rejected
   *
   * @inheritDoc
   */
  readonly fileRejected = output<FileRejectDetails>()

  protected readonly trackBindings = useTrackBindings(() =>
    this.fileUploadContext.context().getRootBindings(),
  )

  private readonly fileUploadContext = inject(FileUploadContextService)

  private readonly injector = inject(Injector)

  ngOnInit() {
    const machine = useMachine(
      fileUploadMachine,
      computed<Explicit<FileUploadApiProps>>(() => ({
        accept: this.accept(),
        acceptedFiles: this.acceptedFiles(),
        allowDrop: this.allowDrop(),
        capture: this.capture(),
        defaultAcceptedFiles: this.defaultAcceptedFiles(),
        dir: this.dir(),
        directory: this.directory(),
        disabled: this.disabled(),
        getRootNode: this.getRootNode(),
        ids: undefined,
        invalid: this.invalid(),
        locale: this.locale(),
        maxFiles: this.maxFiles(),
        maxFileSize: this.maxFileSize(),
        minFileSize: this.minFileSize(),
        name: this.name(),
        onFileAccept: (details) => {
          this.fileAccepted.emit(details)
        },
        onFileChange: (details) => {
          this.fileChanged.emit(details)
        },
        onFileReject: (details) => {
          this.fileRejected.emit(details)
        },
        preventDocumentDrop: this.preventDocumentDrop(),
        required: this.required(),
        transformFiles: this.transformFiles(),
        translations: this.translations(),
        validate: this.validate(),
      })),
      this.injector,
    )

    this.fileUploadContext.init(
      computed(() => createFileUploadApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
