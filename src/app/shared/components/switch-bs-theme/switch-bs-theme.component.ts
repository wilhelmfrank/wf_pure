import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'wfvs-switch-bs-theme',
    templateUrl: './switch-bs-theme.component.html',
    styleUrls: ['./switch-bs-theme.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class SwitchBsThemeComponent {

  getStoredTheme = () => localStorage.getItem('theme');
  setStoredTheme = (theme: string) => localStorage.setItem('theme', theme);

  getPreferredTheme = () => {
    const storedTheme = this.getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme = (theme: string) => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  }

  switch_theme() {
    if (document.documentElement.getAttribute('data-bs-theme')?.includes('dark')) {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
  }
}
