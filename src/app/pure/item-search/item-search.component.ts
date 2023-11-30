import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AaService } from 'src/app/base/services/aa.service';
import { public_filter } from 'src/app/pure/model/pure_queries';
import { bool_query, fieldOptions, join_enum } from 'src/app/pure/model/pure_search';
import { ConeService } from 'src/app/pure/services/cone.service';
import { ItemSearchCriterionComponent } from '../item-search-criterion/item-search-criterion.component';
import { NgFor, NgIf, AsyncPipe, JsonPipe } from '@angular/common';
import { ItemSearchBracketsComponent } from '../item-search-brackets/item-search-brackets.component';

@Component({
  selector: 'wfvs-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, ItemSearchCriterionComponent, ItemSearchBracketsComponent, NgIf, AsyncPipe, JsonPipe]
})
export class ItemSearchComponent implements OnInit, OnDestroy {

  private destroyed: Subject<boolean> = new Subject();
  result: any;
  saved: any;
  cone_results: any;
  public cone_async: Observable<any> | undefined;

  dynamicForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private aa: AaService,
    private router: Router,
    private cone_svc: ConeService
  ) { }

  ngOnInit() {
    this.dynamicForm = this.fb.group({
      fields: this.fb.array([])
    });
    this.addFieldToFormArray();
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  createFormGroup() {
    return this.fb.group({
      join: 'AND',
      filter: [],
      sub_filter: [],
    });
  }

  addFieldToFormArray() {
    this.fields.push(this.createFormGroup());
  }

  removeFieldFromFormArray(index: number) {
    this.fields.removeAt(index);
  }

  notification(event: any, index: number) {
    if (event.value === 'add') {
      this.addFieldToFormArray();
    } else if (event.value === 'remove') {
      this.removeFieldFromFormArray(index);
    } else if (event.value === 'brackets') {
      this.fields.push(this.fb.group({brackets: this.fb.array([this.createFormGroup()])}));
    }
  }

  form_to_query() {
    const boolquery: bool_query = {
      bool: {}
    };

    if (!this.aa.token) {
      boolquery.bool['filter'] = public_filter;
    }
    return this.fields.controls.reduce((q: bool_query, control) => {
      const { join, filter, sub_filter, value, hidden_id, from, to } = control.value;
      const clause = join_enum[join];
      if (!q.bool[clause]) {
        q.bool[clause] = [];
      }
      const query = fieldOptions.find(fo => fo.label.localeCompare(filter) === 0);
      if (filter.localeCompare('Person') === 0) {
        if (hidden_id) {
          q.bool[(clause)].push(query?.query(sub_filter, hidden_id));
        } else {
          value ? q.bool[clause].push(query?.alt_query(sub_filter, value)) : null;
        }
      } else if (filter.localeCompare('Organization') === 0) {
        if (hidden_id) {
          q.bool[clause].push(query?.query(hidden_id));
        } else {
          value ? q.bool[clause].push(query?.alt_query(value)) : null;
        }
      } else if (filter.localeCompare('Genre') === 0) {
        sub_filter ? q.bool[clause].push(query?.query(sub_filter)) : null;
      } else if (filter.localeCompare('Date') === 0) {
        let from_val, to_val;
        if (from) {
          from_val = from;
        }
        if (to) {
          to_val = to;
        }
        q.bool[clause].push(query?.query(from_val, to_val));
      } else {
        value ? q.bool[clause].push(query?.query(value)) : null;
      }
      return q;
    }, boolquery)
  }

  show_query() {
    const query = this.form_to_query();
    if (query.bool['should']) {
      query.bool['minimum_should_match'] = 1;
    }
    this.result = query;
  }

  show_form() {
    this.result = this.dynamicForm.value;
  }

  search() {
    const query = this.form_to_query();
    if (query.bool['should']) {
      query.bool['minimum_should_match'] = 1;
    }
    this.router.navigateByUrl('/', { state: { query } });
  }

  reset() {
    this.saved = this.dynamicForm.value;
    this.result = undefined;
    this.cone_results = undefined;
    // this.dynamicForm.reset({fields: []});
    this.ngOnInit();
  }

  undo() {
    this.dynamicForm = this.fb.group({ 'fields': this.fb.array([]) });
    this.saved.fields.forEach((element: any) => {
      this.fields.push(this.fb.group(element));
    });
  }

  list_cone(value: string) {
    const params = new HttpParams();
    params.append('format', 'json');
    params.append('q', value);
    this.cone_results = this.cone_svc.find(`/${value}`);
  }

  get fields() {
    return this.dynamicForm.get('fields') as FormArray;
  }

}
