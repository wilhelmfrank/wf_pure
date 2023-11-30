import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { AlternativeTitleVO, CreatorVO, MdsPublicationGenre } from 'src/app/pure/model/inge';
import { AltTitleFormComponent } from '../alt-title-form/alt-title-form.component';
import { CreatorFormComponent } from '../creator-form/creator-form.component';
import { AddRemoveButtonsComponent } from '../add-remove-buttons/add-remove-buttons.component';

@Component({
  selector: 'wfvs-metadata-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AltTitleFormComponent, CreatorFormComponent, AddRemoveButtonsComponent],
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.scss']
})
export class MetadataFormComponent {

  @Input() meta_form!: FormGroup;
  @Output() notice = new EventEmitter();

  fbs = inject(FormBuilderService);

  genre_types = Object.keys(MdsPublicationGenre);

  get alternativeTitles() {
    return this.meta_form.get('alternativeTitles') as FormArray<FormGroup<ControlType<AlternativeTitleVO>>>;
  }

  get creators() {
    return this.meta_form.get('creators') as FormArray<FormGroup<ControlType<CreatorVO>>>;
  }

  handleAltTitleNotification(event: any) {
    if (event.action === 'add') {
      this.addAltTitle(event.index);
    } else if (event.action === 'remove') {
      this.removeAltTitle(event.index);
    }
  }

  handleNoAltTitles() {
    this.alternativeTitles.push(this.fbs.alt_title_FG(null));
  }

  addAltTitle(index: number) {
    this.alternativeTitles.insert(index + 1, this.fbs.alt_title_FG(null));
  }

  removeAltTitle(index: number) {
    this.alternativeTitles.removeAt(index);
  }

  handleCreatorNotification(event: any) {
    if (event.action === 'add') {
      this.addCreator(event.index);
    } else if (event.action === 'remove') {
      this.removeCreator(event.index);
    }
  }

  handleNoCreators() {
    this.creators.push(this.fbs.creator_FG(null));
  }

  addCreator(index: number) {
    // console.log('current index', index, 'length', this.creators.length)
    this.creators.insert( index + 1, this.fbs.creator_FG(null));
  }

  removeCreator(index: number) {
    this.creators.removeAt(index);
  }

  genre_change(event: any) {
    console.log('changed genre', event.target.value)
  }
}
