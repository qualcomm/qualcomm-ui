// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, input, output} from "@angular/core"

import {useFilter} from "@qualcomm-ui/angular-core/filter-set"
import {
  createCheckboxTreeFilterApi,
  type FilterControlLabelProps,
} from "@qualcomm-ui/core/filter-control"
import type {TreeFilterDefinition} from "@qualcomm-ui/core/filters"
import type {ExpandedChangeDetails} from "@qualcomm-ui/core/tree"
import {filterControlClasses} from "@qualcomm-ui/qds-core/filter-control"

import {useQdsFilterControlContext} from "./qds-filter-control-context.service"

/**
 * A tree with a checkbox on every node of the filter's tree collection.
 * Checking a branch checks its leaves. Writes the checked leaf values as a
 * `string[]`. Selected values missing from the tree are kept but not shown.
 * Leaves show their result count when the filter has option counts. Renders
 * nothing while the filter has no tree.
 *
 * @example
 * ```angular-html
 * <div q-filter-panel-filter [filter]="filters.platform">
 *   <q-checkbox-tree-filter [defaultExpandedValue]="['desktop']" />
 * </div>
 * ```
 */
@Component({
  host: {
    "[class]": "filterControlClasses.host",
  },
  selector: "q-checkbox-tree-filter",
  standalone: false,
  template: `
    @if (api(); as api) {
      @if (api.tree; as tree) {
        <div
          q-tree-root
          [aria-label]="labelProps()['aria-label']"
          [aria-labelledby]="labelProps()['aria-labelledby']"
          [checkedValue]="api.checkedValue"
          [collection]="tree"
          [defaultExpandedValue]="defaultExpandedValue()"
          [expandedValue]="expandedValue()"
          [size]="qdsContext().size"
          (checkedValueChanged)="api.setCheckedValue($event.checkedValue)"
          (expandedValueChanged)="expandedValueChanged.emit($event)"
        >
          @for (
            node of tree.getNodeChildren(tree.rootNode);
            let i = $index;
            track getNodeValue(node)
          ) {
            <q-tree-nodes [indexPath]="[i]" [node]="node">
              <ng-template let-branch q-tree-branch-template>
                <div q-tree-branch-node>
                  <div q-tree-branch-trigger></div>
                  <span q-tree-node-checkbox></span>
                  <span q-tree-node-text>
                    {{ tree.stringifyNode(branch.node) }}
                  </span>
                </div>
              </ng-template>
              <ng-template let-leaf q-tree-leaf-template>
                <div q-tree-leaf-node>
                  <span q-tree-node-checkbox></span>
                  <span
                    q-filter-option-label
                    q-tree-node-text
                    [count]="api.getOptionCount(tree.getNodeValue(leaf.node))"
                    [label]="tree.stringifyNode(leaf.node)"
                  ></span>
                </div>
              </ng-template>
            </q-tree-nodes>
          }
        </div>
      }
    }
  `,
})
export class CheckboxTreeFilterComponent {
  /**
   * The initial expanded node ids when rendered.
   * Use when you don't need to control the expanded node value.
   */
  readonly defaultExpandedValue = input<string[] | undefined>()

  /**
   * The controlled expanded node ids
   */
  readonly expandedValue = input<string[] | undefined>()

  /**
   * Called when the tree is opened or closed
   */
  readonly expandedValueChanged = output<ExpandedChangeDetails>()

  protected readonly filterControlClasses = filterControlClasses

  protected readonly filter = useFilter<TreeFilterDefinition>()

  protected readonly qdsContext = useQdsFilterControlContext()

  protected readonly api = computed(() => {
    const filter = this.filter()
    return filter ? createCheckboxTreeFilterApi(filter) : undefined
  })

  protected readonly labelProps = computed<FilterControlLabelProps>(
    () => this.api()?.getLabelProps() ?? {},
  )

  protected getNodeValue(node: unknown): string | undefined {
    return this.api()?.tree?.getNodeValue(node)
  }
}
