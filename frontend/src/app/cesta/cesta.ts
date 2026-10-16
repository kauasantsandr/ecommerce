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

  ngOnInit() {
    this.carregarCesta();
  }

  carregarCesta() {
    if (typeof localStorage === 'undefined') {
      this.itens = [];
      this.calculaTotal();
      return;
    }

    const dados = localStorage.getItem('cesta');
    this.itens = dados ? JSON.parse(dados) : [];
    this.calculaTotal();
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
      localStorage.setItem('cesta', JSON.stringify(this.itens));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cestaAtualizada'));
    }

    this.calculaTotal();
  }

  removerTudo() {
    this.itens = [];

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cesta', JSON.stringify(this.itens));
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cestaAtualizada'));
    }

    this.calculaTotal();
  }
}
