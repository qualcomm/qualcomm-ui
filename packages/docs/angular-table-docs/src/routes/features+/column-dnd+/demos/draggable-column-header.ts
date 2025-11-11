import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  type OnInit,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from "@angular/core"
import {combine} from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import {pointerOutsideOfPreview} from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import {setCustomNativeDragPreview} from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"

import {qdsTableApi, TableModule} from "@qualcomm-ui/angular/table"
import {useOnDestroy} from "@qualcomm-ui/angular-core/common"
import {useTrackBindings} from "@qualcomm-ui/angular-core/machine"
import type {DragState} from "@qualcomm-ui/core/dnd"
import type {Header, TableInstance} from "@qualcomm-ui/core/table"
import {arrayMove} from "@qualcomm-ui/utils/array"

import type {User} from "./data"

const idleState: DragState = {type: "idle"}

@Component({
  host: {
    "[attr.colspan]": "header().colSpan",
    "[attr.data-column-id]": "column().id",
    "[style.width.px]": "header().column.getSize()",
    class: "whitespace-nowrap",
  },
  imports: [TableModule],
  selector: "th[draggable-column-header]",
  standalone: true,
  template: `
    <div class="flex items-center gap-4">
      @if (!header().isPlaceholder) {
        <ng-container *renderHeader="header(); let value">
          {{ value }}
        </ng-container>
      }

      <button #dragHandle q-table-column-drag-handle></button>

      @if (state().type === "is-dragging-over") {
        <div
          q-table-column-drop-indicator
          [closestEdge]="closestEdge()"
          [columnIndex]="columnIndex()"
          [sourceColumnIndex]="sourceIndex()"
        ></div>
      }
    </div>

    <ng-template #dragPreview>
      <div q-table-column-drag-preview>
        <ng-container *renderHeader="header(); let value">
          {{ value }}
        </ng-container>
      </div>
    </ng-template>
  `,
})
export class DraggableColumnHeaderComponent implements OnInit {
  readonly header = input.required<Header<User, unknown>>()
  readonly table = input.required<TableInstance<User>>()

  private elementRef = inject(ElementRef<HTMLTableCellElement>)
  readonly dragHandleRef =
    viewChild.required<ElementRef<HTMLButtonElement>>("dragHandle")

  readonly state = signal<DragState>(idleState)
  readonly isDragging = signal(false)
  protected readonly onDestroy = useOnDestroy()

  readonly closestEdge = computed(() => {
    const state = this.state()
    if (state.type === "is-dragging-over") {
      return state.closestEdge
    }
    return undefined
  })
  readonly sourceIndex = computed(() => {
    const state = this.state()
    if (state.type === "is-dragging-over") {
      return state.sourceIndex
    }
    return undefined
  })

  readonly column = computed(() => this.header().column)
  readonly columnOrder = computed(() => this.table().getState().columnOrder)

  readonly columnIndex = computed(() =>
    this.columnOrder().indexOf(this.column().id),
  )
  readonly isDraggingOver = signal(false)

  readonly dragPreviewTemplate =
    viewChild.required<TemplateRef<unknown>>("dragPreview")
  private vcr = inject(ViewContainerRef)

  protected readonly trackBindings = useTrackBindings(() =>
    qdsTableApi.getHeaderCellBindings({
      columnIndex: this.columnIndex(),
      isDragging: this.isDragging(),
      isDraggingOver: this.isDraggingOver(),
    }),
  )

  constructor() {
    effect((onCleanup) => {
      const cleanup = combine(
        draggable({
          dragHandle: this.dragHandleRef().nativeElement,
          element: this.elementRef.nativeElement,
          getInitialData: () => ({columnId: this.column().id}),
          onDragStart: () => {
            this.isDragging.set(true)
            this.state.set({type: "is-dragging"})
          },
          onDrop: (payload) => {
            const data = payload.location.current.dropTargets[0]?.data ?? {}
            const targetId = data.columnId as string
            this.reorderColumn(
              this.column().id,
              targetId,
              extractClosestEdge(data),
            )
            this.isDragging.set(false)
            this.state.set(idleState)
          },
          onGenerateDragPreview: ({nativeSetDragImage}) => {
            setCustomNativeDragPreview({
              getOffset: pointerOutsideOfPreview({x: "16px", y: "8px"}),
              nativeSetDragImage,
              render: ({container}) => {
                const viewRef = this.vcr.createEmbeddedView(
                  this.dragPreviewTemplate(),
                )
                viewRef.detectChanges()
                viewRef.rootNodes.forEach((node) => container.appendChild(node))
                return () => viewRef.destroy()
              },
            })
          },
        }),
        dropTargetForElements({
          canDrop: ({element: targetElement}) =>
            targetElement.hasAttribute("data-column-id"),
          element: this.elementRef.nativeElement,
          getData: ({input}) => {
            const data = {columnId: this.column().id}
            return attachClosestEdge(data, {
              allowedEdges: ["left", "right"],
              element: this.elementRef.nativeElement,
              input,
            })
          },
          getIsSticky: () => true,
          onDrag: ({self, source}) => {
            const closestEdge = extractClosestEdge(self.data)
            this.state.update((current) => {
              if (
                current.type === "is-dragging-over" &&
                current.closestEdge === closestEdge
              ) {
                return current
              }
              return {
                closestEdge,
                sourceIndex: this.columnOrder().indexOf(
                  source.data?.columnId as string,
                ),
                type: "is-dragging-over",
              }
            })
          },
          onDragEnter: ({self, source}) => {
            const closestEdge = extractClosestEdge(self.data)
            this.state.set({
              closestEdge,
              sourceIndex: this.columnOrder().indexOf(
                source.data?.columnId as string,
              ),
              type: "is-dragging-over",
            })
          },
          onDragLeave: () => this.state.set(idleState),
          onDrop: () => this.state.set(idleState),
        }),
      )

      onCleanup(() => cleanup())
    })
  }

  ngOnInit() {
    this.trackBindings()
  }

  private reorderColumn(
    draggedColumnId: string,
    targetColumnId: string,
    closestEdge: Edge | null,
  ) {
    const sourceIndex = this.columnOrder().indexOf(draggedColumnId)
    let targetIndex = this.columnOrder().indexOf(targetColumnId)

    if (closestEdge === "left" && sourceIndex < targetIndex) {
      targetIndex--
    } else if (closestEdge === "right" && sourceIndex > targetIndex) {
      targetIndex++
    }

    if (sourceIndex !== targetIndex) {
      this.table().setColumnOrder((prevOrder) =>
        arrayMove(prevOrder, sourceIndex, targetIndex),
      )
    }
  }
}
