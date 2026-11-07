import type {QdsSegmentedControlVariant} from "@qualcomm-ui/qds-core/segmented-control"
import {
  type QdsSliderEmphasis,
  type QdsSliderVariant,
} from "@qualcomm-ui/qds-core/slider"
import type * as qds from "@qualcomm-ui/qds-core/slider"

export const variants: QdsSegmentedControlVariant[] = ["primary", "neutral"]

export type SliderVariant = QdsSliderVariant | QdsSliderEmphasis

export type NamespacedVariant = qds.QdsSliderVariant

export type {QdsSliderVariant as LegacySliderVariant} from "@qualcomm-ui/qds-core/slider"
export type {QdsSegmentedControlVariant} from "@qualcomm-ui/qds-core/segmented-control"
