import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlternativeTitleType } from 'src/app/pure/model/inge';
import { AddRemoveButtonsComponent } from '../add-remove-buttons/add-remove-buttons.component';

@Component({
  selector: 'wfvs-alt-title-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent],
  templateUrl: './alt-title-form.component.html',
  styleUrls: ['./alt-title-form.component.scss']
})
export class AltTitleFormComponent {

  @Input() alt_title_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();

  alt_title_types = Object.keys(AlternativeTitleType);
  alt_title_langs = ['bay', 'deu', 'eng', 'fra', 'esp'];

  add_remove_alt_title(event: any) {
    this.notice.emit(event);
  }
}
