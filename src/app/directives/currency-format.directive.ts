import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormat]',
  standalone: true,
})
export class CurrencyFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('blur', ['$event.target.value']) onBlur(value: string) {
    this.el.nativeElement.value = this.formatCurrency(value);
  }

  @HostListener('focus', ['$event.target.value']) onFocus(value: string) {
    this.el.nativeElement.value = this.removeFormatting(value);
  }
  private formatCurrency(value: string): string {
    const numberValue = value.replace(/\D/g, '');
    return numberValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  private removeFormatting(value: string): string {
    return value.replace(/\./g, '');
  }
}
