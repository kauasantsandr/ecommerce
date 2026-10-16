import { Component, ChangeDetectorRef } from '@angular/core';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ProdutoService } from '../service/produto-service';

@Component({
  imports: [CommonModule, FormsModule],
  standalone: true,
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
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

  constructor(private service: ProdutoService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.mensagem = '';
    this.carregarProdutos();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.router.url === '/') {
        this.carregarProdutos();
      }
    });
  }

  carregarProdutos() {
    this.service.carregarVitrine().subscribe({
      next: (value) => {
        this.lista = Array.isArray(value) ? value : [];
        this.mensagem = '';
        this.cdr.markForCheck();
      },
      error: () => {
        this.lista = [];
        this.mensagem = 'Ocorreu um erro! tente mais tarde!';
        this.cdr.markForCheck();
      },
    });
  }

  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }

  selecionarFiltro(criterio: string) {
    this.criterioOrdenacao = criterio;
    this.showFilterMenu = false;
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

  verDetalhe(obj: Produto) {
    localStorage.setItem('produto', JSON.stringify(obj));
    this.router.navigateByUrl('/detalhe');
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

  adicionarCarrinho(obj: Produto) {
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
      const produtoExistente = itens.find((item: any) => item.codigo === obj.codigo);

      if (produtoExistente) {
        produtoExistente.quantidade += 1;
        produtoExistente.valorTotal = produtoExistente.quantidade * (produtoExistente.valor || obj.valorPromo || obj.valor);
      } else {
        itens.push({
          codigo: obj.codigo,
          nome: obj.nome,
          imagem: obj.imagem ?? '',
          quantidade: 1,
          valor: obj.valorPromo > 0 ? obj.valorPromo : obj.valor,
          valorTotal: obj.valorPromo > 0 ? obj.valorPromo : obj.valor,
        });
      }

      localStorage.setItem(storageKey, JSON.stringify(itens));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cestaAtualizada'));
      }
    } catch {
      return;
    }

    this.toastMensagem = `${obj.nome} adicionado ao carrinho.`;
    this.toastVisivel = true;

    window.setTimeout(() => {
      this.toastVisivel = false;
    }, 2000);
  }
}
