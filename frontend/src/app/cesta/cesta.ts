import { Component } from '@angular/core';
import { ItemCesta } from '../model/item-cesta';
import { CommonModule } from '@angular/common';


@Component({
  imports: [CommonModule],
  selector: 'app-cesta',
  styleUrl: './cesta.css',
  templateUrl: './cesta.html',
})
export class Cesta {
  mensagem: string = '';
  valorCesta: number = 0;
  itens: any[] = [];

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

  ngOnInit() {
    this.carregarCesta();
  }

  carregarCesta() {
    if (typeof localStorage === 'undefined') {
      this.itens = [];
      this.calculaTotal();
      return;
    }

    const storageKey = this.getCarrinhoStorageKey();
    if (!storageKey) {
      this.itens = [];
      this.calculaTotal();
      return;
    }

    try {
      const dados = localStorage.getItem(storageKey);
      this.itens = dados ? JSON.parse(dados) : [];
    } catch {
      this.itens = [];
    }

    this.calculaTotal();
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

  calculaTotal() {
    this.valorCesta = 0;
    for (const obj of this.itens) {
      this.valorCesta += obj.valorTotal ?? 0;
    }
  }

  remover(item: any) {
    this.itens = this.itens.filter((obj) => obj.codigo !== item.codigo);

    if (typeof localStorage !== 'undefined') {
      const storageKey = this.getCarrinhoStorageKey();
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(this.itens));
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cestaAtualizada'));
    }

    this.calculaTotal();
  }

  removerTudo() {
    this.itens = [];

    if (typeof localStorage !== 'undefined') {
      const storageKey = this.getCarrinhoStorageKey();
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(this.itens));
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cestaAtualizada'));
    }

    this.calculaTotal();
  }
}
