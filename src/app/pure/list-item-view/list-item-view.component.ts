import { Component, Input } from '@angular/core';
import { ItemVersionVO } from 'src/app/pure/model/inge';
import { NgIf, NgFor, NgClass, JsonPipe } from '@angular/common';

@Component({
    selector: 'wfvs-list-item-view',
    templateUrl: './list-item-view.component.html',
    styleUrls: ['./list-item-view.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, NgClass, JsonPipe]
})
export class ListItemViewComponent {

  @Input() item: ItemVersionVO | undefined;
  @Input()
  authenticated = false;

  no_name = 'n/a';

  stateColor(state: any) {
    if (state) {
      switch (state.valueOf()) {
        case 'PENDING':
          return 'text-warning';
        case 'SUBMITTED':
          return 'text-priary';
        case 'IN_REVISION':
          return 'text-dark';
        case 'RELEASED':
          return 'text-success';
        case 'WITHDRAWN':
          return 'text-danger';
        default:
          return 'text-muted';
      }
    }
    return '';
  }
}
