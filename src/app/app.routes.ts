import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { PostManagementComponent } from './pages/post-management/post-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FeedbackManagementComponent } from './pages/feedback-management/feedback-management.component';
import { UserFavouriteComponent } from './pages/user-favourite/user-favourite.component';
import { CartComponent } from './pages/cart/cart.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { OrderManagementComponent } from './pages/order-management/order-management.component';
import { OrderSuccessfullyComponent } from './pages/order-successfully/order-successfully.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        component: DashboardComponent,
      },
      { path: 'login', canActivate: [guestGuard], component: LoginComponent },
      {
        path: 'register',
        canActivate: [guestGuard],
        component: RegisterComponent,
      },
      {
        path: 'post_detail/:id',
        canActivate: [authGuard],
        component: PostDetailComponent,
      },
      {
        path: 'post_management',
        canActivate: [authGuard],
        component: PostManagementComponent,
      },
      {
        path: 'user_management',
        canActivate: [authGuard],
        component: UserManagementComponent,
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        component: ProfileComponent,
      },
      {
        path: 'feedback_management',
        canActivate: [authGuard],
        component: FeedbackManagementComponent,
      },
      {
        path: 'user_favourite',
        canActivate: [authGuard],
        component: UserFavouriteComponent,
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        component: CartComponent,
      },
      {
        path: 'my-orders',
        canActivate: [authGuard],
        component: MyOrdersComponent,
      },
      {
        path: 'order-management',
        canActivate: [authGuard],
        component: OrderManagementComponent,
      },
      {
        path: 'order-successfully',
        canActivate: [authGuard],
        component: OrderSuccessfullyComponent,
      },
    ],
  },
];
