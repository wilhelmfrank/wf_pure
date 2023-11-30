import { Component, Input } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatIconModule } from '@angular/material/icon';
import { ControlType } from 'src/app/pure/item-edit-next/services/form-builder.service';

@Component({
  selector: 'wfvs-chips',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatChipsModule, MatIconModule],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss'
})
export class ChipsComponent {

  @Input() form!: FormGroup;
  @Input() control_name!: any;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  // announcer = inject(LiveAnnouncer);

  get control() {
    return this.form.get(this.control_name) as FormControl<ControlType<string>>;
  }

  chips: string[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.chips.push(value);
    }

    event.chipInput!.clear();
  }

  remove(chip: string): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);

      // this.announcer.announce(`Removed ${chip}`);
    }
  }

  edit(chip: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    if (!value) {
      this.remove(chip);
      return;
    }

    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips[index] = value;
    }
  }
}
