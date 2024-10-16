import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { IOrder, User } from '../../core/model/common.model';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LottieComponent } from 'ngx-lottie';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { NotificationService } from '../../shared/notifications/notification.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormatCurrencyPipe,
    MatSlideToggleModule,
    LottieComponent,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
})
export class MyOrdersComponent implements OnInit {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  notification = inject(NotificationService);
  orders: any[] = [];
  user: User | null = null;
  p: number = 1;
  isLoading: boolean = true;
  lottieLoadingOptions: any;
  lottieOptions: any;
  router = inject(Router);
  updateForm!: FormGroup;
  selectOrderId: string | null = null;
  faPencil = faPencil;
  faBars = faBarsProgress;
  faEyeSlash = faEyeSlash;
  selectedOrder: IOrder | null = null;
  notificationService = inject(NotificationService);

  constructor(private fb: FormBuilder) {
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
    this.updateForm = this.fb.group({
      houseNumber: [''],
      street: [''],
      city: [''],
    });
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
          } else {
            this.notification.showNotification('Error fetching orders');
          }
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
  }
  openDeleteOrder(order: IOrder): void {
    this.selectedOrder = order;
    const modalEl = document.getElementById('deleteConfirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
  onHide(): void {
    if (this.selectedOrder) {
      this.orderService.hideOrder(this.selectedOrder._id).subscribe(
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
  navigateHome(): void {
    if (this.user) {
      this.router.navigate(['']);
    }
  }
  openEditAddress(order: any): void {
    const modalEl = document.getElementById('editUserAddress');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      this.selectOrderId = order._id;
      this.updateForm.patchValue({
        houseNumber: order.address.houseNumber,
        street: order.address.street,
        city: order.address.city,
      });
    }
  }
  updateUserAddress(): void {
    if (this.updateForm.valid && this.selectOrderId) {
      const updatedAddress = {
        ...this.updateForm.value,
      };
      this.orderService
        .updateUserAddress(this.selectOrderId, updatedAddress)
        .subscribe(
          (response) => {
            if (response.success) {
              this.notification.showNotification(
                'Address updated successfully'
              );
              this.closeModal();
              this.loadAllOrder();
            } else {
              this.notification.showNotification('Error updating address');
            }
          },
          (error) => {
            this.notification.showNotification('Error updating address');
          }
        );
    }
  }
  closeModal(): void {
    const modalEl = document.getElementById('editUserAddress');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
  }
}
