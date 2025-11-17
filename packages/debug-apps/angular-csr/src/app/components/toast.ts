import {Component} from "@angular/core"

import {ToastActionDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-action-demo"
import {ToastDurationDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-duration-demo"
import {ToastEmphasisDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-emphasis-demo"
import {ToastMaxVisibleDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-max-visible-demo"
import {ToastOverlapDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-overlap-demo"
import {ToastPauseDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-pause-demo"
import {ToastPersistentDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-persistent-demo"
import {ToastPlacementDemo} from "@qualcomm-ui/angular-docs/components+/toast+/demos/toast-placement-demo"

@Component({
  imports: [
    ToastActionDemo,
    ToastDurationDemo,
    ToastEmphasisDemo,
    ToastMaxVisibleDemo,
    ToastOverlapDemo,
    ToastPauseDemo,
    ToastPersistentDemo,
    ToastPlacementDemo,
  ],
  selector: "app-toast",
  template: `
    <div
      class="container"
      style="max-width: 1200px; margin: 0 auto; padding: 2rem;"
    >
      <div class="section">
        <h2 class="section-title">Action</h2>
        <div class="demo-container">
          <toast-action-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Duration</h2>
        <div class="demo-container">
          <toast-duration-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Emphasis</h2>
        <div class="demo-container">
          <toast-emphasis-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Max Visible</h2>
        <div class="demo-container">
          <toast-max-visible-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Overlap</h2>
        <div class="demo-container">
          <toast-overlap-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Pause</h2>
        <div class="demo-container">
          <toast-pause-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Persistent</h2>
        <div class="demo-container">
          <toast-persistent-demo />
        </div>
      </div>
      <div class="section">
        <h2 class="section-title">Placement</h2>
        <div class="demo-container">
          <toast-placement-demo />
        </div>
      </div>
    </div>
  `,
})
export class ToastPage {}
