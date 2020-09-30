import { Component, OnInit, Input, Output, OnDestroy, Renderer2, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})

export class LightboxComponent implements OnDestroy {
  @Input() image = '';
  @Input() title = '';
  @Input() alt = '';
  @Output() onCloseLightbox = new EventEmitter();

  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'noscroll');
  }

  closeLightbox(event: Event) {
    this.onCloseLightbox.emit(true);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'noscroll');
  }

}
