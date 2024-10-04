import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private http: HttpClient) {}

  getIcon(iconName: string): Observable<string> {
    return this.http.get(`assets/${iconName}.svg`, {
      responseType: 'text',
    });
  }
}
