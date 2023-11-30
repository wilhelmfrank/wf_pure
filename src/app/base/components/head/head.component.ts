import { Component } from '@angular/core';
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

  user_name = 'wilma stein'

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
      this.router.navigateByUrl('/isis/pure', {onSameUrlNavigation: 'reload', state: {query}});
    }
    this.search_form.controls['text'].patchValue('');
  }

}
