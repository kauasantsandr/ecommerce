import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Pombo Games');
  showUserMenu = false;
  cartCount = 0;
  usuarioLogado: any = null;

  ngOnInit() {
    this.atualizarSessao();
    this.atualizarCarrinho();

    if (typeof window !== 'undefined') {
      window.addEventListener('cestaAtualizada', () => this.atualizarCarrinho());
      window.addEventListener('usuarioAtualizado', () => this.atualizarSessao());
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  atualizarSessao() {
    if (typeof localStorage === 'undefined') {
      this.usuarioLogado = null;
      return;
    }

    const dados = localStorage.getItem('usuarioLogado');
    this.usuarioLogado = dados ? JSON.parse(dados) : null;
  }

  nomeUsuario(): string {
    if (!this.usuarioLogado) {
      return '';
    }

    return this.usuarioLogado.usuario || this.usuarioLogado.email?.split('@')[0] || 'Usuário';
  }

  sair() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('jwtToken');
    }

    this.usuarioLogado = null;
    this.showUserMenu = false;

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('usuarioAtualizado'));
    }
  }

  atualizarCarrinho() {
    if (typeof localStorage === 'undefined') {
      this.cartCount = 0;
      return;
    }

    const items = JSON.parse(localStorage.getItem('cesta') ?? '[]');
    this.cartCount = items.reduce((total: number, item: any) => total + (item.quantidade || 0), 0);
  }
}
