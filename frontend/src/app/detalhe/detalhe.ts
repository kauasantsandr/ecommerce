import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Produto } from '../model/produto';

@Component({
  imports: [CommonModule],
  selector: 'app-detalhe',
  styleUrl: './detalhe.css',
  templateUrl: './detalhe.html',
})
export class Detalhe {
  obj: Produto = new Produto();
  mensagem: string = '';
  toastMensagem = '';
  toastVisivel = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof localStorage === 'undefined') {
      this.mensagem = 'Produto inválido, verifique!';
      return;
    }

    const json = localStorage.getItem('produto');
    if (json == null) {
      this.mensagem = 'Produto inválido, verifique!';
    } else {
      this.mensagem = '';
      this.obj = JSON.parse(json);
    }
  }

  getImagemUrl(imagem?: string): string {
    if (!imagem) {
      return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80';
    }

    if (imagem.startsWith('http://') || imagem.startsWith('https://')) {
      return imagem;
    }

    if (imagem.startsWith('/')) {
      return `http://localhost:8081${imagem}`;
    }

    return `http://localhost:8081/${imagem}`;
  }

  formatarMoeda(valor: number | string | undefined): string {
    const numero = Number(valor ?? 0);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero);
  }

  isUsuarioAutenticado(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    return !!localStorage.getItem('usuarioLogado');
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

  adicionarCarrinho() {
    if (!this.isUsuarioAutenticado()) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('loginMensagem', 'Você precisa estar autenticado para adicionar itens ao carrinho.');
      }

      if (typeof window !== 'undefined') {
        this.router.navigateByUrl('/login');
      }
      return;
    }

    const storageKey = this.getCarrinhoStorageKey();
    if (!storageKey) {
      return;
    }

    try {
      const itens = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      const produtoExistente = itens.find((item: any) => item.codigo === this.obj.codigo);

      if (produtoExistente) {
        produtoExistente.quantidade += 1;
        produtoExistente.valorTotal = produtoExistente.quantidade * (produtoExistente.valor || this.obj.valorPromo || this.obj.valor);
      } else {
        itens.push({
          codigo: this.obj.codigo,
          nome: this.obj.nome,
          imagem: this.obj.imagem ?? '',
          quantidade: 1,
          valor: this.obj.valorPromo > 0 ? this.obj.valorPromo : this.obj.valor,
          valorTotal: this.obj.valorPromo > 0 ? this.obj.valorPromo : this.obj.valor,
        });
      }

      localStorage.setItem(storageKey, JSON.stringify(itens));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cestaAtualizada'));
      }
    } catch {
      return;
    }

    this.toastMensagem = `${this.obj.nome} adicionado ao carrinho.`;
    this.toastVisivel = true;

    window.setTimeout(() => {
      this.toastVisivel = false;
    }, 2200);
  }
}
