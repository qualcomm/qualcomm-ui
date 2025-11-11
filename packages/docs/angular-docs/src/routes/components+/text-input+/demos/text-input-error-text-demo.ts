import {Component, type OnInit, signal, viewChild} from "@angular/core"
import {FormsModule} from "@angular/forms"

import {
  type TextInputComponent,
  TextInputModule,
} from "@qualcomm-ui/angular/text-input"

@Component({
  imports: [TextInputModule, FormsModule],
  selector: "text-input-error-text-demo",
  template: `
    <!-- preview -->
    <q-text-input
      #textInput
      class="w-64"
      errorText="You must enter a value"
      label="Label"
      placeholder="Enter a value"
      required
      [invalid]="!value()"
      [(ngModel)]="value"
    />
    <!-- preview -->
  `,
})
export class TextInputErrorTextDemo implements OnInit {
  readonly value = signal<string>("")

  readonly textInput = viewChild.required<TextInputComponent>("textInput")

  ngOnInit() {
    this.textInput().control?.markAsDirty()
  }
}
