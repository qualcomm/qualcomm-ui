import {Component, signal} from "@angular/core"
import {FormsModule, type NgForm} from "@angular/forms"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {RadioModule} from "@qualcomm-ui/angular/radio"

@Component({
  imports: [RadioModule, FormsModule, ButtonModule],
  selector: "checkbox-template-forms",
  template: `
    <form #formRef="ngForm" class="flex w-56 flex-col gap-2">
      <!-- preview -->
      <div name="language" q-radio-group required [(ngModel)]="value">
        <div q-radio-group-label>Language</div>
        <div q-radio-group-items>
          <label label="HTML" q-radio value="html"></label>
          <label label="CSS" q-radio value="css"></label>
          <label label="TypeScript" q-radio value="ts"></label>
        </div>
        <div q-radio-group-error-text>You must select a value</div>
      </div>
      <!-- preview -->

      <div class="mt-1 grid grid-cols-2 grid-rows-1 gap-3">
        <button
          emphasis="primary"
          q-button
          size="sm"
          type="button"
          variant="outline"
          (click)="reset(formRef)"
        >
          Reset
        </button>
        <button
          emphasis="primary"
          q-button
          size="sm"
          type="submit"
          variant="fill"
        >
          Submit
        </button>
      </div>
    </form>
  `,
})
export class RadioTemplateFormsDemo {
  readonly value = signal<string | null>(null)

  reset(form: NgForm) {
    this.value.set(null)
    form.resetForm()
  }
}
