import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationService } from './shared/services/navigation.service';
import { HeadComponent } from './base/components/head/head.component';
import { FootComponent } from './base/components/foot/foot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeadComponent, FootComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pure';

  constructor(private navigation: NavigationService) {}
}
