import { Component, Input, inject } from '@angular/core';
import { ItemVersionVO } from '../model/inge';
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-list-item-next',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, JsonPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './list-item-next.component.html',
  styleUrl: './list-item-next.component.scss'
})
export class ListItemNextComponent {

  @Input() item: ItemVersionVO | undefined;
  @Input() last_item!: boolean;
  @Input()
  authenticated = false;

  router = inject(Router);

  check_box = new FormControl(false);

  no_name = 'n/a';

  get abstract() {
    
    if (this.item && this.item?.metadata?.abstracts?.length > 0) {
      return this.item?.metadata.abstracts[0].value;
    } else {
      return 'n/a';
    }
  }

  get creators_length() {
    return this.item?.metadata?.creators?.length;
  }

  get first_three_authors() {
    if (this.creators_length && this.creators_length > 0) {
      return this.item?.metadata.creators.slice(0, 3);
    } else {
      return null;
    }
  }

  show() {
    // alert(JSON.stringify(item, undefined, 2));
    this.router.navigate(['edit', this.item?.objectId])
  }
}
