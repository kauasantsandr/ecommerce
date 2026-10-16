import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../service/cliente-service';
import { Cliente } from '../model/cliente';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
  providers: [ClienteService],
})
export class Login {
  email = '';
  senha = '';
  erro = '';

  constructor(private service: ClienteService, private router: Router) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const mensagem = localStorage.getItem('loginMensagem');
      if (mensagem) {
        this.erro = mensagem;
        localStorage.removeItem('loginMensagem');
      }

      const usuarioLogado = localStorage.getItem('usuarioLogado');
      if (usuarioLogado) {
        this.router.navigateByUrl('/');
      }
    }
  }

  entrar() {
    if (!this.email || !this.senha) {
      this.erro = 'Informe seu e-mail e senha para continuar.';
      return;
    }

    const cliente = new Cliente();
    cliente.email = this.email.trim().toLowerCase();
    cliente.senha = this.senha;

    this.service.fazerLogin(cliente).subscribe({
      next: (response) => {
        const usuario = response?.cliente ?? null;
        const token = response?.token ?? null;

        if (!usuario || !token) {
          this.erro = 'E-mail ou senha inválidos.';
          return;
        }

        if (typeof localStorage !== 'undefined') {
          const usuarioLogado = {
            usuario: usuario.usuario || usuario.email?.split('@')[0],
            email: usuario.email,
            role: usuario.role || (usuario.email === 'admin@loja.com' ? 'ADMIN' : 'USER'),
            token,
          };

          localStorage.setItem('jwtToken', token);
          localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('usuarioAtualizado'));
          window.location.href = '/';
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: (err) => {
        const mensagemErro = err?.error?.mensagem || 'E-mail ou senha inválidos.';
        this.erro = mensagemErro;
      },
    });
  }
}
