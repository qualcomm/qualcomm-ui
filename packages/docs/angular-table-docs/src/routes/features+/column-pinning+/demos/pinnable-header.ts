import {NgTemplateOutlet} from "@angular/common"
import {Component, computed, input} from "@angular/core"
import {ChevronLeft, ChevronRight, X} from "lucide-angular"

import {TableModule} from "@qualcomm-ui/angular/table"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {Header} from "@qualcomm-ui/core/table"

import type {User} from "./data"

@Component({
  imports: [TableModule, NgTemplateOutlet],
  providers: [provideIcons({ChevronLeft, ChevronRight, X})],
  selector: "th[pinnable-header]",
  template: `
    <ng-template #pinnedIndicator>
      <button
        icon="X"
        q-table-column-header-action
        (click)="header().column.pin(false)"
      ></button>
    </ng-template>

    @if (!header().isPlaceholder && header().column.getCanPin()) {
      <div class="flex items-center justify-center gap-2">
        @if (!isPinnedLeft()) {
          <button
            aria-label="Pin Left"
            icon="ChevronLeft"
            q-table-column-header-action
            (click)="header().column.pin('left')"
          ></button>
        }

        @if (isPinnedLeft()) {
          <ng-template [ngTemplateOutlet]="pinnedIndicator" />
        }

        <ng-container *renderHeader="header(); let value">
          {{ value }}
        </ng-container>

        @if (isPinnedRight()) {
          <ng-template [ngTemplateOutlet]="pinnedIndicator" />
        }

        @if (!isPinnedRight()) {
          <button
            aria-label="Pin Right"
            icon="ChevronRight"
            q-table-column-header-action
            (click)="header().column.pin('right')"
          ></button>
        }
      </div>
    }
  `,
})
export class PinnableHeader {
  readonly header = input.required<Header<User>>()

  readonly isPinnedLeft = computed(() => {
    return this.header().column.getIsPinned() === "left"
  })

  readonly isPinnedRight = computed(() => {
    return this.header().column.getIsPinned() === "right"
  })
}
