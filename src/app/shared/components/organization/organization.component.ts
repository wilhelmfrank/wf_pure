import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, Observable, catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'wfvs-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor, AsyncPipe]
})
export class OrganizationComponent {

  @Input() ousForm!: FormGroup;
  @Output() notice = new EventEmitter();
  ous: Observable<any[]> | undefined;
  SEARCH_URI = environment.else_rest_url.concat('/find');
  INDEX_NAME = environment.ror_index_name;

  constructor(
    private http: HttpClient
  ) { }

  ouSearch() {
    this.ous = this.find(this.ousForm.controls['name'].value);
  }

  find(term: string): Observable<any[]> {
    const params = {
      index: this.INDEX_NAME,
      // size: 300,
      query: {
        bool: {
          should: {
            term: { 'relationships.label.keyword': 'Max Planck Society' }
          },
          must: {
            multi_match: {
              query: term,
              type: 'bool_prefix',
              fields: ['name.auto', 'labels.label.auto', 'acronyms.auto']
            }
          }
        }
      }
    };
    return this.http.post(this.SEARCH_URI, params).pipe(
      map((resp: any) => resp.hits.hits.map(
        (hit: any) => hit._source
      )),
      catchError(() => {
        return of();
      })
    )
  }

  select(ou: any) {
    this.ousForm.controls['name'].patchValue(ou.name);
    this.ousForm.controls['id'].patchValue(ou.id);

    this.ous = EMPTY;
  }

  addOu() {
    this.notice.emit('add');
  }

  removeOu() {
    this.notice.emit('remove');
  }

}
