import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SwitchThemeService {

  public static default = 'dark';

  public get current(): string {
    return localStorage.getItem('theme') ?? SwitchThemeService.default;
  }

  public set current(value: string) {
    localStorage.setItem('theme', value);
    // const e = document.getElementById('switch');
    // e.setAttribute('href', `${value}.css`);
    this.style.href = `${value}.css`;
  }

  private readonly style: HTMLLinkElement;

  constructor() {
    this.style = document.createElement('link');
    this.style.rel = 'stylesheet';
    document.head.appendChild(this.style);

    if (localStorage.getItem('theme') !== undefined) {
      this.style.href = `${this.current}.css`;
    }
  }
}
