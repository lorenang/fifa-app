import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Iniciar sesión</h2>
    <form (ngSubmit)="submit()">
      <input [(ngModel)]="email" name="email" placeholder="Email" required>
      <input [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
      <button type="submit">Entrar</button>
    </form>
    <small>Demo: admin&#64;example.com / admin123</small>
  `
})
export class LoginComponent {
  email='admin@example.com'; password='admin123';
  constructor(private auth:AuthService, private router:Router){}
  submit(){
    this.auth.login(this.email,this.password).subscribe({
      next:(r: {token:string}) => {
        localStorage.setItem('token', r.token);
        this.router.navigate(['/players']);
      },
      error:()=> alert('Credenciales inválidas')
    });
  }
}
