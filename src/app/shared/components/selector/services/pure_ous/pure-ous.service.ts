import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ElseService } from 'src/app/shared/services/else.service';
import { ou_suggest } from 'src/app/pure/model/pure_queries';
import { SelectedValue } from '../selector-datasource.service';

export interface OU extends SelectedValue {
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class PureOusService {

  constructor(
    private elastic: ElseService,
  ) { }

  getOUs(val: string) {
    return this.elastic.post('/find', ou_suggest(val), undefined).pipe(
      map(response => {
        const hits = response.hits.hits;
        const fields = hits.map((hit: any) => hit.fields);
        const ous: OU[] = fields.map((f: any) => {
          const ou: OU = { selected: '', id: '' };
          ou.id = f.objectId[0];
          //let text: string;
          if (f?.mother && f.mother[0]['parentAffiliation.name']) {
            ou.selected = f?.ou_chain[0].concat(' - ').concat(f.mother[0]['parentAffiliation.name'][0])
          } else {
            ou.selected = f?.ou_chain[0];
          }
          return ou;
        });
        return ous;
      }))
  }
}
