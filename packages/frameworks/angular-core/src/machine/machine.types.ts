import type {TrackBindingsConfig} from "./use-track-bindings"

/**
 * @deprecated, migrate to the useTrackBindingsInitOptions
 */
export interface MachineInitOptions extends TrackBindingsConfig {
  disabled?: never
}
