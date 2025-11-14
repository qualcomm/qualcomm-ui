import {Component} from "@angular/core"

import {AvatarContentDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-content-demo"
import {AvatarShowcaseDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-showcase-demo"
import {AvatarSizeDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-size-demo"
import {AvatarStateCallbackDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-state-callback-demo"
import {AvatarStatusDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-status-demo"
import {AvatarVariantDemo} from "@qualcomm-ui/angular-docs/components+/avatar+/demos/avatar-variant-demo"

@Component({
  imports: [
    AvatarContentDemo,
    AvatarShowcaseDemo,
    AvatarSizeDemo,
    AvatarStateCallbackDemo,
    AvatarStatusDemo,
    AvatarVariantDemo,
  ],
  selector: "app-avatar",
  styles: `
    .section {
      margin-bottom: 3rem;
    }

    .section-title {
      font: var(--font-static-heading-md-default);
      margin-bottom: 1rem;
      color: var(--color-text-neutral-primary);
    }

    .demo-container {
      padding: 2rem;
      border: 1px solid var(--color-border-neutral-01);
      border-radius: 8px;
      background-color: var(--color-background-neutral-01);
    }
  `,
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Content</h2>
        <div class="demo-container">
          <avatar-content />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Showcase</h2>
        <div class="demo-container">
          <avatar-showcase />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Size</h2>
        <div class="demo-container">
          <avatar-size />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">State Callback</h2>
        <div class="demo-container">
          <avatar-state-callback />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Status</h2>
        <div class="demo-container">
          <avatar-status />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Variant</h2>
        <div class="demo-container">
          <avatar-variant />
        </div>
      </div>
    </div>
  `,
})
export class AvatarPage {}
