import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { AaService } from 'src/app/base/services/aa.service';
import { LoginComponent } from './login/login.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'wfvs-aa',
    templateUrl: './aa.component.html',
    styleUrls: ['./aa.component.scss'],
    standalone: true,
    imports: [NgIf, RouterLink]
})
export class AaComponent {

  dialog_conf = {
    hasBackdrop: false,
    panelClass: 'wfvs-dialog',
  }

  constructor(
    private dialog: Dialog,
    public aa: AaService,
    private msg: MessageService,
  ) { }

  sign_in() {
    const ref = this.dialog.open(LoginComponent, this.dialog_conf);
    ref.closed.pipe(
      switchMap((form: any) => form ? this.aa.login(form.username, form.password) : EMPTY),
      catchError(err => {
        this.msg.error(err);
        return EMPTY;
      })
    ).subscribe();
  }

  sign_out() {
    this.aa.logout();
  }

}
