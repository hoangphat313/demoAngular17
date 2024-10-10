import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/model/common.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LottieComponent } from 'ngx-lottie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormatCurrencyPipe,
    MatSlideToggleModule,
    LottieComponent,
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  orders: any[] = [];
  user: User | null = null;
  p: number = 1;
  isLoading: boolean = true;
  lottieLoadingOptions: any;
  lottieOptions: any;
  router = inject(Router);

  constructor() {
    this.lottieLoadingOptions = {
      path: 'assets/loading.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
    this.lottieOptions = {
      path: 'assets/cart_empty.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
  }
  ngOnInit(): void {
    this.authService.userDetails().subscribe((response) => {
      if (response.data) {
        this.user = response.data;
        this.loadAllOrder();
      }
    });
  }
  loadAllOrder(): void {
    this.isLoading = true;
    if (this.user && this.user._id) {
      this.orderService.getAllUserOrders(this.user?._id).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.success) {
            this.orders = response.data;
            console.log(this.orders);
          }
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
        }
      );
    }
  }
  navigateHome(): void {
    if (this.user) {
      this.router.navigate(['']);
    }
  }
}
