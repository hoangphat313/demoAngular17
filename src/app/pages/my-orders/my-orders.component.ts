import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { User } from '../../core/model/common.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormatCurrencyPipe,
    MatSlideToggleModule,
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

  constructor() {}
  ngOnInit(): void {
    this.authService.userDetails().subscribe((response) => {
      if (response.data) {
        this.user = response.data;
        this.loadAllOrder();
      }
    });
  }
  loadAllOrder(): void {
    if (this.user && this.user._id) {
      this.orderService
        .getAllUserOrders(this.user?._id)
        .subscribe((response) => {
          if (response.success) {
            this.orders = response.data;
            console.log(this.orders);
          }
        });
    }
  }
}
