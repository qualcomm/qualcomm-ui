import {Component} from "@angular/core"

import {DialogBodyComponent} from "@qualcomm-ui/angular/dialog"

/**
 * The main content of the drawer. Container for the heading, description,
 * indicator, and primary content of the drawer.
 */
@Component({
  selector: "[q-drawer-body]",
  standalone: false,
  template: `
    @if (!hideIndicatorIcon()) {
      <ng-content select="[q-drawer-indicator-icon]">
        <svg q-drawer-indicator-icon [qIcon]="indicatorIcon()"></svg>
      </ng-content>
    }
    <ng-content />
  `,
})
export class DrawerBodyComponent extends DialogBodyComponent {}
