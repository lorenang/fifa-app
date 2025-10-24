import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  base = '/api';
  constructor(private http: HttpClient) {}
  login(email:string, password:string): Observable<{token:string,user:any}> {
    return this.http.post<{token:string,user:any}>(`${this.base}/auth/login`, { email, password });
  }
  logout(){ localStorage.removeItem('token'); }
}
