import type {FunctionComponent} from "react"

import {
  CoreDatePickerClearTrigger,
  type CoreDatePickerClearTriggerProps,
  CoreDatePickerContent,
  type CoreDatePickerContentProps,
  CoreDatePickerContext,
  type CoreDatePickerContextProps,
  CoreDatePickerControl,
  type CoreDatePickerControlProps,
  CoreDatePickerErrorIndicator,
  type CoreDatePickerErrorIndicatorProps,
  CoreDatePickerErrorText,
  type CoreDatePickerErrorTextProps,
  CoreDatePickerHint,
  type CoreDatePickerHintProps,
  CoreDatePickerInput,
  type CoreDatePickerInputProps,
  CoreDatePickerLabel,
  type CoreDatePickerLabelProps,
  CoreDatePickerNextTrigger,
  type CoreDatePickerNextTriggerProps,
  CoreDatePickerPositioner,
  type CoreDatePickerPositionerProps,
  CoreDatePickerPresets,
  type CoreDatePickerPresetsProps,
  CoreDatePickerPresetsTrigger,
  type CoreDatePickerPresetsTriggerProps,
  CoreDatePickerPresetTrigger,
  type CoreDatePickerPresetTriggerProps,
  CoreDatePickerPrevTrigger,
  type CoreDatePickerPrevTriggerProps,
  CoreDatePickerRangeText,
  type CoreDatePickerRangeTextProps,
  CoreDatePickerRoot,
  type CoreDatePickerRootProps,
  CoreDatePickerTable,
  CoreDatePickerTableBody,
  type CoreDatePickerTableBodyProps,
  CoreDatePickerTableCell,
  type CoreDatePickerTableCellProps,
  CoreDatePickerTableCellTrigger,
  type CoreDatePickerTableCellTriggerProps,
  CoreDatePickerTableHead,
  type CoreDatePickerTableHeadProps,
  CoreDatePickerTableHeader,
  type CoreDatePickerTableHeaderProps,
  type CoreDatePickerTableProps,
  CoreDatePickerTableRow,
  type CoreDatePickerTableRowProps,
  CoreDatePickerTrigger,
  type CoreDatePickerTriggerProps,
  CoreDatePickerView,
  CoreDatePickerViewCloseTrigger,
  type CoreDatePickerViewCloseTriggerProps,
  CoreDatePickerViewControl,
  type CoreDatePickerViewControlProps,
  type CoreDatePickerViewProps,
  CoreDatePickerViewTrigger,
  type CoreDatePickerViewTriggerProps,
} from "./core-date-picker.js"

export * from "./date-picker-context.js"

export type {
  CoreDatePickerClearTriggerProps,
  CoreDatePickerContentProps,
  CoreDatePickerContextProps,
  CoreDatePickerControlProps,
  CoreDatePickerErrorIndicatorProps,
  CoreDatePickerErrorTextProps,
  CoreDatePickerHintProps,
  CoreDatePickerInputProps,
  CoreDatePickerLabelProps,
  CoreDatePickerNextTriggerProps,
  CoreDatePickerPositionerProps,
  CoreDatePickerPresetsProps,
  CoreDatePickerPresetsTriggerProps,
  CoreDatePickerPresetTriggerProps,
  CoreDatePickerPrevTriggerProps,
  CoreDatePickerRangeTextProps,
  CoreDatePickerRootProps,
  CoreDatePickerTableBodyProps,
  CoreDatePickerTableCellProps,
  CoreDatePickerTableCellTriggerProps,
  CoreDatePickerTableHeadProps,
  CoreDatePickerTableHeaderProps,
  CoreDatePickerTableProps,
  CoreDatePickerTableRowProps,
  CoreDatePickerTriggerProps,
  CoreDatePickerViewCloseTriggerProps,
  CoreDatePickerViewControlProps,
  CoreDatePickerViewProps,
  CoreDatePickerViewTriggerProps,
}

interface CoreDatePickerComponent {
  ClearTrigger: FunctionComponent<CoreDatePickerClearTriggerProps>
  Content: FunctionComponent<CoreDatePickerContentProps>
  Context: FunctionComponent<CoreDatePickerContextProps>
  Control: FunctionComponent<CoreDatePickerControlProps>
  ErrorIndicator: FunctionComponent<CoreDatePickerErrorIndicatorProps>
  ErrorText: FunctionComponent<CoreDatePickerErrorTextProps>
  Hint: FunctionComponent<CoreDatePickerHintProps>
  Input: FunctionComponent<CoreDatePickerInputProps>
  Label: FunctionComponent<CoreDatePickerLabelProps>
  NextTrigger: FunctionComponent<CoreDatePickerNextTriggerProps>
  Positioner: FunctionComponent<CoreDatePickerPositionerProps>
  Presets: FunctionComponent<CoreDatePickerPresetsProps>
  PresetsTrigger: FunctionComponent<CoreDatePickerPresetsTriggerProps>
  PresetTrigger: FunctionComponent<CoreDatePickerPresetTriggerProps>
  PrevTrigger: FunctionComponent<CoreDatePickerPrevTriggerProps>
  RangeText: FunctionComponent<CoreDatePickerRangeTextProps>
  Root: FunctionComponent<CoreDatePickerRootProps>
  Table: FunctionComponent<CoreDatePickerTableProps>
  TableBody: FunctionComponent<CoreDatePickerTableBodyProps>
  TableCell: FunctionComponent<CoreDatePickerTableCellProps>
  TableCellTrigger: FunctionComponent<CoreDatePickerTableCellTriggerProps>
  TableHead: FunctionComponent<CoreDatePickerTableHeadProps>
  TableHeader: FunctionComponent<CoreDatePickerTableHeaderProps>
  TableRow: FunctionComponent<CoreDatePickerTableRowProps>
  Trigger: FunctionComponent<CoreDatePickerTriggerProps>
  View: FunctionComponent<CoreDatePickerViewProps>
  ViewCloseTrigger: FunctionComponent<CoreDatePickerViewCloseTriggerProps>
  ViewControl: FunctionComponent<CoreDatePickerViewControlProps>
  ViewTrigger: FunctionComponent<CoreDatePickerViewTriggerProps>
}

export const CoreDatePicker: CoreDatePickerComponent = {
  ClearTrigger: CoreDatePickerClearTrigger,
  Content: CoreDatePickerContent,
  Context: CoreDatePickerContext,
  Control: CoreDatePickerControl,
  ErrorIndicator: CoreDatePickerErrorIndicator,
  ErrorText: CoreDatePickerErrorText,
  Hint: CoreDatePickerHint,
  Input: CoreDatePickerInput,
  Label: CoreDatePickerLabel,
  NextTrigger: CoreDatePickerNextTrigger,
  Positioner: CoreDatePickerPositioner,
  Presets: CoreDatePickerPresets,
  PresetsTrigger: CoreDatePickerPresetsTrigger,
  PresetTrigger: CoreDatePickerPresetTrigger,
  PrevTrigger: CoreDatePickerPrevTrigger,
  RangeText: CoreDatePickerRangeText,
  Root: CoreDatePickerRoot,
  Table: CoreDatePickerTable,
  TableBody: CoreDatePickerTableBody,
  TableCell: CoreDatePickerTableCell,
  TableCellTrigger: CoreDatePickerTableCellTrigger,
  TableHead: CoreDatePickerTableHead,
  TableHeader: CoreDatePickerTableHeader,
  TableRow: CoreDatePickerTableRow,
  Trigger: CoreDatePickerTrigger,
  View: CoreDatePickerView,
  ViewCloseTrigger: CoreDatePickerViewCloseTrigger,
  ViewControl: CoreDatePickerViewControl,
  ViewTrigger: CoreDatePickerViewTrigger,
}
