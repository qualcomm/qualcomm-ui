// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
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

import {useId, useIsMounted} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import {RenderStrategyContextService} from "@qualcomm-ui/angular-core/presence"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import type {RenderStrategyApiProps} from "@qualcomm-ui/core/presence"
import {
  type CheckedChangeDetails,
  createTreeApi,
  type ExpandedChangeDetails,
  type FocusChangeDetails,
  type LoadChildrenCompleteDetails,
  type LoadChildrenDetails,
  type LoadChildrenErrorDetails,
  type NodeState,
  type SelectionChangeDetails,
  type TreeApiProps,
  treeMachine,
} from "@qualcomm-ui/core/tree"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {TreeCollection, TreeNode} from "@qualcomm-ui/utils/collection"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {TreeContextService} from "./tree-context.service"

@Directive()
export class CoreTreeRootDirective<T extends TreeNode = TreeNode>
  implements
    SignalifyInput<TreeApiProps<T>>,
    SignalifyInput<RenderStrategyApiProps>,
    OnInit
{
  /**
   * The controlled checked node value
   */
  readonly checkedValue = input<string[] | undefined>()

  /**
   * The tree collection data
   * @inheritDoc
   */
  readonly collection = input<TreeCollection<T>>()

  /**
   * The initial checked node value when rendered.
   * Use when you don't need to control the checked node value.
   */
  readonly defaultCheckedValue = input<string[] | undefined>()

  /**
   * The initial expanded node ids when rendered.
   * Use when you don't need to control the expanded node value.
   */
  readonly defaultExpandedValue = input<string[] | undefined>()

  /**
   * The initial focused node value when rendered.
   * Use when you don't need to control the focused node value.
   */
  readonly defaultFocusedValue = input<string | null | undefined>()

  /**
   * The initial selected node value when rendered.
   * Use when you don't need to control the selected node value.
   */
  readonly defaultSelectedValue = input<string[] | undefined>()

  /**
   * The document's text/writing direction.
   */
  readonly dir = input<Direction | undefined>()

  /**
   * The controlled expanded node ids
   */
  readonly expandedValue = input<string[] | undefined>()

  /**
   * Whether clicking on a branch should open it or not
   * @default true
   */
  readonly expandOnClick = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The value of the focused node
   */
  readonly focusedValue = input<string | null | undefined>()

  /**
   * A root node to correctly resolve the Document in custom environments. i.e.,
   * Iframes, Electron.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * HTML {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.)
   */
  readonly id = input<string>()

  /**
   * Function to load children for a node asynchronously.
   * When provided, branches will wait for this promise to resolve before expanding.
   */
  readonly loadChildren = input<
    ((details: LoadChildrenDetails<T>) => Promise<T[]>) | undefined
  >()

  /**
   * When true, the component will not be rendered in the DOM until it becomes
   * visible or active.
   *
   * @default false
   */
  readonly lazyMount = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The controlled selected node value
   */
  readonly selectedValue = input<string[] | undefined>()

  /**
   * Whether the tree supports multiple selection
   * @option `'single'`: only one node can be selected
   * @option `'multiple'`: multiple nodes can be selected
   *
   * @default 'single'
   */
  readonly selectionMode = input<"single" | "multiple" | undefined>()

  /**
   * Callback function that determines whether a node should be hidden.
   *
   * @inheritDoc
   */
  readonly shouldHideNode =
    input<(state: NodeState<T>) => boolean | undefined>()

  /**
   * Whether the tree supports typeahead search
   * @default true
   */
  readonly typeahead = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * When true, the component will be completely removed from the DOM when it
   * becomes inactive or hidden, rather than just being hidden with CSS.
   *
   * @default false
   */
  readonly unmountOnExit = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * Called when the checked value changes
   */
  readonly checkedValueChanged = output<CheckedChangeDetails<T>>()

  /**
   * Called when the tree is opened or closed
   */
  readonly expandedValueChanged = output<ExpandedChangeDetails<T>>()

  /**
   * Called when the focused node changes
   */
  readonly focusChanged = output<FocusChangeDetails<T>>()

  /**
   * Called when a node finishes loading children
   */
  readonly loadChildrenComplete = output<LoadChildrenCompleteDetails<T>>()

  /**
   * Called when loading children fails for one or more nodes
   */
  readonly loadChildrenError = output<LoadChildrenErrorDetails<T>>()

  /**
   * Called when the selection changes
   */
  readonly selectedValueChanged = output<SelectionChangeDetails<T>>()

  protected readonly document = inject(DOCUMENT)

  protected readonly hostId = computed(() => useId(this, this.id()))

  readonly injector = inject(Injector)

  protected readonly isMounted = useIsMounted()

  protected readonly renderStrategyContextService = inject(
    RenderStrategyContextService,
  )
  protected readonly treeContextService = inject(TreeContextService)

  protected readonly trackBindings = useTrackBindings(() =>
    this.treeContextService.context().getRootBindings({
      id: this.hostId(),
    }),
  )

  ngOnInit() {
    const machine = useMachine(
      treeMachine,
      computed<Explicit<TreeApiProps<T>>>(() => ({
        checkedValue: this.checkedValue(),
        collection: this.collection(),
        defaultCheckedValue: this.defaultCheckedValue(),
        defaultExpandedValue: this.defaultExpandedValue(),
        defaultFocusedValue: this.defaultFocusedValue(),
        defaultSelectedValue: this.defaultSelectedValue(),
        dir: this.dir(),
        expandedValue: this.expandedValue(),
        expandOnClick: this.expandOnClick(),
        focusedValue: this.focusedValue(),
        getRootNode: this.getRootNode() || (() => this.document),
        loadChildren: this.loadChildren(),
        onCheckedValueChange: (details) => {
          if (this.isMounted()) {
            this.checkedValueChanged.emit(details)
          }
        },
        onExpandedValueChange: (details) => {
          if (this.isMounted()) {
            this.expandedValueChanged.emit(details)
          }
        },
        onFocusChange: (details) => {
          if (this.isMounted()) {
            this.focusChanged.emit(details)
          }
        },
        onLoadChildrenComplete: (details) => {
          if (this.isMounted()) {
            this.loadChildrenComplete.emit(details)
          }
        },
        onLoadChildrenError: (details) => {
          if (this.isMounted()) {
            this.loadChildrenError.emit(details)
          }
        },
        onSelectedValueChange: (details) => {
          if (this.isMounted()) {
            this.selectedValueChanged.emit(details)
          }
        },
        selectedValue: this.selectedValue(),
        selectionMode: this.selectionMode(),
        shouldHideNode: this.shouldHideNode(),
        typeahead: this.typeahead(),
      })),
      this.injector,
    )

    this.treeContextService.init(
      computed(() => createTreeApi(machine, normalizeProps)),
    )

    this.renderStrategyContextService.init(
      computed<Explicit<RenderStrategyApiProps>>(() => ({
        lazyMount: this.lazyMount(),
        unmountOnExit: this.unmountOnExit(),
      })),
    )

    this.trackBindings()
  }
}
