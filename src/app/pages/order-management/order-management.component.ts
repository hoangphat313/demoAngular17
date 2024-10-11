import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { IOrder, User } from '../../core/model/common.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { NotificationService } from '../../shared/notifications/notification.service';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormatCurrencyPipe,
    FormsModule,
  ],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss',
})
export class OrderManagementComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  orders: any[] = [];
  user: User | null = null;
  p: number = 1;
  searchControl = new FormControl();
  private searchSubscription = new Subscription();
  selectedOrder: IOrder | null = null;
  constructor() {}
  ngOnInit(): void {
    this.authService.userDetails().subscribe((response) => {
      if (response.data) {
        this.user = response.data;
        this.loadAllOrder();
      }
    });
    this.searchSubscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap((searchTerm) => {
          if (!searchTerm) {
            return this.orderService.getAllOrderForAdmin();
          }
          return this.orderService.searchOrder(searchTerm);
        })
      )
      .subscribe(
        (response) => {
          if (response && response.data.length > 0) {
            this.orders = response.data;
          } else {
            this.orders = [];
            this.notificationService.showNotification('No users found');
          }
        },
        (error) => {
          this.notificationService.showNotification(error.message);
        }
      );
  }
  loadAllOrder(): void {
    this.orderService.getAllOrderForAdmin().subscribe((response) => {
      if (response.success) {
        this.orders = response.data;
      }
    });
  }
  openDeleteOrder(order: IOrder): void {
    this.selectedOrder = order;
    const modalEl = document.getElementById('deleteConfirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  onDelete(): void {
    if (this.selectedOrder) {
      this.orderService.deleteOrder(this.selectedOrder._id).subscribe(
        (response) => {
          if (response.success) {
            this.orders = this.orders.filter(
              (p) => p._id !== this.selectedOrder?._id
            );
            this.notificationService.showNotification(
              'Order deleted successfully'
            );
            const modalEl = document.getElementById('deleteConfirmModal');
            if (modalEl) {
              const modal = bootstrap.Modal.getInstance(modalEl);
              if (modal) {
                modal.hide();
              }
            }
            this.selectedOrder = null;
          }
        },
        (error) => {
          this.notificationService.showNotification(error.message);
        }
      );
    }
  }
  updateOrderStatus(order: IOrder) {
    this.orderService.updateOrderStatus(order._id, order.status!).subscribe(
      (response) => {
        if (response.success) {
          if (this.selectedOrder) {
            this.selectedOrder.status = response.data.status;
          }
          this.loadAllOrder();
          this.notificationService.showNotification(
            'Order status updated successfully'
          );
        } else {
          this.notificationService.showNotification('Failed to update status');
        }
      },
      (error) => {
        this.notificationService.showNotification('Failed to update status');
      }
    );
  }
}
