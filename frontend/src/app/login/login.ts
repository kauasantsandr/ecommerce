import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

  constructor(private service: ClienteService) {}

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      const mensagem = localStorage.getItem('loginMensagem');
      if (mensagem) {
        this.erro = mensagem;
        localStorage.removeItem('loginMensagem');
      }

      const usuarioLogado = localStorage.getItem('usuarioLogado');
      if (usuarioLogado) {
        if (typeof window !== 'undefined') {
          window.location.href = 'vitrine';
        }
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
          localStorage.setItem('jwtToken', token);
          localStorage.setItem('usuarioLogado', JSON.stringify({
            usuario: usuario.usuario || usuario.email?.split('@')[0],
            email: usuario.email,
            token,
          }));
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('usuarioAtualizado'));
          window.location.href = 'vitrine';
        }
      },
      error: (err) => {
        const mensagemErro = err?.error?.mensagem || 'E-mail ou senha inválidos.';
        this.erro = mensagemErro;
      },
    });
  }
}
