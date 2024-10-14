import { Component, inject, OnInit } from '@angular/core';
import { ICart, IOrderData, Post, User } from '../../core/model/common.model';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/notifications/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormatCurrencyPipe } from '../../pipes/format-currency.pipe';
import { LottieComponent } from 'ngx-lottie';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormatCurrencyPipe,
    LottieComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  user!: User;
  cartService = inject(CartService);
  router = inject(Router);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  lottieOptions: any;
  lottieLoadingOptions: any;
  addressForm!: FormGroup;
  isLoading: boolean = true;

  constructor(private fb: FormBuilder) {
    this.lottieOptions = {
      path: 'assets/cart_empty.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
    this.lottieLoadingOptions = {
      path: 'assets/loading.json',
      renderer: 'svg',
      autoplay: true,
      loop: true,
    };
  }
  ngOnInit(): void {
    this.authService.userDetails().subscribe({
      next: (response) => {
        this.user = response.data;
        if (this.user && this.user._id) {
          this.loadCartItems();
        }
      },
    });
    this.addressForm = this.fb.group({
      houseNumber: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      paymentMethod: ['Tiền mặt', Validators.required],
    });
  }
  loadCartItems(): void {
    this.isLoading = true;
    if (this.user._id) {
      this.cartService.getCartItems(this.user._id).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.success) {
            this.cartItems = response.cartData;
          }
        },
        (error) => {
          this.isLoading = false;
        }
      );
    }
  }
  updateQuantity(item: ICart, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      this.removeFromCart(item.postId._id);
    } else {
      item.quantity = newQuantity;
      this.cartService
        .updateCartItemQuantity(this.user._id, item.postId._id, item.quantity)
        .subscribe({
          next: () => {
            this.loadCartItems();
          },
          error: () => {
            this.notificationService.showNotification(
              'Failed to update quantity'
            );
          },
        });
    }
  }
  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(this.user._id, itemId).subscribe(
      (response) => {
        if (response.success) {
          this.cartItems = this.cartItems.filter((item) => item._id !== itemId);
          this.notificationService.showNotification('Item removed from cart');
          this.loadCartItems();
        }
      },
      (error) => {
        this.notificationService.showNotification('Failed to remove item');
      }
    );
  }
  deleteItem(itemId: string): void {
    this.cartService.deleteItem(this.user._id, itemId).subscribe(
      (response) => {
        if (response.success) {
          this.cartItems = this.cartItems.filter((item) => item._id !== itemId);
          this.notificationService.showNotification('Item deleted from cart');
          this.loadCartItems();
        }
      },
      (error) => {
        this.notificationService.showNotification('Failed to delete item');
      }
    );
  }
  getSubtotal(item: ICart): number {
    return item.quantity * item.postId.price;
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + this.getSubtotal(item),
      0
    );
  }
  navigateHome(): void {
    if (this.user) {
      this.router.navigate(['']);
    }
  }
  placeOrder(): void {
    if (this.addressForm.invalid) {
      this.notificationService.showNotification(
        'Please fill all required fields'
      );
      return;
    }
    const orderData: IOrderData = {
      userId: this.user._id,
      items: this.cartItems.map((item) => ({
        postId: item.postId._id,
        quantity: item.quantity,
      })),
      amount: this.getTotal(),
      address: {
        houseNumber: this.addressForm.value.houseNumber,
        street: this.addressForm.value.street,
        city: this.addressForm.value.city,
      },
      paymentMethod: this.addressForm.value.paymentMethod,
    };
    this.orderService.placeOrder(orderData).subscribe(
      (response) => {
        if (response.success) {
          this.notificationService.showNotification(
            'Order placed successfully'
          );
          this.cartService.clearCart(this.user._id).subscribe(
            (response) => {
              if (response.success) {
                this.cartItems = [];
                this.router.navigate(['order-successfully']);
              }
            },
            (error) => {
              this.notificationService.showNotification('Failed to clear cart');
            }
          );
        }
      },
      (error) => {
        this.notificationService.showNotification('Failed to place order');
      }
    );
  }
}
