import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { NgFor, NgIf } from '@angular/common';

export const boolClauses = ['must', 'must_not', 'filter', 'should'];
export const queryTypes = ['match', 'term', 'prefix'];

@Component({
    selector: 'wfvs-search-term',
    templateUrl: './search-term.nocolor.html',
    styleUrls: ['./search-term.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf, ClickOutsideDirective]
})
export class SearchTermComponent {

  filteredTerms: string[] = [];
  clauses: string[] = boolClauses;
  types: string[] = queryTypes;

  @Input() searchTermForm!: FormGroup;
  @Input() fields!: string[];
  @Input() colors!: string[];
  @Output() notice = new EventEmitter<string>();

  filter() {
    const selectedField = this.searchTermForm.get('field') as FormGroup;
    if (selectedField.value !== '') {
      this.filteredTerms = this.fields.filter((el) => {
        return el.toLowerCase().indexOf(selectedField.value.toLowerCase()) > -1;
      });
    } else {
      this.filteredTerms = [];
    }
  }

  select(term: string) {
    this.searchTermForm.patchValue({field: term});
    this.filteredTerms = [];
  }

  onBoolClauseSelect(bool_clause: string) {
    this.searchTermForm.patchValue({clause: bool_clause});
  }

  onQueryTypeSelect(query_type: string) {
    this.searchTermForm.patchValue({type: query_type});
  }

  close() {
    this.searchTermForm.patchValue({field: ''});
    this.filteredTerms = [];
  }

  addSearchTerm() {
    this.notice.emit('add');
  }

  removeSearchTerm() {
    this.notice.emit('remove');
  }
}
