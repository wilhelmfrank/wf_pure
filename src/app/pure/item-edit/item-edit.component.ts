import { JsonPipe, NgClass, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AlternativeTitleType, AlternativeTitleVO, CreatorVO, IdentifierVO, ItemVersionVO, MdsPublicationGenre, OrganizationVO, PersonVO, Workflow } from 'src/app/pure/model/inge';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: object | null) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

@Component({
  selector: 'wfvs-item-edit',
  standalone: true,
  imports: [NgFor, JsonPipe, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})
export class ItemEditComponent implements OnInit {

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  form!: FormGroup;

  alt_title_types = Object.keys(AlternativeTitleType);
  alt_title_langs = ['eng', 'deu', 'fra', 'esp'];
  genres = Object.keys(MdsPublicationGenre);
  workflows = Object.keys(Workflow);

  ngOnInit(): void {
    this.route.data.pipe(
      switchMap(data => {
        // console.log('data from route', data['item'])
        return of(this.item_FG(data['item']));
      })
    ).subscribe(f => {
      this.form = f;
      // console.log('cyclic', JSON.stringify(this.form.value, getCircularReplacer()))
    })
  }

  get alt_titles() {
    return this.form.get('alt_titles') as FormArray;
  }

  get creators() {
    return this.form.get('creators') as FormArray;
  }

  getPersonOus(index: number) {
    return this.creators.at(index).get('person.organizations') as FormArray;
  }

  addAltTitle() {
    this.alt_titles.push(this.alt_title_FG(null));
  }

  removeAltTitle(index: number) {
    this.alt_titles.removeAt(index);
  }

  addCreator(index: number) {
    this.creators.insert(index + 1, this.creator_FG(null));
  }

  removeCreator(index: number) {
    this.creators.removeAt(index);
  }

  addPersonOU(ci: number) {
    this.getPersonOus(ci).push(this.organization_FG(null));
  }

  removePersonOU(ci: number, i: number) {
    this.getPersonOus(ci).removeAt(i);
  }

  alt_title_FG(at: AlternativeTitleVO | null) {
    const  atf = this.fb.group({
      type: [at ? at.type: ''],
      language: [at ? at.language: ''],
      value: [at ? at.value: '']
    });
    return atf;
  }

  creator_FG(creator: CreatorVO | null) {
    const creator_form = this.fb.group({
      organization: creator?.organization ? this.organization_FG(creator.organization) : this.organization_FG(null),
      person: creator?.person ? this.person_FG(creator.person): this.person_FG(null),
      role: [creator?.role ? creator.role : ''],
      type: [creator?.type ? creator.type : '']
    });
    return creator_form;
  }

  organization_FG(ou: OrganizationVO | null) {
    const ou_form = this.fb.group({
      name: [ou ? ou.name : ''],
      identifier: [ou?.identifier ? ou.identifier : ''],
      identifierPath: [ou?.identifierPath ? ou.identifierPath : ''],
      address: [ou?.address ? ou.address : '']
    });
    return ou_form;
  }

  person_FG(person: PersonVO | null) {
    const person_form = this.fb.group({
      givenName: [person?.givenName ? person.givenName : ''],
      familyName: [person?.familyName ? person.familyName : ''],
      // completeName: [person?.completeName ? person.completeName : ''],
      titles: [person?.titles ? person.titles : []],
      alternativeNames: [person?.alternativeNames ? person.alternativeNames : []],
      pseudonyms: [person?.pseudonyms ? person.pseudonyms : []],
      orcid: [person?.orcid ? person.orcid : ''],
      identifier: person?.identifier ? this.identifier_FG(person.identifier) : this.identifier_FG(null),
      organizations: this.fb.array(person?.organizations ? person.organizations.map(ou => this.organization_FG(ou)) : [this.organization_FG(null)])
    });
    return person_form;
  }

  identifier_FG(identifier: IdentifierVO | null) {
    const identifier_form = this.fb.group({
      id: [identifier?.id ? identifier.id : ''],
      type: [identifier?.type ? identifier.type : '']
    });
    return identifier_form;
  }

  item_FG(item: ItemVersionVO | null) {
    const item_form = this.fb.group({
      title: [item ? item.metadata.title : ''],
      alt_titles: this.fb.array(item?.metadata.alternativeTitles ? item.metadata.alternativeTitles.map(at => this.alt_title_FG(at)) : [this.alt_title_FG(null)]),
      creators: this.fb.array(item?.metadata.creators ? item.metadata.creators.map(creature => this.creator_FG(creature)) : [this.creator_FG(null)]),
      genre: [item?.metadata.genre ? item.metadata.genre : ''],
      workflow: [this.workflows[0]]
    });
    return item_form;
  }


}
