import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AaService } from 'src/app/base/services/aa.service';
import { Router, RouterLink } from '@angular/router';
import { AaComponent } from '../aa/aa.component';
import { SwitchBsThemeComponent } from 'src/app/shared/components/switch-bs-theme/switch-bs-theme.component';
import { TooltipDirective } from 'src/app/shared/directives/tooltip.directive';

@Component({
    selector: 'wfvs-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss'],
    standalone: true,
    imports: [ RouterLink, FormsModule, ReactiveFormsModule, TooltipDirective, SwitchBsThemeComponent, AaComponent]
})
export class HeadComponent {

  headerHeight: number = 0;
  header!: HTMLElement;
  newHeight: any;

  ngOnInit() {
    const nav = document.getElementById('header');
    if (nav) {
      this.header = nav;
    }
    this.headerHeight = this.header.offsetHeight as number;
  }

  ngAfterViewInit() {
    document.addEventListener('scroll', (ev) => {
      this.resizeHeader(ev);
    });
  }

  search_form = this.form_builder.group({
    text: '',
  });

  constructor(
    private form_builder: FormBuilder,
    public aa: AaService,
    private router: Router
    ) { }

  search(): void {
    const search_term = this.search_form.get('text')?.value;
    if (search_term) {
      const query = { query_string: { query: search_term } };
      this.router.navigateByUrl('/', {onSameUrlNavigation: 'reload', state: {query}});
    }
    this.search_form.controls['text'].patchValue('');
  }

  resizeHeader(event: any) {
    this.newHeight = this.headerHeight - window.pageYOffset / 2;

    if (this.newHeight < 50) {
      this.newHeight = 50;
    }

    let fontsize = this.newHeight / this.headerHeight;
    if (fontsize >= 0.5) {
      const span = this.header.getElementsByTagName('span');
      this.header.style.fontSize = fontsize + 'em';
    }
    // if (this.newHeight >= this.headerHeight) {
      this.header.style.height = this.newHeight + 'px';
    // }

  }

  help() {
    alert('help ya self!');
  }

  tools() {
    alert('select from tools ...');
  }

  switch_lang() {
    alert('select lasagne')
  }

}
