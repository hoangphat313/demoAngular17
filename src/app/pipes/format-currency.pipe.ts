import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency',
  standalone: true,
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }
    return value.toLocaleString('vi-VN') + 'đ';
  }
}
