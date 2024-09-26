import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';

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
        path: 'profile',
        canActivate: [authGuard],
        component: ProfileComponent,
      },
    ],
  },
];
