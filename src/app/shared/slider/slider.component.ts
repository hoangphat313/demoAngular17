import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HammerModule } from '@angular/platform-browser';

export interface Slide {
  imageSrc: string;
  imageAlt: String;
}
@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, HammerModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  @Input() images: Slide[] = [];
  selectedIndex = 0;
  showPrev(i: number) {
    if (this.selectedIndex > 0) {
      this.selectedIndex = i - 1;
    }
  }
  showNext(i: number) {
    if (this.selectedIndex < this.images?.length - 1) {
      this.selectedIndex = i + 1;
    }
  }
}
