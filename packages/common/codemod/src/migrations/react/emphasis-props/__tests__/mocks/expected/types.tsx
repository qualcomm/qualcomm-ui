import type {QdsSegmentedControlEmphasis} from "@qualcomm-ui/qds-core/segmented-control"
import {
  type QdsSliderEmphasis,
  type QdsSliderEmphasis as QdsSliderVariant,
} from "@qualcomm-ui/qds-core/slider"
import type * as qds from "@qualcomm-ui/qds-core/slider"

export const variants: QdsSegmentedControlEmphasis[] = ["primary", "neutral"]

export type SliderVariant = QdsSliderVariant | QdsSliderEmphasis

export type NamespacedVariant = qds.QdsSliderEmphasis

export type {QdsSliderEmphasis as LegacySliderVariant} from "@qualcomm-ui/qds-core/slider"
export type {QdsSegmentedControlEmphasis as QdsSegmentedControlVariant} from "@qualcomm-ui/qds-core/segmented-control"
