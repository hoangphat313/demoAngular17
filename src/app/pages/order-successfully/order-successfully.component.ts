import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-order-successfully',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  templateUrl: './order-successfully.component.html',
  styleUrl: './order-successfully.component.scss',
})
export class OrderSuccessfullyComponent {
  lottieOptions: any;
  router = inject(Router);

  constructor() {
    this.lottieOptions = {
      path: 'assets/order_success.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
  }
  toggleNavHome() {
    this.router.navigate(['']);
  }
}
