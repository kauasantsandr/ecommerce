import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Produto } from '../model/produto';
import { ProdutoService } from '../service/produto-service';

@Component({
  selector: 'app-admin-produto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-produto.html',
  providers: [ProdutoService],
})
export class AdminProduto {
  produto = new Produto();
  mensagem = '';

  constructor(private service: ProdutoService, public router: Router) {}

  ngOnInit() {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const dados = localStorage.getItem('usuarioLogado');
    const usuario = dados ? JSON.parse(dados) : null;

    if (!usuario || !this.ehAdmin(usuario)) {
      this.router.navigateByUrl('/');
      return;
    }

    this.produto.destaque = 1;
    this.produto.imagem = '/uploads/lenovo.jpg';
  }

  private ehAdmin(usuario: any): boolean {
    return usuario?.role === 'ADMIN' || usuario?.email === 'admin@loja.com';
  }

  salvar() {
    if (!this.produto.nome?.trim()) {
      this.mensagem = 'Informe o nome do produto.';
      return;
    }

    if (!this.produto.descritivo?.trim()) {
      this.mensagem = 'Informe a descrição do produto.';
      return;
    }

    const payload = {
      ...this.produto,
      nome: this.produto.nome.trim(),
      descritivo: this.produto.descritivo.trim(),
      valor: Number(this.produto.valor || 0),
      valorPromo: Number(this.produto.valorPromo || 0),
      quantidade: Number(this.produto.quantidade || 0),
      destaque: Number(this.produto.destaque || 1),
      imagem: this.produto.imagem?.trim() || '/uploads/lenovo.jpg',
    };

    this.service.gravar(payload).subscribe({
      next: () => {
        this.mensagem = 'Produto cadastrado com sucesso!';
        this.produto = new Produto();
        this.produto.destaque = 1;
        this.produto.imagem = '/uploads/lenovo.jpg';
      },
      error: () => {
        this.mensagem = 'Não foi possível cadastrar o produto.';
      },
    });
  }
}
