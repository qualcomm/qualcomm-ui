import {Directive, input, Input, Output, output} from "@angular/core"

/**
 * @public
 */
export class SomeClass {
  /**
   * Hello
   */
  hello: string

  /**
   * Test method
   *
   * @param param parameter comment
   */
  testMethod(param: string) {
    console.debug(param)
  }
}

/**
 * @public
 */
@Directive()
export class TestDirective {
  /**
   * Manually override visibility using this input. This typically isn't required.
   *
   * @default false
   */
  @Input()
  set expanded(value: boolean) {
    this._expanded = value
  }
  get expanded() {
    return this._expanded
  }
  _expanded: boolean

  /**
   * Test property.
   *
   * @default 0
   */
  @Input() test: number = 0

  /**
   * Test output.
   *
   * @default 1
   */
  @Output()
  someOutput: number = 1

  /**
   * Input signal.
   */
  inputSignal = input<string>()

  /**
   * Output signal.
   */
  outputSignal = output<string>()
}
