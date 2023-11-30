import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';

@Directive({
    selector: '[wfvsScrollIntoView]',
    standalone: true
})
export class ScrollIntoViewDirective implements OnInit, OnDestroy {

  @Input() threshold = 0.25;
  @Output() wfvsScrollIntoView = new EventEmitter<void>();
  elRef = inject(ElementRef);
  observer!: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.wfvsScrollIntoView.emit();
          }
        });
      },
      { threshold: this.threshold }
    );

    this.observer.observe(this.elRef.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
