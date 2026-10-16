import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Pombo Games');
  showUserMenu = false;
  cartCount = 0;
  usuarioLogado: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.atualizarSessao();
    this.atualizarCarrinho();

    if (typeof window !== 'undefined') {
      window.addEventListener('cestaAtualizada', () => this.atualizarCarrinho());
      window.addEventListener('usuarioAtualizado', () => {
        this.atualizarSessao();
        this.atualizarCarrinho();
      });
    }
  }

  private getCarrinhoStorageKey(): string {
    if (typeof localStorage === 'undefined') {
      return '';
    }

    try {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogado') ?? 'null');
      if (!usuario) {
        return '';
      }

      const identificador = (usuario.email || usuario.usuario || 'guest').trim().toLowerCase();
      return identificador ? `cesta_${identificador}` : '';
    } catch {
      return '';
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  fecharMenuUsuario() {
    this.showUserMenu = false;
  }

  atualizarSessao() {
    if (typeof localStorage === 'undefined') {
      this.usuarioLogado = null;
      return;
    }

    try {
      const dados = localStorage.getItem('usuarioLogado');
      this.usuarioLogado = dados ? JSON.parse(dados) : null;
    } catch {
      this.usuarioLogado = null;
    }
  }

  nomeUsuario(): string {
    if (!this.usuarioLogado) {
      return '';
    }

    return this.usuarioLogado.usuario || this.usuarioLogado.email?.split('@')[0] || 'Usuário';
  }

  isAdmin(): boolean {
    return !!this.usuarioLogado && (this.usuarioLogado.role === 'ADMIN' || this.usuarioLogado.email === 'admin@loja.com');
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
      window.location.href = '/';
    } else {
      this.router.navigateByUrl('/');
    }
  }

  atualizarCarrinho() {
    if (typeof localStorage === 'undefined') {
      this.cartCount = 0;
      return;
    }

    const storageKey = this.getCarrinhoStorageKey();
    if (!storageKey) {
      this.cartCount = 0;
      return;
    }

    try {
      const items = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      this.cartCount = items.reduce((total: number, item: any) => total + (item.quantidade || 0), 0);
    } catch {
      this.cartCount = 0;
    }
  }
}
