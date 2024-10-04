import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '../../core/constant/constant';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent implements OnInit {
  ngOnInit(): void {
    this.checkLoginStatus();
  }
  showBanner: boolean = false;

  checkLoginStatus(): void {
    const isLoggedIn = this.isLoggedIn();
    const bannerShown = sessionStorage.getItem('bannerShown');
    
    if (isLoggedIn && !bannerShown) {
      this.showBanner = true;
      sessionStorage.setItem('bannerShown', 'true');
      setTimeout(() => {
        this.showBanner = false;
      }, 15000);
    }
  }
  closeBanner(): void {
    this.showBanner = false;
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem(LocalStorage.token);
    if (!token) {
      return false;
    }
    return true;
  }
}
