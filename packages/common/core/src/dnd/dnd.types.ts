export type DragState =
  | {
      type: "idle"
    }
  | {
      type: "is-dragging"
    }
  | {container: HTMLElement; type: "preview"}
  | {
      closestEdge: any
      sourceIndex?: number
      type: "is-dragging-over"
    }
