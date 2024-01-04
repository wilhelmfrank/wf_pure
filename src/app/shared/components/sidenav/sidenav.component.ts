import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pure-sidenav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './no_sidenav.component.scss'
})
export class SidenavComponent implements AfterViewInit {

  @ViewChild('sidenav', {read: ElementRef}) nav!: ElementRef;
  renderer = inject(Renderer2);

  ngAfterViewInit(): void {
    this.collapse();
  }

  /*
  ex_col() {
    const expanded = this.nav.nativeElement.classList.contains('collapsed');
    this.renderer[expanded ? 'removeClass' : 'addClass'](this.nav.nativeElement, 'collapsed');
  }
  */

  expand() {
    this.renderer.removeClass(this.nav.nativeElement, 'collapsed');
  }

  collapse() {
    this.renderer.addClass(this.nav.nativeElement, 'collapsed');
  }
}
