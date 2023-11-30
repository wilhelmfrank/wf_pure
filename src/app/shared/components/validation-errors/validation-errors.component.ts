import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'wfvs-validation-errors',
    templateUrl: './validation-errors.component.html',
    styleUrls: ['./validation-errors.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class ValidationErrorsComponent {

  @Input() control: any;
  @Input() messages: any;

}
