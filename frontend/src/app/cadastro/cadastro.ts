import { Component } from '@angular/core';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../service/cliente-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
 imports: [FormsModule, CommonModule],
 standalone: true,
  selector: 'app-cadastro',
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
 providers: [ClienteService],
})
export class Cadastro {
 mensagem = '';
 obj: Cliente = new Cliente();

 public constructor(private service: ClienteService, private router: Router) {}

 normalizarUsuario(valor: string): string {
   return valor
     .normalize('NFD')
     .replace(/[\u0300-\u036f]/g, '')
     .replace(/\s+/g, '')
     .replace(/[^a-zA-Z0-9_]/g, '')
     .toLowerCase();
 }

 public gravar() {
   this.mensagem = '';

   const usuario = this.normalizarUsuario(this.obj.usuario ?? '');
   const email = (this.obj.email ?? '').trim().toLowerCase();
   const senha = this.obj.senha ?? '';

   if (!usuario || !email || !senha) {
     this.mensagem = 'Preencha nome de usuário, e-mail e senha.';
     return;
   }

   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
     this.mensagem = 'Informe um e-mail válido.';
     return;
   }

   this.obj.usuario = usuario;
   this.obj.email = email;

   this.service.gravar(this.obj).subscribe({
     next: (response) => {
       const token = response?.token ?? null;
       const cliente = response?.cliente ?? null;

       if (!token || !cliente) {
         this.mensagem = response?.mensagem ?? 'Cadastro realizado com sucesso!';
         return;
       }

       if (typeof localStorage !== 'undefined') {
         localStorage.setItem('jwtToken', token);
         localStorage.setItem('usuarioLogado', JSON.stringify({
           usuario: cliente.usuario || usuario,
           email: cliente.email || email,
           token,
         }));
       }

       if (typeof window !== 'undefined') {
         window.dispatchEvent(new CustomEvent('usuarioAtualizado'));
       }

       this.router.navigateByUrl('/');
     },
     error: (err) => {
       this.mensagem = err?.error?.mensagem || 'Ocorreu um erro ao cadastrar. Tente novamente.';
     },
   });
 }
}
