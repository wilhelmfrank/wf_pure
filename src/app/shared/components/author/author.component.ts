import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlType, FormUtilsService } from 'src/app/osiris/services/form-utils.service';
import { Organization } from 'src/app/osiris/model/dataset';
import { OrganizationComponent } from '../organization/organization.component';
import { NgFor } from '@angular/common';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

@Component({
    selector: 'wfvs-author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ValidationErrorsComponent,
        NgFor,
        OrganizationComponent,
    ],
})
export class AuthorComponent {

  @Input() authorsForm!: FormGroup;
  @Output() notice = new EventEmitter();

  constructor(
    private utils: FormUtilsService
  ) { }

  get ous() {
    return this.authorsForm.get('ous') as FormArray<FormGroup<ControlType<Organization>>>;
  }

  handleNotification(event: string, index: number) {
    if (event === 'add') {
      this.addOu(index);
    } else if (event === 'remove') {
      this.removeOu(index);
    }
  }

  addOu(i: number) {
    this.ous.insert(i + 1, this.utils.getOrganizatioForm(null));
  }

  removeOu(i: number) {
    this.ous.removeAt(i);
  }

  addAuthor() {
    this.notice.emit('add');
  }

  removeAuthor() {
    this.notice.emit('remove');
  }

}
