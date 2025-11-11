import {Component} from "@angular/core"
import {FormControl, ReactiveFormsModule} from "@angular/forms"

@Component({
  imports: [ReactiveFormsModule],
  selector: "enabled-demo",
  standalone: true,
  template: `
    <form class="grid justify-center gap-2">
      <div class="border-neutral-01 border-1">
        <input name="field-1" [disabled]="false" [formControl]="formControl" />
      </div>
    </form>
  `,
})
export class FormEnabledDemo {
  formControl = new FormControl<string>({disabled: true, value: ""})
}
