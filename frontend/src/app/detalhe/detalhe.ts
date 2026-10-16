import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  adicionarCarrinho() {
    if (!this.isUsuarioAutenticado()) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('loginMensagem', 'Você precisa estar autenticado para adicionar itens ao carrinho.');
      }

      if (typeof window !== 'undefined') {
        window.location.href = 'login';
      }
      return;
    }

    const itens = JSON.parse(localStorage.getItem('cesta') ?? '[]');
    const produtoExistente = itens.find((item: any) => item.codigo === this.obj.codigo);

    if (produtoExistente) {
      produtoExistente.quantidade += 1;
      produtoExistente.valorTotal = produtoExistente.quantidade * (produtoExistente.valor || this.obj.valorPromo || this.obj.valor);
    } else {
      itens.push({
        codigo: this.obj.codigo,
        nome: this.obj.nome,
        quantidade: 1,
        valor: this.obj.valorPromo > 0 ? this.obj.valorPromo : this.obj.valor,
        valorTotal: this.obj.valorPromo > 0 ? this.obj.valorPromo : this.obj.valor,
      });
    }

    localStorage.setItem('cesta', JSON.stringify(itens));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cestaAtualizada'));
    }

    this.toastMensagem = `${this.obj.nome} adicionado ao carrinho.`;
    this.toastVisivel = true;

    window.setTimeout(() => {
      this.toastVisivel = false;
    }, 2200);
  }
}
