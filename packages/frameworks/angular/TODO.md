### Forms

Document form nuances and pitfalls.

When using template-driven forms with `ngModel`, perform validation manually in your component and pass the result to the [invalid](./#invalid) property.

- Form validation timing is controlled by the [updateOn](https://angular.dev/api/forms/FormControl#updateOn) property on the underlying form control:
  - `change` (default) - validates on every keystroke
  - `blur` - validates when field loses focus
  - `submit` - validates only when form is submitted

But these are limited:

- updateOn accepts only one value: `change`, `blur`, or `submit`
- ALL validators on a control use the same update strategy
- You cannot have different validators respond to different events

Angular's default system is too rigid for complex validation logic, so we extend it.

### All components

- Convert @Component to @Directive when the only template content is a single `<ng-content>`

### Breaking

- Removed unused types: `QHandler`, `QBooleanHandler`, `QStringHandler`, `QNumberHandler`.
- Removed deprecated `trackById`.
