import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[wfvsOption]',
    standalone: true
})
export class OptionDirective<T = unknown> {

  constructor(public template: TemplateRef<{ $implicit: T }>) {}

}
