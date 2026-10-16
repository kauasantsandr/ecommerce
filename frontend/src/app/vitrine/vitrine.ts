import { Component } from '@angular/core';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../service/produto-service';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
  providers: [ProdutoService]
})
export class Vitrine {
  lista: Produto[] = [];
  mensagem: string = '';
  toastMensagem = '';
  toastVisivel = false;
  criterioOrdenacao = 'recentes';
  showFilterMenu = false;

  get lancamentos(): Produto[] {
    return this.lista.slice(0, Math.min(4, this.lista.length));
  }

  get listaOrdenada(): Produto[] {
    const copia = [...this.lista];

    switch (this.criterioOrdenacao) {
      case 'az':
        return copia.sort((a, b) => a.nome.localeCompare(b.nome));
      case 'preco':
        return copia.sort((a, b) => {
          const valorA = a.valorPromo > 0 ? a.valorPromo : a.valor;
          const valorB = b.valorPromo > 0 ? b.valorPromo : b.valor;
          return valorA - valorB;
        });
      case 'recentes':
      default:
        return copia.reverse();
    }
  }

  constructor(private service: ProdutoService) {}

  ngOnInit() {
    this.mensagem = '';

    this.service.carregarVitrine().subscribe(
      (value) => (this.lista = value),
      (error) => (this.mensagem = 'Ocorreu um erro! tente mais tarde!'),
      () => console.log('Completed')
    );
  }

  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }

  selecionarFiltro(criterio: string) {
    this.criterioOrdenacao = criterio;
    this.showFilterMenu = false;
  }

  verDetalhe(obj: Produto) {
    localStorage.setItem('produto', JSON.stringify(obj));
    location.href = 'detalhe';
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

  adicionarCarrinho(obj: Produto) {
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
    const produtoExistente = itens.find((item: any) => item.codigo === obj.codigo);

    if (produtoExistente) {
      produtoExistente.quantidade += 1;
      produtoExistente.valorTotal = produtoExistente.quantidade * (produtoExistente.valor || obj.valorPromo || obj.valor);
    } else {
      itens.push({
        codigo: obj.codigo,
        nome: obj.nome,
        quantidade: 1,
        valor: obj.valorPromo > 0 ? obj.valorPromo : obj.valor,
        valorTotal: obj.valorPromo > 0 ? obj.valorPromo : obj.valor,
      });
    }

    localStorage.setItem('cesta', JSON.stringify(itens));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cestaAtualizada'));
    }

    this.toastMensagem = `${obj.nome} adicionado ao carrinho.`;
    this.toastVisivel = true;

    window.setTimeout(() => {
      this.toastVisivel = false;
    }, 2000);
  }
}
